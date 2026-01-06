import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateVideoWithCover, cropImageToSquare } from '@/lib/video-generator';
import path from 'path';
import fs from 'fs';
import os from 'os';

export const maxDuration = 300; // 5 минут максимум для генерации видео

interface CreateVideoRequest {
  orderId: string;
  coverType: 'preset' | 'custom';
  coverImage?: string; // Для preset: '1'-'6', для custom: base64 или URL
  resolution?: '720p' | '1080p';
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateVideoRequest = await request.json();
    const { orderId, coverType, coverImage, resolution = '720p' } = body;

    // Валидация
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    if (!coverType || !['preset', 'custom'].includes(coverType)) {
      return NextResponse.json(
        { error: 'Invalid cover type. Must be "preset" or "custom"' },
        { status: 400 }
      );
    }

    if (!coverImage) {
      return NextResponse.json(
        { error: 'Cover image is required' },
        { status: 400 }
      );
    }

    // Получаем заказ из базы данных
    const supabase = await createClient();
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (!order.result_url) {
      return NextResponse.json(
        { error: 'Song audio not ready yet' },
        { status: 400 }
      );
    }

    // Определяем путь к изображению обложки
    let coverImagePath: string;
    let needsCleanup = false;

    if (coverType === 'preset') {
      // Проверяем валидность номера пресета
      const presetNumber = parseInt(coverImage);
      if (isNaN(presetNumber) || presetNumber < 1 || presetNumber > 6) {
        return NextResponse.json(
          { error: 'Invalid preset number. Must be 1-6' },
          { status: 400 }
        );
      }

      coverImagePath = path.join(
        process.cwd(),
        'public',
        'song-covers',
        'presets',
        `preset-${presetNumber}.jpg`
      );

      if (!fs.existsSync(coverImagePath)) {
        return NextResponse.json(
          { error: `Preset cover ${presetNumber} not found` },
          { status: 404 }
        );
      }
    } else {
      // Для custom - сохраняем временно загруженное изображение
      const tempDir = os.tmpdir();
      const tempImagePath = path.join(tempDir, `cover-${orderId}-${Date.now()}.jpg`);

      // Проверяем формат (base64 или URL)
      if (coverImage.startsWith('data:image')) {
        // Base64
        const base64Data = coverImage.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        fs.writeFileSync(tempImagePath, buffer);
      } else if (coverImage.startsWith('http')) {
        // URL - скачиваем
        const response = await fetch(coverImage);
        const buffer = Buffer.from(await response.arrayBuffer());
        fs.writeFileSync(tempImagePath, buffer);
      } else {
        return NextResponse.json(
          { error: 'Invalid image format. Must be base64 or URL' },
          { status: 400 }
        );
      }

      coverImagePath = tempImagePath;
      needsCleanup = true;
    }

    // Скачиваем аудио файл временно
    const tempDir = os.tmpdir();
    const audioPath = path.join(tempDir, `audio-${orderId}.mp3`);

    const audioResponse = await fetch(order.result_url);
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    fs.writeFileSync(audioPath, audioBuffer);

    // Обрабатываем изображение (обрезаем в квадрат если нужно)
    const croppedImagePath = path.join(tempDir, `cover-cropped-${orderId}-${Date.now()}.jpg`);
    const cropResult = await cropImageToSquare(coverImagePath, croppedImagePath);

    if (!cropResult.success) {
      // Очистка
      if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
      if (needsCleanup && fs.existsSync(coverImagePath)) fs.unlinkSync(coverImagePath);

      return NextResponse.json(
        { error: `Failed to process image: ${cropResult.error}` },
        { status: 500 }
      );
    }

    // Генерируем видео
    const outputPath = path.join(tempDir, `video-${orderId}-${Date.now()}.mp4`);

    let progressValue = 0;
    const result = await generateVideoWithCover({
      audioPath,
      imagePath: croppedImagePath,
      outputPath,
      resolution,
      onProgress: (progress) => {
        progressValue = progress;
        console.log(`Video generation progress: ${progress}%`);
      }
    });

    // Очистка временных файлов
    if (fs.existsSync(audioPath)) fs.unlinkSync(audioPath);
    if (needsCleanup && fs.existsSync(coverImagePath)) fs.unlinkSync(coverImagePath);
    if (fs.existsSync(croppedImagePath)) fs.unlinkSync(croppedImagePath);

    if (!result.success) {
      return NextResponse.json(
        { error: `Video generation failed: ${result.error}` },
        { status: 500 }
      );
    }

    // Читаем сгенерированный видео файл
    const videoBuffer = fs.readFileSync(result.outputPath!);

    // Конвертируем в base64 для возврата
    const videoBase64 = videoBuffer.toString('base64');

    // Очистка выходного файла
    if (fs.existsSync(result.outputPath!)) {
      fs.unlinkSync(result.outputPath!);
    }

    // Возвращаем результат
    return NextResponse.json({
      success: true,
      video: `data:video/mp4;base64,${videoBase64}`,
      duration: result.duration,
      fileSize: result.fileSize,
      resolution
    });

  } catch (error) {
    console.error('Create video error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
