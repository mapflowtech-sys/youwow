import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSongReadyEmail({
  to,
  orderId,
  audioUrl,
}: {
  to: string;
  orderId: string;
  audioUrl: string;
}) {
  try {
    // Скачиваем MP3 файл для прикрепления к письму
    const audioResponse = await fetch(audioUrl);
    const audioBuffer = await audioResponse.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString('base64');

    const { data, error } = await resend.emails.send({
      from: 'YouWow <hello@youwow.ru>',
      to: [to],
      subject: `🎵 Ваша персональная песня готова! | YouWow`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                border-radius: 12px 12px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #f8fafc;
                padding: 40px 30px;
                border-radius: 0 0 12px 12px;
              }
              .content p {
                margin: 15px 0;
                font-size: 16px;
              }
              .highlight-box {
                background: white;
                border-left: 4px solid #8b5cf6;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
              }
              .button {
                display: inline-block;
                background: #8b5cf6;
                color: white !important;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                margin: 25px 0;
                font-weight: bold;
                transition: background 0.3s;
              }
              .button:hover {
                background: #7c3aed;
              }
              .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 2px solid #e2e8f0;
                color: #666;
                font-size: 14px;
              }
              .footer a {
                color: #8b5cf6;
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }
              .emoji {
                font-size: 24px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎉 Ваша песня готова!</h1>
              </div>
              <div class="content">
                <p>Здравствуйте!</p>

                <p>Отличные новости! Ваша персональная песня успешно создана и готова к прослушиванию.</p>

                <div class="highlight-box">
                  <p style="margin: 0;"><strong>📋 Номер заказа:</strong> #${orderId}</p>
                  <p style="margin: 10px 0 0 0;"><strong>🎵 Услуга:</strong> Персональная песня</p>
                </div>

                <p><strong>🎧 Ваша музыка находится во вложении к этому письму!</strong></p>
                <p>Просто скачайте MP3 файл из приложения и наслаждайтесь уникальной композицией, созданной специально для вас.</p>

                <p>Также вы можете прослушать и скачать вашу песню на нашем сайте:</p>
                <div style="text-align: center;">
                  <a href="https://youwow.ru/order/${orderId}" class="button">Открыть на сайте YouWow</a>
                </div>

                <p style="margin-top: 30px;">Спасибо, что выбрали YouWow! Желаем вам всего хорошего! ✨</p>
              </div>
              <div class="footer">
                <p><strong>Есть вопросы?</strong></p>
                <p>
                  📧 Email: <a href="mailto:support@youwow.ru">support@youwow.ru</a><br>
                  💬 Telegram: <a href="https://t.me/youwow_support">@youwow_support</a>
                </p>
                <p style="margin-top: 20px;">
                  <a href="https://youwow.ru">youwow.ru</a> |
                  <a href="https://youwow.ru/legal/privacy">Политика конфиденциальности</a> |
                  <a href="https://youwow.ru/legal/terms">Пользовательское соглашение</a>
                </p>
                <p style="margin-top: 15px; color: #999;">&copy; 2025 YouWow. Все права защищены.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      attachments: [
        {
          filename: `youwow-song-${orderId}.mp3`,
          content: audioBase64,
        },
      ],
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

export async function sendOrderConfirmation({
  to,
  orderId,
  serviceName,
  price,
}: {
  to: string;
  orderId: string;
  serviceName: string;
  price: number;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'YouWow <hello@youwow.ru>',
      to: [to],
      subject: `Заказ #${orderId} принят | YouWow`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%);
                color: white;
                padding: 40px 30px;
                text-align: center;
                border-radius: 12px 12px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #f8fafc;
                padding: 40px 30px;
                border-radius: 0 0 12px 12px;
              }
              .content p {
                margin: 15px 0;
                font-size: 16px;
              }
              .info-box {
                background: white;
                border-left: 4px solid #8b5cf6;
                padding: 20px;
                margin: 25px 0;
                border-radius: 8px;
              }
              .footer {
                text-align: center;
                margin-top: 40px;
                padding-top: 30px;
                border-top: 2px solid #e2e8f0;
                color: #666;
                font-size: 14px;
              }
              .footer a {
                color: #8b5cf6;
                text-decoration: none;
              }
              .footer a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>✅ Заказ принят!</h1>
              </div>
              <div class="content">
                <p>Здравствуйте!</p>

                <p>Ваш заказ успешно принят и находится в обработке.</p>

                <div class="info-box">
                  <p style="margin: 0;"><strong>📋 Номер заказа:</strong> #${orderId}</p>
                  <p style="margin: 10px 0 0 0;"><strong>🎵 Услуга:</strong> ${serviceName}</p>
                  <p style="margin: 10px 0 0 0;"><strong>💰 Стоимость:</strong> ${price} ₽</p>
                </div>

                <p><strong>⏳ Время ожидания:</strong> до 24 часов</p>
                <p>Мы пришлем вам письмо с готовым результатом, как только генерация будет завершена.</p>

                <p style="margin-top: 30px;">Спасибо за ваш заказ! Желаем вам всего хорошего! ✨</p>
              </div>
              <div class="footer">
                <p><strong>Есть вопросы?</strong></p>
                <p>
                  📧 Email: <a href="mailto:support@youwow.ru">support@youwow.ru</a><br>
                  💬 Telegram: <a href="https://t.me/youwow_support">@youwow_support</a>
                </p>
                <p style="margin-top: 20px;">
                  <a href="https://youwow.ru">youwow.ru</a> |
                  <a href="https://youwow.ru/legal/privacy">Политика конфиденциальности</a> |
                  <a href="https://youwow.ru/legal/terms">Пользовательское соглашение</a>
                </p>
                <p style="margin-top: 15px; color: #999;">&copy; 2025 YouWow. Все права защищены.</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('Email send error:', error);
      return { success: false, error };
    }

    console.log('Confirmation email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return { success: false, error };
  }
}
