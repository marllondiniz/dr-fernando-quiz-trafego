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

export function QuizForm({ variationKey }: QuizFormProps) {
  const variation = getQuizVariation(variationKey);
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = stepIndex === 0 ? undefined : questions[stepIndex - 1];
  const progress = Math.round(((stepIndex + Number(showResult)) / (questions.length + 1)) * 100);
  const resultType = showResult ? getResultType(answers) : null;

  const persistQuizSummary = useCallback(
    (result: QuizResultType) => {
      if (typeof window === 'undefined') {
        return;
      }

      const summary = buildAnswerSummary(answers);
      const payload = {
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
    [answers, variationKey, variation.utmValue]
  );

  useEffect(() => {
    if (!showResult || !resultType) return;

    persistQuizSummary(resultType);

    if (resultType === 'triad') {
      router.push(`/jejum-hormonal?var=${variation.utmValue}`);
    } else if (resultType === 'lipedema') {
      router.push(`/lipedema?var=${variation.utmValue}`);
    }
  }, [showResult, resultType, router, variation.utmValue, persistQuizSummary]);

  const handleNext = () => {
    if (!currentQuestion) {
      setStepIndex(1);
      return;
    }

    const response = answers[currentQuestion.id];
    if (!response || (Array.isArray(response) && response.length === 0)) {
      return;
    }

    if (stepIndex < questions.length) {
      setStepIndex((prev) => prev + 1);
      return;
    }

    setShowResult(true);
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
  };

  return (
    <div className={styles.quizCard}>
      <div className={styles.progressWrapper}>
        <span className={styles.progressLabel}>Progresso</span>
        <div className={styles.progressBar}>
          <span className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      </div>

      {!showResult ? (
        <div key={currentQuestion?.id ?? 'welcome'} className={styles.stepCard}>
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

          {stepIndex > 0 && currentQuestion && (
            <>
              <header className={styles.questionHeader}>
                <p className={styles.questionCounter}>
                  Pergunta {stepIndex} de {questions.length}
                </p>
                <h2 className={styles.questionTitle}>{currentQuestion.title}</h2>
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
                <button type="button" className={styles.primaryButton} onClick={handleNext}>
                  {stepIndex === questions.length ? 'Ver resultado' : 'Continuar'}
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

