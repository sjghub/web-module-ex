export type PaymentStep = 'select-card' | 'enter-password' | 'processing' | 'complete' | 'error';

export interface CardInfo {
  id: number;
  name: string;
  number: string;
  color: string;
  logo: string;
  discount: number;
  benefits: string[];
}

export const CARDS: CardInfo[] = [
  {
    id: 1,
    name: '카드의정석 EVERY DISCOUNT',
    number: '(1234)',
    color: 'bg-gradient-to-r from-green-600 to-green-700',
    logo: '/everydiscount.png',
    discount: 10,
    benefits: ['온라인 쇼핑몰 10% 할인', '5만원 이상 결제 시 2천원 할인', '해외 직구 무료 배송'],
  },
  {
    id: 2,
    name: '현대카드 MX Black Edition2',
    number: '(1234)',
    color: 'bg-gradient-to-r from-orange-300 to-orange-400',
    logo: '/hyundaiblack.png',
    discount: 5,
    benefits: ['프리미엄 서비스 무료 이용', '공항 라운지 무료 이용', '해외 결제 수수료 면제'],
  },
  {
    id: 3,
    name: '삼성카드 taptap O',
    number: '(1234)',
    color: 'bg-gradient-to-r from-pink-400 to-pink-500',
    logo: '/taptap0.png',
    discount: 3,
    benefits: ['온라인몰 7% 할인', '생활비 자동이체 할인', '영화 티켓 1+1 혜택'],
  },
  {
    id: 4,
    name: '카드의정석 오하CHECK',
    number: '(1234)',
    color: 'bg-gradient-to-r from-gray-800 to-gray-900',
    logo: '/ohacheck.png',
    discount: 0,
    benefits: ['현금 할인', '무이자 할부 최대 12개월', '생일 월 추가 5% 할인'],
  },
];
