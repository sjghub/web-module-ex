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
  logo?: string;
  imageUrl?: string;
  discount: number;
  benefits: string[];
  isDefaultCard?: boolean;
  isMyCard?: boolean;
}

export interface MyCard {
  id: number;
  cardName: string;
  cardNumber: string;
  imageUrl: string;
  isDefaultCard: boolean;
}

export interface MyCardResponse {
  success: boolean;
  status: string;
  message: string;
  response: MyCard[];
}

export interface PaymentRequest {
  userId: number;
  cardId: number;
  amount: number;
  merchantId: number;
  productName: string;
  paymentPinCode: string;
}
