'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { usePageView } from '../hooks/usePageView';
import { links } from '../../config/links';
import { VTurbPlayerJejum } from './VTurbPlayerJejum';
import { VTurbPlayerJejum1 } from './VTurbPlayerJejum1';
import { VTurbPlayerJejum2 } from './VTurbPlayerJejum2';
import { VTurbPlayerJejum3 } from './VTurbPlayerJejum3';
import styles from './page.module.css';

export function JejumHormonalClient() {
  usePageView();
  const [currentDeliverable, setCurrentDeliverable] = useState(0);
  const [currentVideo, setCurrentVideo] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const videosCarouselRef = useRef<HTMLDivElement>(null);
  const ctaLink = links.jejumHormonal;

  const benefits = [
    {
      title: 'Adeus ao vício em doce e fome constante',
      subtitle: 'Leptina volta a funcionar, saciedade reaparece',
    },
    {
      title: 'Gordura localizada finalmente responde',
      subtitle: 'Insulina regulada = menos acúmulo em abdômen e quadril',
    },
    {
      title: 'Noites reparadoras voltam',
      subtitle: 'Melatonina e cortisol entram em equilíbrio',
    },
    {
      title: 'Energia o dia inteiro',
      subtitle: 'Tireoide ativada, foco e disposição de volta',
    },
    {
      title: 'Músculos firmes, libido acesa',
      subtitle: 'Testosterona feminina em ação',
    },
    {
      title: 'Cabeça leve, sem névoa mental',
      subtitle: 'Cortisol estabiliza, humor volta ao eixo',
    },
    {
      title: 'Corpo feminino em paz',
      subtitle: 'Progesterona equilibrada = adeus TPM, secura e fogachos',
    },
    {
      title: 'Beleza que vem de dentro',
      subtitle: 'Estrogênio ajustado reflete na pele, cabelo e unhas',
    },
  ];

  const deliverables = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: 'CONSULTA DE ANÁLISE METABÓLICA',
      items: [
        'Sessão individual com o Dr. Fernando',
        'Scanner corporal 3D + bioimpedância (ou IA no online)',
        'Investigação hormonal e metabólica completa',
        'Mapeamento alimentar e emocional',
        'Plano clínico inicial pronto para aplicar',
      ],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'JEJUM HORMONAL® EXPERIENCE',
      items: [
        'Consultas quinzenais com o Dr. Fernando',
        'Estratégia alimentar personalizada',
        'Dieta FMD adaptada para desbloquear gordura',
        'Scanner 3D + Bioimpedância para medir progresso',
        'Acompanhamento semanal com nutricionista',
        'Canal VIP com o time',
        'Acesso a terapias injetáveis (quando indicado)',
      ],
    },
  ];

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.clientWidth;
      const currentIndex = Math.round(scrollLeft / cardWidth);
      setCurrentDeliverable(currentIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({
      left: currentDeliverable * cardWidth,
      behavior: 'smooth',
    });
  }, [currentDeliverable]);

  useEffect(() => {
    const carousel = videosCarouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.clientWidth;
      const currentIndex = Math.round(scrollLeft / cardWidth);
      setCurrentVideo(currentIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const carousel = videosCarouselRef.current;
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({
      left: currentVideo * cardWidth,
      behavior: 'smooth',
    });
  }, [currentVideo]);


  return (
    <main className={styles.page}>
      {/* VSL Section */}
      <section id="video" className={`${styles.section} ${styles.vsl}`}>
        <div className={styles.videoWrapper}>
          <VTurbPlayerJejum />
        </div>
        <p className={styles.supportText}>
          Descubra o protocolo clínico que já ajudou <span className={styles.highlight}>mais de 10 mil mulheres</span> a voltarem a emagrecer — mesmo após os 40.
        </p>
        <Link className={styles.ctaPrimary} href={ctaLink} target="_blank" rel="noopener noreferrer" data-append-utms="true">
          <div className={styles.ctaBadge}>⚡ RESPOSTA EM MINUTOS</div>
          <div className={styles.ctaContent}>
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
            <span>SIM, QUERO FALAR COM A EQUIPE AGORA</span>
          </div>
          <span className={styles.ctaSubtext}>Atendimento personalizado • Sem compromisso</span>
        </Link>
      </section>

      {/* Authority Section */}
      <section className={`${styles.section} ${styles.authoritySection}`}>
        <div className={styles.authorityContent}>
          <div className={styles.authorityImageWrapper}>
            <Image
              src="/Fernando Del Piero.png"
              alt="Dr. Fernando Del Piero"
              width={300}
              height={400}
              className={styles.authorityImage}
              unoptimized
            />
          </div>
          <div className={styles.authorityText}>
            <h2 className={styles.authorityName}>Dr. Fernando Del Piero</h2>
            <div className={styles.authorityDescription}>
              <p className={styles.authorityParagraph}>
                Médico há <strong>12 anos</strong> — referência em emagrecimento feminino 40+.
              </p>
              <p className={styles.authorityParagraph}>
                Mais de <strong>10 mil mulheres</strong> acompanhadas presencial e online.
              </p>
              <p className={styles.authorityParagraph}>
                Protocolos baseados em <strong>ciência</strong>. Desenhados para o <strong>metabolismo da mulher</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Videos Section - Below VSL */}
      <section className={`${styles.section} ${styles.videosSection}`} style={{ padding: '3rem 0' }}>
        <h2 className={styles.sectionTitle}>
          Veja <span className={styles.highlight}>resultados reais</span> de mulheres que transformaram o corpo
        </h2>
        <div className={styles.videosCarouselWrapper}>
          <div
            ref={videosCarouselRef}
            className={styles.videosCarousel}
          >
            <div className={styles.videoCarouselItem}>
              <VTurbPlayerJejum1 />
            </div>
            <div className={styles.videoCarouselItem}>
              <VTurbPlayerJejum2 />
            </div>
            <div className={styles.videoCarouselItem}>
              <VTurbPlayerJejum3 />
            </div>
          </div>
          
          <div className={styles.carouselDots}>
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentVideo ? styles.activeDot : ''}`}
                onClick={() => setCurrentVideo(index)}
                aria-label={`Ir para vídeo ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Jejum Hormonal®</span>
          </div>

          <h1 className={styles.headline}>
            O motivo real por que{' '}
            <span className={styles.highlight}>tantas mulheres 40+</span>
            <br />
            travam no emagrecimento.
          </h1>

          <div className={styles.problemsList}>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cansaço constante.</span>
            </div>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Libido em queda.</span>
            </div>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>E um corpo que simplesmente não emagrece.</span>
            </div>
          </div>

          <p className={styles.heroDescription}>
            Quando os <strong>8 hormônios do emagrecimento feminino</strong> voltam a funcionar em ordem, <strong>o corpo colabora</strong> e o <strong>emagrecimento acontece como consequência.</strong>
          </p>

          <Link className={styles.ctaPrimary} href="#video">
            <div className={styles.ctaContent}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>QUERO ENTENDER SE É PARA MIM</span>
            </div>
            <span className={styles.ctaSubtext}>Assista o vídeo e descubra em 5 minutos</span>
          </Link>

          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>+10 mil mulheres</span>
            </div>
            <div className={styles.trustBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Baseado em ciência</span>
            </div>
            <div className={styles.trustBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Resultados em 21 dias</span>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className={`${styles.section} ${styles.deliverables}`}>
        <h2 className={styles.sectionTitle}>
          O que você recebe no protocolo:
        </h2>
        <div className={styles.cardsGrid}>
          {deliverables.map((deliverable, index) => (
            <article key={index} className={styles.deliverableCard}>
              <div className={styles.cardIcon}>{deliverable.icon}</div>
              <h3>{deliverable.title}</h3>
              <ul>
                {deliverable.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        
        {/* Carousel Mobile */}
        <div className={styles.deliverablesCarouselWrapper}>
          <div
            ref={carouselRef}
            className={styles.deliverablesCarousel}
          >
            {deliverables.map((deliverable, index) => (
              <article
                key={index}
                className={`${styles.deliverableCard} ${styles.deliverableCardCarousel}`}
              >
                <div className={styles.cardIcon}>{deliverable.icon}</div>
                <h3>{deliverable.title}</h3>
                <ul>
                  {deliverable.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          
          <div className={styles.carouselDots}>
            {deliverables.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentDeliverable ? styles.activeDot : ''}`}
                onClick={() => setCurrentDeliverable(index)}
                aria-label={`Ir para card ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className={`${styles.section} ${styles.benefits}`}>
        <h2 className={styles.sectionTitle}>
          Eu quero que você recupere sua confiança.
        </h2>
        <p className={styles.heroDescription}>
          Quando você respeita seus hormônios, tudo muda:
        </p>
        <div className={styles.benefitsSteps}>
          {benefits.map((benefit, index) => (
            <article key={index} className={styles.benefitStep}>
              <div className={styles.stepNumber}>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className={styles.stepContent}>
                <h4>{benefit.title}</h4>
                <p>{benefit.subtitle}</p>
              </div>
              {index < benefits.length - 1 && <div className={styles.stepConnector} />}
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA Section */}
      <section className={`${styles.section} ${styles.finalCta}`}>
        <Link className={styles.ctaPrimary} href={ctaLink} target="_blank" rel="noopener noreferrer" data-append-utms="true">
          <div className={styles.ctaBadge}>⚡ RESPOSTA EM MINUTOS</div>
          <div className={styles.ctaContent}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
            <span>SIM, QUERO FALAR COM A EQUIPE AGORA</span>
          </div>
          <span className={styles.ctaSubtext}>Atendimento personalizado • Sem compromisso</span>
        </Link>
        
        <div className={styles.urgency}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Atendimento presencial e online. <strong>Vagas limitadas.</strong></span>
        </div>
      </section>
    </main>
  );
}

