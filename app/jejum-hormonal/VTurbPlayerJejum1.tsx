'use client';

import { useEffect, useRef, useState } from 'react';

export function VTurbPlayerJejum1() {
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
    const embedHTML = '<vturb-smartplayer id="vid-693705b58561d5e93fdca501" style="display: block; margin: 0 auto; width: 100%; max-width: 400px;"></vturb-smartplayer>';
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
    const existingScript = document.querySelector('script[src*="693705b58561d5e93fdca501"]');
    
    // Carregar o script do player
    if (!existingScript) {
      const playerScript = document.createElement('script');
      playerScript.type = 'text/javascript';
      playerScript.src = 'https://scripts.converteai.net/7884099c-a7d0-4d10-b5db-0f8165b855ab/players/693705b58561d5e93fdca501/v4/player.js';
      playerScript.async = true;
      document.head.appendChild(playerScript);
    }

    initializedRef.current = true;
  }, [mounted]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        width: '100%', 
        maxWidth: '400px',
        margin: '0 auto',
        position: 'relative',
        minHeight: '300px',
        backgroundColor: mounted ? 'transparent' : '#f5f5f5'
      }}
    />
  );
}

