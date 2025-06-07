import { CardRecommendationResponse, MyCardResponse } from '@/constants/payment';

export async function getCardRecommendations(
  userId: number,
  merchantId: number,
  amount: number,
  username: string
) {
  try {
    const response = await fetch('/api/module/card/recommend', {
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

export async function getMyCards(username: string): Promise<MyCardResponse> {
  try {
    const response = await fetch('https://internal-alb.example.com/service/api/card/my', {
      headers: {
        'X-User-Name': username,
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('내 카드 목록을 불러오는데 실패했습니다.');
    }

    return response.json();
  } catch (error) {
    console.error('내 카드 목록을 가져오는데 실패했습니다:', error);
    throw error;
  }
}
