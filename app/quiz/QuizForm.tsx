'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './quiz.module.css';
import { getQuizVariation, QuizVariationKey } from './quizConfig';

type QuestionType = 'single' | 'multiple';

interface QuizOption {
  value: string;
  label: string;
  isTriadTrigger?: boolean;
  isLipedemaTrigger?: boolean;
}

interface QuizQuestion {
  id: string;
  title: string;
  description?: string;
  type: QuestionType;
  options: QuizOption[];
  required?: boolean;
}

type QuizAnswers = Record<string, string | string[]>;

type QuizResultType = 'triad' | 'lipedema';

interface QuizFormProps {
  variationKey: QuizVariationKey;
}

const questions: QuizQuestion[] = [
  {
    id: 'q1',
    title: 'Qual é a sua faixa etária?',
    type: 'single',
    required: true,
    options: [
      { value: '<35', label: '< 35' },
      { value: '35-39', label: '35–39' },
      { value: '40-44', label: '40–44', isTriadTrigger: true },
      { value: '45-49', label: '45–49', isTriadTrigger: true },
      { value: '50+', label: '50+', isTriadTrigger: true },
    ],
  },
  {
    id: 'q2',
    title: 'Como está o seu ciclo menstrual hoje?',
    type: 'single',
    required: true,
    options: [
      { value: 'regular', label: 'Normal / regular' },
      { value: 'diu', label: 'Uso DIU' },
      { value: 'anticoncepcional', label: 'Uso anticoncepcional oral' },
      {
        value: 'climaterio',
        label: 'Irregular / sintomas de climatério (calor, irritabilidade, insônia)',
        isTriadTrigger: true,
      },
      { value: 'menopausa', label: 'Menopausa já instalada', isTriadTrigger: true },
    ],
  },
  {
    id: 'q3',
    title: 'Quais sinais você percebe no seu dia a dia?',
    type: 'multiple',
    required: true,
    options: [
      { value: 'inchaco', label: 'Inchaço / retenção' },
      { value: 'intestino-preso', label: 'Intestino preso' },
      { value: 'queda-cabelo', label: 'Queda de cabelo' },
      { value: 'ressecamento', label: 'Ressecamento vaginal / pele seca' },
      { value: 'baixa-libido', label: 'Baixa libido / falta de desejo', isTriadTrigger: true },
      { value: 'gases', label: 'Gases / intestino solto' },
      { value: 'doces', label: 'Vontade de doces à noite' },
      { value: 'cansaco', label: 'Cansaço durante o dia', isTriadTrigger: true },
      {
        value: 'sono-nao-reparador',
        label: 'Sono não reparador (acorda cansada ou desperta à noite)',
        isTriadTrigger: true,
      },
    ],
  },
  {
    id: 'q4',
    title: 'Quando você faz dieta, normalmente o que acontece?',
    type: 'single',
    required: true,
    options: [
      { value: 'efeito-sanfona', label: 'Emagreço e depois engordo tudo de novo (efeito sanfona)' },
      { value: 'sem-energia', label: 'Emagreço, mas fico sem energia / flácida / sem libido' },
      { value: 'nao-emagrece', label: 'Não consigo emagrecer ou perco muito pouco' },
      { value: 'nao-mantenho', label: 'Nunca consigo manter por muito tempo' },
    ],
  },
  {
    id: 'q5',
    title: 'Onde você percebe maior acúmulo de gordura?',
    type: 'single',
    required: true,
    options: [
      { value: 'abdomen', label: 'Abdômen / barriga' },
      { value: 'culote', label: 'Culote / parte interna das coxas' },
      {
        value: 'pernas-doloridas',
        label: 'Pernas pesadas, doloridas ao toque e desproporcionais',
        isLipedemaTrigger: true,
      },
      { value: 'bracos-costas', label: 'Braços / costas' },
      { value: 'corpo-inteiro', label: 'Corpo inteiro' },
    ],
  },
  {
    id: 'q6',
    title: 'Qual resultado você realmente quer alcançar?',
    type: 'single',
    required: true,
    options: [
      { value: 'emagrecer-equilibrio', label: 'Emagrecer com energia e equilíbrio hormonal' },
      { value: 'secar-barriga', label: 'Secar barriga e reduzir inchaço' },
      { value: 'perna-culote', label: 'Eliminar gordura da perna / culote, mesmo com dor ao toque' },
      { value: 'firmar-corpo', label: 'Emagrecer e firmar o corpo (definição / tonificação)' },
    ],
  },
  {
    id: 'q7',
    title: 'Quanto isso está afetando sua vida hoje?',
    type: 'single',
    required: true,
    options: [
      { value: 'urgente', label: 'Não aguento mais. Quero mudança agora.' },
      { value: 'buscando', label: 'Estou buscando soluções, mas ainda tenho dúvidas.' },
      { value: 'incômodo', label: 'É incômodo, mas não urgente.' },
    ],
  },
  {
    id: 'q8',
    title: 'Você prefere acompanhamento:',
    type: 'single',
    required: true,
    options: [
      { value: 'presencial', label: 'Presencial com o Dr. Fernando em Vitória – ES' },
      { value: 'online', label: 'Online com acompanhamento completo' },
    ],
  },
  {
    id: 'q9',
    title: 'Quando você gostaria de iniciar seu acompanhamento?',
    type: 'single',
    required: true,
    options: [
      { value: 'proximas-semanas', label: 'Nas próximas semanas' },
      { value: 'entender-valores', label: 'Quero entender valores antes' },
      { value: 'avaliando', label: 'Ainda estou avaliando' },
    ],
  },
];

function getResultType(answers: QuizAnswers): QuizResultType {
  const q5 = answers['q5'];
  if (q5 === 'pernas-doloridas') {
    return 'lipedema';
  }

  const triadTriggers = [
    answers['q1'],
    answers['q2'],
    ...(Array.isArray(answers['q3']) ? (answers['q3'] as string[]) : []),
  ];

  const hasTriadTrigger = triadTriggers.some((answer) => {
    if (!answer) return false;
    return (
      answer === '40-44' ||
      answer === '45-49' ||
      answer === '50+' ||
      answer === 'climaterio' ||
      answer === 'menopausa' ||
      answer === 'baixa-libido' ||
      answer === 'cansaco' ||
      answer === 'sono-nao-reparador'
    );
  });

  return hasTriadTrigger ? 'triad' : 'triad';
}

const resultTypeLabels: Record<QuizResultType, string> = {
  triad: 'Mulher 40+ / Tríade',
  lipedema: 'Lipedema',
};

function buildAnswerSummary(answers: QuizAnswers): string[] {
  return questions
    .map((question) => {
      const answerValue = answers[question.id];
      if (!answerValue || (Array.isArray(answerValue) && answerValue.length === 0)) {
        return null;
      }

      const values = Array.isArray(answerValue) ? answerValue : [answerValue];
      const labels = values
        .map((value) => question.options.find((option) => option.value === value)?.label)
        .filter((label): label is string => Boolean(label));

      if (!labels.length) {
        return null;
      }

      return `${question.title}: ${labels.join(', ')}`;
    })
    .filter((item): item is string => Boolean(item));
}

interface ContactData {
  name: string;
  email: string;
  phone: string;
}

export function QuizForm({ variationKey }: QuizFormProps) {
  const variation = getQuizVariation(variationKey);
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResult, setShowResult] = useState(false);
  const [contactData, setContactData] = useState<ContactData>({
    name: '',
    email: '',
    phone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isContactStep = stepIndex === questions.length + 1;
  const currentQuestion = stepIndex === 0 ? undefined : stepIndex <= questions.length ? questions[stepIndex - 1] : undefined;
  const totalSteps = questions.length + 2; // questions + contact + result
  const progress = Math.round(((stepIndex + Number(showResult)) / totalSteps) * 100);
  const resultType = showResult ? getResultType(answers) : null;
  const currentResponse = currentQuestion ? answers[currentQuestion.id] : undefined;
  const isNextDisabled =
    stepIndex > 0 &&
    stepIndex <= questions.length &&
    (!currentResponse || (Array.isArray(currentResponse) && currentResponse.length === 0));
  // Validação do formulário de contato
  const isContactFormValid = 
    contactData.name.trim().length > 0 && 
    contactData.email.trim().length > 0 && 
    contactData.email.includes('@') &&
    contactData.phone.trim().length > 0;

  const sendToGoogleSheets = useCallback(
    async (result: QuizResultType) => {
      try {
        setIsSubmitting(true);
        const summary = buildAnswerSummary(answers);
        const payload = {
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          summary,
          resultType: result,
          resultLabel: resultTypeLabels[result],
          variationKey,
          variationUtm: variation.utmValue,
          timestamp: new Date().toISOString(),
        };

        console.log('📤 Enviando dados para Google Sheets...', payload);

        const response = await fetch('/api/quiz-submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const responseData = await response.json();
        console.log('📥 Resposta da API:', responseData);

        if (!response.ok) {
          console.error('❌ Erro ao enviar para Google Sheets:', responseData);
        } else {
          console.log('✅ Dados enviados com sucesso!');
        }
      } catch (error: any) {
        console.error('❌ Erro ao enviar dados:', error);
        console.error('Detalhes:', error.message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [answers, contactData, variationKey, variation.utmValue]
  );

  const persistQuizSummary = useCallback(
    (result: QuizResultType) => {
      if (typeof window === 'undefined') {
        return;
      }

      const summary = buildAnswerSummary(answers);
      const payload = {
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        summary,
        resultType: result,
        resultLabel: resultTypeLabels[result],
        variationKey,
        variationUtm: variation.utmValue,
        timestamp: new Date().toISOString(),
      };

      try {
        sessionStorage.setItem('quizAnswersSummary', JSON.stringify(payload));
      } catch {
        // ignore storage errors
      }
    },
    [answers, contactData, variationKey, variation.utmValue]
  );

  useEffect(() => {
    if (!showResult) return;

    // Calcula o tipo de resultado
    const calculatedResultType = getResultType(answers);
    
    if (!calculatedResultType) {
      console.error('Tipo de resultado não encontrado');
      return;
    }

    // Redireciona após um pequeno delay para mostrar a mensagem
    const redirectTimer = setTimeout(() => {
      const url = calculatedResultType === 'triad' 
        ? `/jejum-hormonal?var=${variation.utmValue}`
        : `/lipedema?var=${variation.utmValue}`;
      
      router.push(url);
    }, 1000);

    return () => clearTimeout(redirectTimer);
  }, [showResult, answers, router, variation.utmValue]);

  const handleNext = async () => {
    // Se está no step de contato, processa o resultado
    if (isContactStep) {
      if (!isContactFormValid) {
        return; // Não prossegue se os dados não são válidos
      }
      
      // Determina o tipo de resultado antes de mostrar
      const result = getResultType(answers);
      
      // Salva no sessionStorage
      persistQuizSummary(result);
      
      // Envia os dados para o Google Sheets e aguarda
      try {
        await sendToGoogleSheets(result);
        console.log('✅ Dados enviados, redirecionando...');
      } catch (error) {
        console.error('⚠️ Erro ao enviar para Google Sheets (continuando mesmo assim):', error);
      }
      
      // Mostra o resultado e inicia o redirecionamento
      setShowResult(true);
      return;
    }

    // Se está na tela inicial (welcome), vai para a primeira pergunta
    if (stepIndex === 0) {
      setStepIndex(1);
      return;
    }

    // Se está em uma pergunta, valida a resposta
    if (currentQuestion) {
      const response = answers[currentQuestion.id];
      if (!response || (Array.isArray(response) && response.length === 0)) {
        return;
      }

      // Se não é a última pergunta, vai para a próxima
      if (stepIndex < questions.length) {
        setStepIndex((prev) => prev + 1);
        return;
      }

      // Se é a última pergunta, vai para o step de contato
      if (stepIndex === questions.length) {
        setStepIndex((prev) => prev + 1);
        return;
      }
    }
  };

  const handleOptionChange = (question: QuizQuestion, option: QuizOption) => {
    setAnswers((prev) => {
      const existing = prev[question.id];
      if (question.type === 'multiple') {
        const valueArray = Array.isArray(existing) ? (existing as string[]) : [];
        const alreadySelected = valueArray.includes(option.value);
        const nextValues = alreadySelected
          ? valueArray.filter((value) => value !== option.value)
          : [...valueArray, option.value];
        return { ...prev, [question.id]: nextValues };
      }
      return { ...prev, [question.id]: option.value };
    });
  };

  const restartQuiz = () => {
    setStepIndex(0);
    setAnswers({});
    setShowResult(false);
    setContactData({ name: '', email: '', phone: '' });
  };

  const handleContactChange = (field: keyof ContactData, value: string) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.quizCard}>
      <div className={styles.progressWrapper}>
        <span className={styles.progressLabel}>Progresso</span>
        <div className={styles.progressBar}>
          <span className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressValue}>{progress}% concluído</span>
      </div>

      {!showResult ? (
        <div key={currentQuestion?.id ?? (isContactStep ? 'contact' : 'welcome')} className={styles.stepCard}>
          {stepIndex === 0 && (
            <header className={styles.welcomeHeader}>
              <p className={styles.welcomeBadge}>Comece agora</p>
              <h2 className={styles.welcomeTitle}>Descubra o que está travando o seu emagrecimento</h2>
              <p className={styles.welcomeDescription}>
                Leva menos de 60 segundos. Responda e receba uma análise personalizada + o próximo passo exato para o
                seu caso.
              </p>
              <button type="button" className={styles.primaryButton} onClick={handleNext}>
                COMEÇAR ANÁLISE
              </button>
            </header>
          )}

          {isContactStep && (
            <>
              <header className={styles.questionHeader}>
                <p className={styles.questionCounter}>Último passo</p>
                <h2 className={styles.questionTitle}>Preencha seus dados para receber o resultado</h2>
                <p className={styles.questionDescription}>
                  Seus dados estão seguros e serão usados apenas para enviar o resultado personalizado.
                </p>
              </header>
              <div className={styles.contactForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Nome completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    className={styles.formInput}
                    value={contactData.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="email" className={styles.formLabel}>
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    className={styles.formInput}
                    value={contactData.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="seu@email.com"
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="phone" className={styles.formLabel}>
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className={styles.formInput}
                    value={contactData.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setStepIndex((prev) => prev - 1)}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleNext}
                  disabled={!isContactFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Ver resultado'}
                </button>
              </div>
            </>
          )}

          {stepIndex > 0 && stepIndex <= questions.length && currentQuestion && (
            <>
              <header className={styles.questionHeader}>
                <p className={styles.questionCounter}>
                  Pergunta {stepIndex} de {questions.length}
                </p>
                <h2 className={styles.questionTitle}>{currentQuestion.title}</h2>
                {currentQuestion.type === 'multiple' && (
                  <p className={styles.questionHelper}>Você pode selecionar mais de uma opção.</p>
                )}
                {currentQuestion.description && <p className={styles.questionDescription}>{currentQuestion.description}</p>}
              </header>
              <div className={styles.optionsList}>
                {currentQuestion.options.map((option) => {
                  const selectedValues = answers[currentQuestion.id];
                  const isSelected = Array.isArray(selectedValues)
                    ? selectedValues.includes(option.value)
                    : selectedValues === option.value;
                  return (
                    <button
                      type="button"
                      key={option.value}
                      className={`${styles.optionButton} ${isSelected ? styles.optionButtonActive : ''}`}
                      onClick={() => handleOptionChange(currentQuestion, option)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.secondaryButton}
                  onClick={() => setStepIndex((prev) => Math.max(prev - 1, 0))}
                  disabled={stepIndex <= 1}
                >
                  Voltar
                </button>
                <button
                  type="button"
                  className={styles.primaryButton}
                  onClick={handleNext}
                  disabled={isNextDisabled}
                >
                  Continuar
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className={styles.resultCard}>
          <h2 className={styles.resultTitle}>Redirecionando…</h2>
          <p className={styles.resultDescription}>Aguarde enquanto carregamos a página personalizada para o seu caso.</p>
          <button type="button" className={styles.secondaryButton} onClick={restartQuiz}>
            Refazer análise
          </button>
        </div>
      )}
    </div>
  );
}

