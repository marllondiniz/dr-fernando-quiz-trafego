'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './page.module.css';

const whatsappLink = 'https://wa.me/5527999999999'; // TODO: substituir pelo link oficial

export function HomeClient() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: 'O Dr. Fernando mudou minha vida. Descobri que não era falta de força de vontade.',
      author: 'Maria, 48 anos',
      rating: 5,
    },
    {
      text: 'Finalmente entendi meu corpo. Emagreci 15kg com saúde e energia.',
      author: 'Júlia, 52 anos',
      rating: 5,
    },
    {
      text: 'Não é só o peso. É voltar a se sentir viva. Obrigada, Dr. Fernando!',
      author: 'Carla, 45 anos',
      rating: 5,
    },
    {
      text: 'A melhor decisão que tomei foi agendar aquela primeira consulta.',
      author: 'Renata, 50 anos',
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <main className={styles.homePage}>
      {/* Hero Principal */}
      <section className={styles.heroMain}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            O médico que fez mais de <span className={styles.highlight}>10 mil mulheres</span> voltarem a emagrecer com saúde depois dos 40.
          </h1>
          <p className={styles.heroSubtitle}>
            <strong>Dr. Fernando Del Piero</strong> — referência nacional em emagrecimento feminino. 
            Unindo ciência e acompanhamento personalizado em protocolos desenhados para o metabolismo da mulher.
          </p>
          <div className={styles.heroActions}>
            <Link href="#consulta" className={styles.ctaPrimary}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Agendar Análise Metabólica</span>
            </Link>
            <Link href="/a" className={styles.ctaSecondary}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>Fazer autoavaliação</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção Consulta de Análise Metabólica */}
      <section id="consulta" className={styles.sectionConsulta}>
        <div className={styles.sectionBadge}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span>CONSULTA DE ANÁLISE METABÓLICA</span>
        </div>
        
        <h2 className={styles.sectionTitle}>
          A consulta que revela o que está <span className={styles.highlight}>impedindo o seu corpo de emagrecer.</span>
        </h2>
        
        <p className={styles.sectionDescription}>
          Um atendimento médico individual com o Dr. Fernando Del Piero — referência nacional em emagrecimento feminino e autor do <strong>Jejum Hormonal®</strong>. 
          Nesta consulta, o objetivo é decifrar o metabolismo da mulher, identificar as travas hormonais e metabólicas e construir o plano certo antes de qualquer intervenção.
        </p>
        
        <p className={styles.sectionMicro}>
          É o ponto de partida para um tratamento realmente eficaz — baseado em ciência, tecnologia e acompanhamento médico personalizado.
        </p>

        <div className={styles.consultaActions}>
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Agendar minha Análise Metabólica</span>
          </Link>
          <Link href="/a" className={styles.ctaSecondary}>
            Fazer minha autoavaliação antes da consulta
          </Link>
        </div>
      </section>

      {/* Por que não emagrece */}
      <section className={styles.sectionWhy}>
        <h2 className={styles.sectionTitle}>
          Por que a maioria das mulheres não consegue mais emagrecer depois dos 40 — e o que <span className={styles.highlight}>fazemos diferente.</span>
        </h2>
        
        <div className={styles.whyContent}>
          <p>
            Depois dos 40, o metabolismo feminino passa por uma transição silenciosa. As oscilações hormonais, a queda da massa magra, 
            a resistência à insulina e os padrões de estresse fazem o corpo parar de responder como antes.
          </p>
          <p>
            O erro mais comum é tentar &quot;consertar&quot; isso com dietas genéricas, remédios isolados ou protocolos prontos — 
            <strong> sem entender o que realmente está acontecendo por dentro.</strong>
          </p>
          <p className={styles.whyHighlight}>
            A Consulta de Análise Metabólica foi criada exatamente para isso: investigar, medir e compreender o corpo da mulher com precisão científica, antes de qualquer tratamento.
          </p>
        </div>
      </section>

      {/* O que está incluso - Cards com Hover */}
      <section className={styles.sectionIncluso}>
        <h2 className={styles.sectionTitle}>
          Uma consulta médica de <span className={styles.highlight}>alta performance</span> — feita para decifrar o metabolismo feminino.
        </h2>
        
        <p className={styles.sectionSubtitle}>
          Em cerca de 1 hora, o Dr. Fernando realiza uma análise clínica completa, combinando tecnologia, ciência e escuta humana. 
          O objetivo é traçar o mapa metabólico da paciente e entender por que o corpo parou de responder.
        </p>

        <div className={styles.inclusosGrid}>
          <div className={styles.inclusoCard}>
            <div className={styles.inclusoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3>Atendimento médico individual com o Dr. Fernando Del Piero</h3>
            <p>Consulta presencial exclusiva, com duração média de 1 hora. Avaliação detalhada do metabolismo, histórico hormonal e comportamento biológico.</p>
            <div className={styles.cardShine}></div>
          </div>

          <div className={styles.inclusoCard}>
            <div className={styles.inclusoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3>Análise detalhada do metabolismo feminino</h3>
            <p>Estudo dos principais eixos hormonais, metabólicos e inflamatórios que influenciam energia, peso e equilíbrio corporal.</p>
            <div className={styles.cardShine}></div>
          </div>

          <div className={styles.inclusoCard}>
            <div className={styles.inclusoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <h3>Avaliação corporal com tecnologia 3D</h3>
            <p>Scanner VISBODY 360° — cria um avatar tridimensional para acompanhamento visual preciso. Bioimpedância avançada — identifica massa magra, gordura, água corporal e metabolismo basal.</p>
            <div className={styles.cardShine}></div>
          </div>

          <div className={styles.inclusoCard}>
            <div className={styles.inclusoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3>Mapeamento alimentar e emocional</h3>
            <p>Análise clínica dos padrões de fome, saciedade, horários biológicos e gatilhos emocionais ligados à alimentação. Abordagem sem julgamentos, com foco em consciência e sustentabilidade.</p>
            <div className={styles.cardShine}></div>
          </div>

          <div className={styles.inclusoCard}>
            <div className={styles.inclusoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3>Solicitação e interpretação de exames</h3>
            <p>Exames bioquímicos, hormonais e de imagem, conforme necessidade clínica. Todos interpretados pessoalmente pelo Dr. Fernando, dentro do contexto de cada paciente.</p>
            <div className={styles.cardShine}></div>
          </div>

          <div className={styles.inclusoCard}>
            <div className={styles.inclusoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3>Condutas iniciais e plano de ação</h3>
            <p>Prescrição médica e suplementar individualizada, orientações de estilo de vida e direcionamento para o protocolo ideal. Tudo baseado nos 6 pilares da Medicina do Estilo de Vida.</p>
            <div className={styles.cardShine}></div>
          </div>
        </div>

        <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
          Agendar minha consulta presencial
        </Link>
      </section>

      {/* Consulta Online */}
      <section className={styles.sectionOnline}>
        <h2 className={styles.sectionTitle}>
          A mesma análise completa — agora <span className={styles.highlight}>100% online.</span>
        </h2>
        
        <p className={styles.sectionDescription}>
          Para mulheres de outras cidades ou que preferem atendimento remoto, a Consulta de Análise Metabólica Digital 
          oferece a mesma profundidade diagnóstica, com tecnologia de Inteligência Artificial para análise corporal.
        </p>

        <div className={styles.onlineCards}>
          <div className={styles.onlineCard}>
            <div className={styles.onlineIcon}>📸</div>
            <p>Envio de fotos e medidas por protocolo visual padronizado</p>
          </div>
          <div className={styles.onlineCard}>
            <div className={styles.onlineIcon}>🤖</div>
            <p>Sistema de IA gera relatório corporal preciso e comparativo</p>
          </div>
          <div className={styles.onlineCard}>
            <div className={styles.onlineIcon}>👨‍⚕️</div>
            <p>Interpretação clínica e prescrição diretamente com o Dr. Fernando</p>
          </div>
          <div className={styles.onlineCard}>
            <div className={styles.onlineIcon}>⭐</div>
            <p>Mesmo padrão de personalização e acompanhamento da versão presencial</p>
          </div>
        </div>

        <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.ctaSecondary}>
          Agendar minha consulta online
        </Link>
      </section>

      {/* Depoimentos Carrossel */}
      <section className={styles.sectionTestimonials}>
        <h2 className={styles.sectionTitle}>
          Mais de <span className={styles.highlight}>10 mil mulheres</span> já descobriram o que estava impedindo o corpo delas de emagrecer.
        </h2>
        
        <p className={styles.sectionSubtitle}>
          Cada diagnóstico abre uma nova história. Veja o que dizem algumas pacientes que começaram a transformação pela Consulta de Análise Metabólica.
        </p>

        <div className={styles.carouselWrapper}>
          <div className={styles.carousel}>
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`${styles.testimonialCard} ${
                  index === currentTestimonial ? styles.activeTestimonial : ''
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

      {/* CTA Final */}
      <section className={styles.sectionFinal}>
        <h2 className={styles.finalTitle}>
          O primeiro passo para o seu novo corpo <span className={styles.highlight}>começa aqui.</span>
        </h2>
        
        <p className={styles.finalDescription}>
          Entender o seu metabolismo é a base de todo resultado real e duradouro. 
          Dê o primeiro passo e agende sua Análise Metabólica com o Dr. Fernando Del Piero.
        </p>

        <div className={styles.finalActions}>
          <Link href={whatsappLink} target="_blank" rel="noopener noreferrer" className={styles.ctaPrimary}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            <span>Agendar minha consulta agora</span>
          </Link>
          <Link href="/a" className={styles.ctaSecondary}>
            Fazer minha autoavaliação gratuita
          </Link>
        </div>

        <p className={styles.finalNote}>
          Consulta presencial em Vitória – ES e atendimento digital para todo o Brasil.
        </p>
      </section>
    </main>
  );
}

