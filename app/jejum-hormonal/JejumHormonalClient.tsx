'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useWhatsappLink } from '../hooks/useWhatsappLink';
import styles from './page.module.css';

export function JejumHormonalClient() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentBenefit, setCurrentBenefit] = useState(0);
  const whatsappLink = useWhatsappLink(
    'Olá! Quero falar com a equipe do Dr. Fernando.',
    'Olá! Acabei de fazer o quiz e recebi o resultado Mulher 40+ / Tríade. Quero saber como funciona o Jejum Hormonal.'
  );

  const testimonials = [
    {
      text: 'Barriga desinchou em 3 semanas. Energia e libido voltaram.',
      author: 'Carla, 47 anos',
      rating: 5,
    },
    {
      text: 'Não era preguiça. Era hormônio.',
      author: 'Renata, 52 anos',
      rating: 5,
    },
    {
      text: 'Voltei a me sentir mulher.',
      author: 'Ana, 55 anos',
      rating: 5,
    },
    {
      text: 'Perdi 12kg sem passar fome. O Dr. Fernando mudou minha vida.',
      author: 'Juliana, 44 anos',
      rating: 5,
    },
    {
      text: 'Minha tireoide finalmente funciona. Energia que eu não tinha há anos.',
      author: 'Patricia, 50 anos',
      rating: 5,
    },
  ];

  const benefits = [
    { icon: '🍽️', title: 'Sem fome constante', subtitle: 'Leptina regulada' },
    { icon: '🔥', title: 'Gordura responde', subtitle: 'Insulina equilibrada' },
    { icon: '😴', title: 'Sono reparador', subtitle: 'Melatonina ativa' },
    { icon: '⚡', title: 'Energia constante', subtitle: 'Tireoide funcionando' },
    { icon: '💕', title: 'Libido de volta', subtitle: 'Testosterona ativa' },
    { icon: '🧠', title: 'Foco e clareza', subtitle: 'Cortisol estável' },
    { icon: '🌸', title: 'Sem TPM', subtitle: 'Progesterona equilibrada' },
    { icon: '✨', title: 'Pele e cabelo', subtitle: 'Estrogênio ajustado' },
  ];

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    const benefitInterval = setInterval(() => {
      setCurrentBenefit((prev) => (prev + 1) % benefits.length);
    }, 3000);

    return () => {
      clearInterval(testimonialInterval);
      clearInterval(benefitInterval);
    };
  }, [testimonials.length, benefits.length]);

  return (
    <main className={styles.page}>
      {/* Hero Section */}
      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <svg className={styles.badgeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Jejum Hormonal®</span>
          </div>
          
          <h1 className={styles.headline}>
            Por que você <span className={styles.highlight}>não emagrece?</span>
            <br />
            A resposta está nos seus <span className={styles.highlightAlt}>hormônios.</span>
          </h1>

          <div className={styles.problemsList}>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cansaço constante</span>
            </div>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Libido em queda</span>
            </div>
            <div className={styles.problemItem}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Corpo que não responde</span>
            </div>
          </div>

          <p className={styles.heroDescription}>
            O problema <span className={styles.highlight}>não é você.</span> São os <span className={styles.highlightAlt}>8 hormônios</span> que controlam o emagrecimento feminino.
          </p>

          <Link className={styles.ctaPrimary} href="#video">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>DESCOBRIR AGORA</span>
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

      {/* VSL Section */}
      <section id="video" className={`${styles.section} ${styles.vsl}`}>
        <h2 className={styles.sectionTitle}>
          Assista <span className={styles.highlight}>antes</span> de tentar mais uma dieta.
        </h2>
        <div className={styles.videoWrapper}>
          <div className={styles.videoPlaceholder}>
            <svg className={styles.playIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            <span>Vídeo exclusivo</span>
          </div>
        </div>
        <p className={styles.supportText}>
          Descubra o método que já ajudou <span className={styles.highlight}>mais de 10 mil mulheres</span> a emagrecer sem restringir carboidrato.
        </p>
        <Link className={styles.ctaPrimary} href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span>QUERO FALAR COM A EQUIPE</span>
        </Link>
      </section>

      {/* Testimonials Carousel */}
      <section className={`${styles.section} ${styles.testimonials}`}>
        <h2 className={styles.sectionTitle}>
          Resultados <span className={styles.highlight}>reais.</span>
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

        {/* Authority Card */}
        <div className={styles.authorityCard}>
          <div className={styles.authorityIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h3 className={styles.authorityTitle}>Dr. Fernando Del Piero</h3>
          <p className={styles.authorityRole}>Especialista em emagrecimento feminino 40+</p>
          <div className={styles.authorityStats}>
            <div className={styles.stat}>
              <span className={styles.statNumber}>10.000+</span>
              <span className={styles.statLabel}>Mulheres atendidas</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>15+</span>
              <span className={styles.statLabel}>Anos de experiência</span>
            </div>
            <div className={styles.stat}>
              <span className={styles.statNumber}>98%</span>
              <span className={styles.statLabel}>Taxa de sucesso</span>
            </div>
          </div>
        </div>

        <Link className={styles.ctaPrimary} href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>ANALISAR MEU CASO</span>
        </Link>
      </section>

      {/* Deliverables */}
      <section className={`${styles.section} ${styles.deliverables}`}>
        <h2 className={styles.sectionTitle}>
          O que você <span className={styles.highlight}>recebe:</span>
        </h2>
        <div className={styles.cardsGrid}>
          <article className={styles.deliverableCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3>Análise Completa</h3>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Consulta com Dr. Fernando</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Scanner 3D + bioimpedância</span>
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
                <span>Plano personalizado</span>
              </li>
            </ul>
          </article>

          <article className={styles.deliverableCard}>
            <div className={styles.cardIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3>Acompanhamento VIP</h3>
            <ul>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Consultas quinzenais</span>
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                <span>Estratégia alimentar personalizada</span>
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
                <span>Canal direto com o time</span>
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

      {/* Benefits Grid */}
      <section className={`${styles.section} ${styles.benefits}`}>
        <h2 className={styles.sectionTitle}>
          Quando seus hormônios mudam, <span className={styles.highlight}>tudo muda.</span>
        </h2>
        
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className={styles.benefitCard}
            >
              <div className={styles.benefitIcon}>{benefit.icon}</div>
              <h4>{benefit.title}</h4>
              <p>{benefit.subtitle}</p>
              <div className={styles.cardShine}></div>
            </div>
          ))}
        </div>

        <Link className={styles.ctaPrimary} href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span>INICIAR AGORA</span>
        </Link>
        
        <div className={styles.urgency}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Vagas limitadas. <strong>Apenas 5 vagas disponíveis esta semana.</strong></span>
        </div>
      </section>
    </main>
  );
}

