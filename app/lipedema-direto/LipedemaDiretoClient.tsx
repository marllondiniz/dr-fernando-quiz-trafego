'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { usePageView } from '../hooks/usePageView';
import { links } from '../../config/links';
import { VTurbPlayerLipedema } from './VTurbPlayerLipedema';
import { VTurbPlayerResults } from './VTurbPlayerResults';
import styles from './page.module.css';

export function LipedemaDiretoClient() {
  usePageView();
  const [currentDeliverable, setCurrentDeliverable] = useState(0);
  const [currentGalleryImage, setCurrentGalleryImage] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const galleryCarouselRef = useRef<HTMLDivElement>(null);
  const ctaLink = links.lipedemaDireto;

  const causes = [
    { title: 'Estrogênio em excesso', description: 'Desequilíbrio hormonal' },
    { title: 'Resistência à insulina', description: 'Metabolismo lento' },
    { title: 'Inflamação crônica', description: 'Corpo inflamado' },
    { title: 'Intestino desregulado', description: 'Disbiose intestinal' },
    { title: 'Cortisol alto', description: 'Estresse constante' },
    { title: 'Genética ativada', description: 'Predisposição genética' },
  ];

  const deliverables = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: 'Consulta individual com Dr. Fernando',
      items: [
        'Análise corporal (3D ou online com IA)',
        'Investigação hormonal completa',
        'Mapeamento alimentar/emocional',
        'Plano inicial aplicável',
      ],
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      title: 'Acompanhamento estratégico',
      items: [
        'Consultas quinzenais com o Dr. Fernando',
        'Dieta FMD adaptada para Lipedema',
        'Suporte semanal com nutricionista',
        'Canal VIP com o time',
        'Terapias injetáveis (se indicado)',
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
    const carousel = galleryCarouselRef.current;
    if (!carousel) return;

    const handleScroll = () => {
      const scrollLeft = carousel.scrollLeft;
      const cardWidth = carousel.clientWidth;
      const currentIndex = Math.round(scrollLeft / cardWidth);
      setCurrentGalleryImage(currentIndex);
    };

    carousel.addEventListener('scroll', handleScroll);
    return () => carousel.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const carousel = galleryCarouselRef.current;
    if (!carousel) return;

    const cardWidth = carousel.clientWidth;
    carousel.scrollTo({
      left: currentGalleryImage * cardWidth,
      behavior: 'smooth',
    });
  }, [currentGalleryImage]);

  return (
    <main className={styles.page}>
      {/* VSL Section */}
      <section id="video" className={`${styles.section} ${styles.vsl}`}>
        <div className={styles.videoWrapper}>
          <VTurbPlayerLipedema />
        </div>
        <p className={styles.supportText}>
          Mulheres com lipedema <span className={styles.highlight}>não falham</span> nas dietas. As dietas é que <span className={styles.highlight}>falham com elas.</span>
        </p>
        <Link className={styles.ctaPrimary} href={ctaLink} target="_blank" rel="noopener noreferrer" data-append-utms="true">
          <div className={styles.ctaBadge}>⚡ RESPOSTA EM MINUTOS</div>
          <div className={styles.ctaContent}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
            <span>QUERO COMEÇAR AGORA</span>
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

      {/* Results Gallery */}
      <section className={`${styles.section} ${styles.resultsGallery}`}>
        <h2 className={styles.sectionTitle}>
          Resultados <span className={styles.highlight}>comprovados.</span>
          <br />
          O método <span className={styles.highlightAlt}>funciona.</span>
        </h2>
        <p className={styles.description}>
          Veja a transformação real de mulheres que receberam <strong>tratamento especializado</strong> para Lipedema.
        </p>
        
        {/* Gallery Grid Desktop */}
        <div className={styles.galleryGrid}>
          <div className={styles.galleryItem}>
            <Image
              src="/lipedema1.png"
              alt="Resultado do tratamento de Lipedema - Caso 1"
              width={600}
              height={800}
              className={styles.galleryImage}
              priority
              unoptimized
            />
          </div>
          <div className={styles.galleryItem}>
            <Image
              src="/lipedema2.png"
              alt="Resultado do tratamento de Lipedema - Caso 2"
              width={600}
              height={800}
              className={styles.galleryImage}
              unoptimized
            />
          </div>
          <div className={styles.galleryItem}>
            <Image
              src="/lipedema3.png"
              alt="Resultado do tratamento de Lipedema - Caso 3"
              width={600}
              height={800}
              className={styles.galleryImage}
              unoptimized
            />
          </div>
        </div>

        {/* Gallery Carousel Mobile */}
        <div className={styles.galleryCarouselWrapper}>
          <div
            ref={galleryCarouselRef}
            className={styles.galleryCarousel}
          >
            <div className={styles.galleryItemCarousel}>
              <Image
                src="/lipedema1.png"
                alt="Resultado do tratamento de Lipedema - Caso 1"
                width={600}
                height={800}
                className={styles.galleryImage}
                priority
                unoptimized
              />
            </div>
            <div className={styles.galleryItemCarousel}>
              <Image
                src="/lipedema2.png"
                alt="Resultado do tratamento de Lipedema - Caso 2"
                width={600}
                height={800}
                className={styles.galleryImage}
                unoptimized
              />
            </div>
            <div className={styles.galleryItemCarousel}>
              <Image
                src="/lipedema3.png"
                alt="Resultado do tratamento de Lipedema - Caso 3"
                width={600}
                height={800}
                className={styles.galleryImage}
                unoptimized
              />
            </div>
          </div>
          
          <div className={styles.carouselDots}>
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentGalleryImage ? styles.activeDot : ''}`}
                onClick={() => setCurrentGalleryImage(index)}
                aria-label={`Ir para imagem ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Video Section */}
        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
          <VTurbPlayerResults />
        </div>
      </section>

      {/* Hero Section */}
      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <span>Lipedema tem tratamento</span>
          </div>

          <h1 className={styles.headline}>
            Gordura no culote, pernas grossas, <span className={styles.highlight}>dor ao toque?</span>
            <br />
            Pode ser <span className={styles.highlightAlt}>LIPEDEMA.</span>
          </h1>

          <div className={styles.problemsList}>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Você <strong>não está</strong> &quot;acima do peso&quot;</span>
            </div>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>É um <strong>distúrbio hormonal e inflamatório</strong></span>
            </div>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span><strong>Nenhuma dieta comum</strong> resolve isso</span>
            </div>
          </div>

          <Link className={styles.ctaPrimary} href="#video" scroll>
            <div className={styles.ctaContent}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>QUERO DESCOBRIR SE TENHO LIPEDEMA</span>
            </div>
            <span className={styles.ctaSubtext}>Assista o vídeo e descubra em 5 minutos</span>
          </Link>

          <div className={styles.trustBadges}>
            <div className={styles.trustBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Protocolo especializado</span>
            </div>
            <div className={styles.trustBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Tratamento hormonal</span>
            </div>
            <div className={styles.trustBadge}>
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>Resultados comprovados</span>
            </div>
          </div>
        </div>
      </section>

      {/* Causes Section with Carousel */}
      <section className={`${styles.section} ${styles.causes}`}>
        <h2 className={styles.sectionTitle}>
          Lipedema tem <span className={styles.highlight}>causa interna.</span>
          <br />
          Nunca é falta de esforço.
        </h2>
        <p className={styles.description}>
          É um <strong>distúrbio inflamatório</strong>, agravado por <strong>desequilíbrios hormonais</strong>. Por isso, a gordura nas pernas não cede.
        </p>

        <div className={styles.causesSteps}>
          {causes.map((cause, index) => (
            <article key={index} className={styles.causeStep}>
              <div className={styles.stepNumber}>
                <span>{String(index + 1).padStart(2, '0')}</span>
              </div>
              <div className={styles.stepContent}>
                <h4>{cause.title}</h4>
                <p>{cause.description}</p>
              </div>
              {index < causes.length - 1 && <div className={styles.stepConnector} />}
            </article>
          ))}
        </div>

        <p className={styles.ctaText}>
          Quando você <span className={styles.highlight}>trata a causa</span>, o volume <span className={styles.highlight}>responde.</span>
        </p>

        <Link className={styles.ctaSecondary} href={ctaLink} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>QUERO ENTENDER MEU CASO</span>
        </Link>
      </section>

      {/* Deliverables */}
      <section className={`${styles.section} ${styles.deliverables}`}>
        <h2 className={styles.sectionTitle}>
          O que você recebe no <span className={styles.highlightAlt}>Protocolo de Tratamento</span>
          <br />
          para Lipedema
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

      {/* Closing CTA */}
      <section className={`${styles.section} ${styles.closing}`}>
        <h2 className={styles.sectionTitle}>
          Você <span className={styles.highlight}>não precisa sofrer calada.</span>
          <br />
          Lipedema tem <span className={styles.highlightAlt}>tratamento.</span>
        </h2>
        <p className={styles.description}>
          Força de vontade não vence desequilíbrio hormonal. Mas existe <strong>diagnóstico</strong>. <strong>Estratégia</strong>. <strong>Resultado</strong>.
        </p>
        
        <Link className={styles.ctaPrimary} href={ctaLink} target="_blank" rel="noopener noreferrer" data-append-utms="true">
          <div className={styles.ctaBadge}>⚡ RESPOSTA EM MINUTOS</div>
          <div className={styles.ctaContent}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
            <span>QUERO COMEÇAR AGORA</span>
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

