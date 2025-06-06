export type PaymentStep = 'select-card' | 'enter-password' | 'processing' | 'complete' | 'error';

export interface CardRecommendationResponse {
  success: boolean;
  status: string;
  message: string;
  response: CardRecommendation[];
}

export interface CardRecommendation {
  cardName: string;
  imageUrl: string;
  cardNumber: string;
  isDefaultCard: boolean;
  discountAmount: number;
}

export interface CardInfo {
  id: number;
  name: string;
  number: string;
  color: string;
  logo: string;
  discount: number;
  benefits: string[];
  isDefaultCard?: boolean;
}
