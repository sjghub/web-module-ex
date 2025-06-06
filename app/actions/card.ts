'use server';

import { CardRecommendationResponse } from '@/constants/payment';

export async function getCardRecommendations(
  userId: number,
  merchantId: number,
  amount: number,
  username: string
) {
  try {
    const response = await fetch('http://localhost:8082/module/api/card/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Name': username,
      },
      body: JSON.stringify({
        userId,
        merchantId,
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error('카드 추천 정보를 가져오는데 실패했습니다.');
    }

    const data: CardRecommendationResponse = await response.json();
    return data;
  } catch (error) {
    console.error('카드 추천 API 호출 실패:', error);
    throw error;
  }
}
