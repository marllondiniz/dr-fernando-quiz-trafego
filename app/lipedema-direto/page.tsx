import { Metadata } from 'next';
import { LipedemaDiretoClient } from './LipedemaDiretoClient';

export const metadata: Metadata = {
  title: 'Lipedema | Dr. Fernando Del Piero',
  description: 'Gordura no culote, pernas grossas, dor ao toque? Pode não ser gordura comum. Pode ser LIPEDEMA.',
};

export default function LipedemaDiretoPage() {
  return <LipedemaDiretoClient />;
}

