'use client';

import { useEffect } from 'react';
import Script from 'next/script';

export default function YandexMetrika() {
  useEffect(() => {
    // Initialize Yandex Metrika after script loads
    if (typeof window !== 'undefined' && (window as any).ym) {
      (window as any).ym(106067742, 'init', {
        ssr: true,
        webvisor: true,
        clickmap: true,
        ecommerce: 'dataLayer',
        accurateTrackBounce: true,
        trackLinks: true,
      });
    }
  }, []);

  return (
    <>
      {/* Yandex.Metrika counter */}
      <Script
        id="yandex-metrika"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
            })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=106067742', 'ym');

            ym(106067742, 'init', {
              ssr:true,
              webvisor:true,
              clickmap:true,
              ecommerce:"dataLayer",
              accurateTrackBounce:true,
              trackLinks:true
            });
          `,
        }}
      />
      <noscript>
        <div>
          <img
            src="https://mc.yandex.ru/watch/106067742"
            style={{ position: 'absolute', left: '-9999px' }}
            alt=""
          />
        </div>
      </noscript>
    </>
  );
}
