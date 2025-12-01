import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quiz Dr. Fernando',
  description:
    'Descubra em menos de 60 segundos o que está travando o seu emagrecimento com o protocolo do Dr. Fernando.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="dns-prefetch" href="https://cdn.converteai.net" />
        <link rel="dns-prefetch" href="https://scripts.converteai.net" />
        <link rel="dns-prefetch" href="https://images.converteai.net" />
        <link rel="dns-prefetch" href="https://api.vturb.com.br" />
        <link rel="preload" href="https://scripts.converteai.net/7884099c-a7d0-4d10-b5db-0f8165b855ab/players/692dd76e8c029b83a0a2fbb4/v4/player.js" as="script" />
        <link rel="preload" href="https://scripts.converteai.net/7884099c-a7d0-4d10-b5db-0f8165b855ab/players/692dd892924c1d1feb519023/v4/player.js" as="script" />
        <link rel="preload" href="https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js" as="script" />
        <link rel="preload" href="https://cdn.converteai.net/7884099c-a7d0-4d10-b5db-0f8165b855ab/692dd6c59dbbfd0701737b19/main.m3u8" as="fetch" />
        <link rel="preload" href="https://cdn.converteai.net/7884099c-a7d0-4d10-b5db-0f8165b855ab/692dd7ed9dbbfd0701737c83/main.m3u8" as="fetch" />
      </head>
      <body className={inter.className}>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '406008121822707');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=406008121822707&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  );
}

