import { Metadata } from 'next';
import { HomeClient } from './HomeClient';

export const metadata: Metadata = {
  title: 'Dr. Fernando Del Piero | Emagrecimento Feminino 40+',
  description: 'O médico que fez mais de 10 mil mulheres voltarem a emagrecer com saúde depois dos 40. Referência nacional em emagrecimento feminino.',
};

export default function HomePage() {
  return <HomeClient />;
}
