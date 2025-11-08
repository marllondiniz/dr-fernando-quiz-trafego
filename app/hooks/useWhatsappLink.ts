'use client';

import { useEffect, useState } from 'react';

const WHATSAPP_PHONE_NUMBER = '5527996894540';
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;

interface QuizSummaryPayload {
  summary?: string[];
  resultType?: string;
  resultLabel?: string;
  variationKey?: string;
  variationUtm?: string;
  timestamp?: string;
}

function sanitizeMessage(message: string): string {
  return message
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join('\n');
}

function buildMessage(defaultMessage: string, contextMessage: string | undefined, payload?: QuizSummaryPayload) {
  const base = sanitizeMessage(contextMessage ?? defaultMessage);

  if (!payload) {
    return base;
  }

  const lines: string[] = [base];

  if (payload.resultLabel) {
    lines.push(`Resultado do quiz: ${payload.resultLabel}`);
  }

  if (payload.summary && payload.summary.length > 0) {
    lines.push('Minhas respostas:');
    payload.summary.forEach((item) => lines.push(`- ${item}`));
  }

  return lines.join('\n');
}

export function useWhatsappLink(defaultMessage: string, contextMessage?: string) {
  const [link, setLink] = useState(() => `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(defaultMessage)}`);

  useEffect(() => {
    let payload: QuizSummaryPayload | undefined;

    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('quizAnswersSummary');
        if (stored) {
          payload = JSON.parse(stored) as QuizSummaryPayload;
        }
      } catch {
        payload = undefined;
      }
    }

    const finalMessage = buildMessage(defaultMessage, contextMessage, payload);
    setLink(`${WHATSAPP_BASE_URL}?text=${encodeURIComponent(finalMessage)}`);
  }, [defaultMessage, contextMessage]);

  return link;
}

