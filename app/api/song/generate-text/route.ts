import { NextRequest, NextResponse } from 'next/server';
import { generateSongText, type SongFormData } from '@/lib/genapi/text-generation';

export async function POST(request: NextRequest) {
  try {
    const formData: SongFormData = await request.json();

    // Валидация
    if (!formData.aboutWho || !formData.aboutWhat || !formData.email) {
      return NextResponse.json(
        { error: 'Заполните все обязательные поля' },
        { status: 400 }
      );
    }

    if (!formData.genre || !formData.style || !formData.occasion) {
      return NextResponse.json(
        { error: 'Выберите жанр, стиль и повод' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return NextResponse.json(
        { error: 'Некорректный email' },
        { status: 400 }
      );
    }

    const songText = await generateSongText(formData);

    return NextResponse.json({
      success: true,
      songText,
      model: process.env.AI_MODEL || 'chatgpt'
    });

  } catch (error) {
    console.error('API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Ошибка генерации';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export const maxDuration = 120;
