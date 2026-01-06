import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import fs from 'fs';

// Устанавливаем путь к FFmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export interface VideoGenerationOptions {
  audioPath: string;          // Путь к MP3 файлу
  imagePath: string;          // Путь к изображению обложки
  outputPath: string;         // Путь для выходного MP4 файла
  resolution?: '720p' | '1080p'; // Разрешение видео (по умолчанию 720p)
  onProgress?: (progress: number) => void; // Колбэк для отслеживания прогресса
}

export interface VideoGenerationResult {
  success: boolean;
  outputPath?: string;
  error?: string;
  duration?: number;          // Длительность видео в секундах
  fileSize?: number;          // Размер файла в байтах
}

/**
 * Генерирует MP4 видео из статичного изображения и аудио файла
 *
 * @param options - Параметры генерации видео
 * @returns Promise с результатом генерации
 */
export async function generateVideoWithCover(
  options: VideoGenerationOptions
): Promise<VideoGenerationResult> {
  const {
    audioPath,
    imagePath,
    outputPath,
    resolution = '720p',
    onProgress
  } = options;

  return new Promise((resolve, reject) => {
    try {
      // Проверяем существование входных файлов
      if (!fs.existsSync(audioPath)) {
        return resolve({
          success: false,
          error: `Audio file not found: ${audioPath}`
        });
      }

      if (!fs.existsSync(imagePath)) {
        return resolve({
          success: false,
          error: `Image file not found: ${imagePath}`
        });
      }

      // Определяем разрешение
      const size = resolution === '1080p' ? '1920x1080' : '1280x720';

      // Создаем директорию для выходного файла если её нет
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      let videoDuration = 0;

      // FFmpeg команда для создания видео
      const command = ffmpeg()
        .input(imagePath)
        .inputOptions([
          '-loop 1',           // Зацикливаем изображение
          '-framerate 1'       // 1 кадр в секунду (для статичного изображения)
        ])
        .input(audioPath)
        .outputOptions([
          '-c:v libx264',      // Видео кодек H.264
          '-tune stillimage',  // Оптимизация для статичного изображения
          '-c:a aac',          // Аудио кодек AAC
          '-b:a 192k',         // Битрейт аудио 192 kbps
          '-pix_fmt yuv420p',  // Формат пикселей (совместимость)
          '-shortest',         // Длительность = длине аудио
          `-s ${size}`,        // Разрешение видео
          '-movflags +faststart' // Оптимизация для веб-стриминга
        ])
        .output(outputPath);

      // Отслеживание прогресса
      command.on('progress', (progress) => {
        if (onProgress && progress.percent) {
          onProgress(Math.round(progress.percent));
        }
        if (progress.timemark) {
          // Сохраняем длительность видео
          const timeParts = progress.timemark.split(':');
          videoDuration =
            parseInt(timeParts[0]) * 3600 +
            parseInt(timeParts[1]) * 60 +
            parseFloat(timeParts[2]);
        }
      });

      // Обработка ошибок
      command.on('error', (err) => {
        console.error('FFmpeg error:', err);
        resolve({
          success: false,
          error: err.message
        });
      });

      // Завершение генерации
      command.on('end', () => {
        try {
          const stats = fs.statSync(outputPath);

          resolve({
            success: true,
            outputPath,
            duration: videoDuration,
            fileSize: stats.size
          });
        } catch (error) {
          resolve({
            success: false,
            error: 'Failed to read generated video file'
          });
        }
      });

      // Запускаем процесс
      command.run();

    } catch (error) {
      console.error('Video generation error:', error);
      resolve({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

/**
 * Проверяет, что изображение является квадратным (или близко к квадрату)
 * и при необходимости обрезает его
 *
 * @param imagePath - Путь к изображению
 * @param outputPath - Путь для обрезанного изображения
 * @returns Promise с путем к обработанному изображению
 */
export async function cropImageToSquare(
  imagePath: string,
  outputPath: string
): Promise<{ success: boolean; outputPath?: string; error?: string }> {
  return new Promise((resolve) => {
    try {
      if (!fs.existsSync(imagePath)) {
        return resolve({
          success: false,
          error: `Image file not found: ${imagePath}`
        });
      }

      // Создаем директорию для выходного файла если её нет
      const outputDir = path.dirname(outputPath);
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      ffmpeg(imagePath)
        .outputOptions([
          '-vf scale=1080:1080:force_original_aspect_ratio=increase,crop=1080:1080',
          '-frames:v 1'
        ])
        .output(outputPath)
        .on('error', (err) => {
          console.error('Image crop error:', err);
          resolve({
            success: false,
            error: err.message
          });
        })
        .on('end', () => {
          resolve({
            success: true,
            outputPath
          });
        })
        .run();

    } catch (error) {
      console.error('Image processing error:', error);
      resolve({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });
}

/**
 * Получает информацию о длительности аудио файла
 *
 * @param audioPath - Путь к аудио файлу
 * @returns Promise с длительностью в секундах
 */
export async function getAudioDuration(audioPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(audioPath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration || 0);
      }
    });
  });
}
