'use client';

import { useEffect, useRef, useState } from 'react';

export function VTurbPlayerLipedema() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current || initializedRef.current) return;

    // Verificar se já foi inicializado
    if (containerRef.current.querySelector('vturb-smartplayer')) {
      initializedRef.current = true;
      return;
    }

    // Executar o script de performance primeiro
    const performanceScript = document.createElement('script');
    performanceScript.textContent = `!function(i,n){i._plt=i._plt||(n&&n.timeOrigin?n.timeOrigin+n.now():Date.now())}(window,performance);`;
    document.head.appendChild(performanceScript);

    // Inserir o elemento do player IMEDIATAMENTE (antes dos scripts)
    const embedHTML = '<vturb-smartplayer id="vid-692dd892924c1d1feb519023" autoplay playsinline style="display:block;margin:0 auto;width:100%;height:100%;"></vturb-smartplayer>';
    containerRef.current.innerHTML = embedHTML;

    // Verificar se o smartplayer.js já foi carregado
    const existingSmartPlayer = document.querySelector('script[src*="smartplayer-wc"]');
    
    // Carregar smartplayer.js se não existir
    if (!existingSmartPlayer) {
      const smartPlayerScript = document.createElement('script');
      smartPlayerScript.src = 'https://scripts.converteai.net/lib/js/smartplayer-wc/v4/smartplayer.js';
      smartPlayerScript.async = true;
      document.head.appendChild(smartPlayerScript);
    }

    // Verificar se o script do player já existe
    const existingScript = document.querySelector('script[src*="692dd892924c1d1feb519023"]');
    
    // Carregar o script do player
    if (!existingScript) {
      const playerScript = document.createElement('script');
      playerScript.type = 'text/javascript';
      playerScript.src = 'https://scripts.converteai.net/7884099c-a7d0-4d10-b5db-0f8165b855ab/players/692dd892924c1d1feb519023/v4/player.js';
      playerScript.async = true;
      
      playerScript.onload = () => {
        // Aguardar o player estar pronto e tentar habilitar autoplay com áudio
        setTimeout(() => {
          const player = containerRef.current?.querySelector('vturb-smartplayer') as any;
          if (player && player.video) {
            player.video.muted = false;
            player.video.play().catch(() => {
              // Se falhar, tentar com muted primeiro e depois habilitar áudio
              player.video.muted = true;
              player.video.play().then(() => {
                player.video.muted = false;
              }).catch(() => {});
            });
          }
        }, 1000);
      };
      
      document.head.appendChild(playerScript);
    } else {
      // Se o script já existe, tentar habilitar autoplay
      setTimeout(() => {
        const player = containerRef.current?.querySelector('vturb-smartplayer') as any;
        if (player && player.video) {
          player.video.muted = false;
          player.video.play().catch(() => {
            player.video.muted = true;
            player.video.play().then(() => {
              player.video.muted = false;
            }).catch(() => {});
          });
        }
      }, 1000);
    }

    initializedRef.current = true;
  }, [mounted]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '400px',
        position: 'relative',
        backgroundColor: mounted ? 'transparent' : '#f5f5f5'
      }}
    />
  );
}

