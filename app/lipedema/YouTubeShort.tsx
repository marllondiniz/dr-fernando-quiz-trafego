'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './page.module.css';

export function YouTubeShort({ videoId }: { videoId: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [mounted, setMounted] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && iframeRef.current) {
      const iframe = iframeRef.current;
      
      const handleLoad = () => {
        setLoadError(false);
      };

      const handleError = () => {
        setLoadError(true);
      };

      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      // Timeout para detectar se não carregou
      const timeout = setTimeout(() => {
        try {
          // Tentar acessar o conteúdo do iframe para verificar se carregou
          if (iframe.contentWindow === null) {
            setLoadError(true);
          }
        } catch (e) {
          // Erro de CORS é esperado, mas significa que o iframe existe
        }
      }, 3000);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
        clearTimeout(timeout);
      };
    }
  }, [mounted]);

  return (
    <div ref={containerRef} className={styles.youtubeWrapper}>
      {mounted && (
        <iframe
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
          title="Resultados do tratamento de Lipedema"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className={styles.youtubeIframe}
          style={{ 
            display: 'block',
            border: 'none'
          }}
        />
      )}
      {loadError && (
        <div className={styles.youtubeError}>
          <p>Não foi possível carregar o vídeo.</p>
          <a 
            href={`https://www.youtube.com/shorts/${videoId}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            Assista no YouTube
          </a>
        </div>
      )}
    </div>
  );
}

