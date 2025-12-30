import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Проверяем что URL из доверенного источника (Yandex Cloud или наш Gen-API)
    const allowedHosts = [
      'gen-api.storage.yandexcloud.net',
      'storage.yandexcloud.net',
      'yandex.net',
    ];

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL' },
        { status: 400 }
      );
    }

    const isAllowed = allowedHosts.some(host =>
      parsedUrl.hostname.endsWith(host)
    );

    if (!isAllowed) {
      return NextResponse.json(
        { error: 'URL not allowed' },
        { status: 403 }
      );
    }

    // Скачиваем файл
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Failed to fetch file');
    }

    // Получаем blob
    const blob = await response.blob();

    // Возвращаем с правильными заголовками для скачивания
    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="song.mp3"',
        'Cache-Control': 'public, max-age=31536000',
      },
    });

  } catch (error) {
    console.error('Download proxy error:', error);
    return NextResponse.json(
      { error: 'Download failed' },
      { status: 500 }
    );
  }
}
