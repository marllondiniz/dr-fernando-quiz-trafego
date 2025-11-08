'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWhatsappLink } from '../hooks/useWhatsappLink';
import styles from './page.module.css';

export function LipedemaClient() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const whatsappLink = useWhatsappLink(
    'Olá! Quero falar com a equipe do Dr. Fernando.',
    'Olá! Acabei de fazer o quiz e recebi indícios de Lipedema. Preciso de orientação personalizada.'
  );

  const testimonials = [
    {
      text: 'Minhas pernas desincharam. Perdi 7kg. O melhor? A dor sumiu.',
      author: 'Márcia, 45 anos',
      rating: 5,
    },
    {
      text: 'Achei que era preguiça. Era lipedema.',
      author: 'Fernanda, 38 anos',
      rating: 5,
    },
    {
      text: 'Recuperei minha autoestima. Não foi só o volume.',
      author: 'Cláudia, 42 anos',
      rating: 5,
    },
    {
      text: 'Finalmente entendi por que nenhuma dieta funcionava.',
      author: 'Roberta, 51 anos',
      rating: 5,
    },
  ];

  const causes = [
    { icon: '🔬', title: 'Estrogênio em excesso', description: 'Desequilíbrio hormonal' },
    { icon: '🍬', title: 'Resistência à insulina', description: 'Metabolismo lento' },
    { icon: '🔥', title: 'Inflamação crônica', description: 'Corpo inflamado' },
    { icon: '🦠', title: 'Intestino desregulado', description: 'Disbiose intestinal' },
    { icon: '😰', title: 'Cortisol alto', description: 'Estresse constante' },
    { icon: '🧬', title: 'Genética ativada', description: 'Predisposição genética' },
  ];

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => {
      clearInterval(testimonialInterval);
    };
  }, [testimonials.length]);

  return (
    <main className={styles.page}>
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
            Pode não ser gordura comum.
            <br />
            <span className={styles.highlightAlt}>Pode ser LIPEDEMA.</span>
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>QUERO DESCOBRIR SE TENHO LIPEDEMA</span>
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

      {/* VSL Section */}
      <section id="video" className={`${styles.section} ${styles.vsl}`}>
        <h2 className={styles.sectionTitle}>
          Antes de tentar <span className={styles.highlight}>lipo, drenagem ou remédio…</span>
          <br />
          Assista isso agora.
        </h2>
        <div className={styles.videoWrapper}>
          <div className={styles.videoPlaceholder}>
            <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Vídeo sobre Lipedema</span>
          </div>
        </div>
        <p className={styles.supportText}>
          Mulheres com lipedema <span className={styles.highlight}>não falham</span> nas dietas. As dietas é que <span className={styles.highlight}>falham com elas.</span>
        </p>
        <Link className={styles.ctaPrimary} href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>QUERO FALAR COM A EQUIPE</span>
        </Link>
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

        <div className={styles.causesGrid}>
          {causes.map((cause, index) => (
            <div key={index} className={styles.causeCard}>
              <div className={styles.causeIcon}>{cause.icon}</div>
              <h4>{cause.title}</h4>
              <p>{cause.description}</p>
              <div className={styles.cardShine}></div>
            </div>
          ))}
        </div>

        <p className={styles.ctaText}>
          Quando você <span className={styles.highlight}>trata a causa</span>, o volume <span className={styles.highlight}>responde.</span>
        </p>

        <Link className={styles.ctaSecondary} href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>QUERO ENTENDER MEU CASO</span>
        </Link>
      </section>

      {/* Deliverables */}
      <section className={`${styles.section} ${styles.deliverables}`}>
        <h2 className={styles.sectionTitle}>
          O que você recebe no <span className={styles.highlightAlt}>Protocolo Jejum Hormonal®</span>
          <br />
          Edição Lipedema
        </h2>
        
        <div className={styles.cardsGrid}>
          <article className={styles.deliverableCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3>Consulta individual com Dr. Fernando</h3>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Análise corporal (3D ou online com IA)</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Investigação hormonal completa</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Mapeamento alimentar/emocional</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Plano inicial aplicável</span>
              </li>
            </ul>
          </article>

          <article className={styles.deliverableCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3>Acompanhamento estratégico</h3>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Consultas quinzenais com o Dr. Fernando</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Dieta FMD adaptada para Lipedema</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Suporte semanal com nutricionista</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Canal VIP com o time</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Terapias injetáveis (se indicado)</span>
              </li>
            </ul>
          </article>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className={`${styles.section} ${styles.testimonials}`}>
        <h2 className={styles.sectionTitle}>
          Resultados <span className={styles.highlight}>reais.</span> Mulheres <span className={styles.highlight}>reais.</span>
        </h2>
        
        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${styles.testimonialCard} ${
                  index === currentTestimonial ? styles.active : ''
                }`}
              >
                <div className={styles.stars}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p className={styles.testimonialText}>{testimonial.text}</p>
                <cite className={styles.testimonialAuthor}>— {testimonial.author}</cite>
              </div>
            ))}
          </div>
          
          <div className={styles.carouselDots}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentTestimonial ? styles.activeDot : ''}`}
                onClick={() => setCurrentTestimonial(index)}
                aria-label={`Ir para depoimento ${index + 1}`}
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
        
        <Link className={styles.ctaPrimary} href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>QUERO INICIAR MEU PROTOCOLO AGORA</span>
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
