import Image from 'next/image';
import { ThumbsUp } from 'lucide-react';
import { CardInfo, CardRecommendation, CardRecommendationResponse } from '@/constants/payment';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';

interface CardSelectionSectionProps {
  userId: number;
  merchantId: number;
  amount: number;
  onCardSelect: (card: CardInfo) => void;
  onProceedToPayment: () => void;
}

export function CardSelectionSection({
  userId,
  merchantId,
  amount,
  onCardSelect,
  onProceedToPayment,
}: CardSelectionSectionProps) {
  const [cards, setCards] = useState<CardInfo[]>([]);
  const [bestDiscountCard, setBestDiscountCard] = useState<CardInfo | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchCardRecommendations = async () => {
      if (!isAuthenticated) {
        console.log('User is not authenticated');
        return;
      }

      try {
        const token = localStorage.getItem('accessToken');
        console.log('Current Token:', token);

        let username = 'user'; // 기본값
        // 토큰 디코딩
        if (token) {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            console.log('Token Payload:', payload);
            console.log('Token Expiration:', new Date(payload.exp * 1000).toLocaleString());
            username = payload.sub; // 토큰에서 사용자 이름 가져오기
          }
        }

        console.log('Request Body:', {
          userId,
          merchantId,
          amount,
        });

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

        const data: CardRecommendationResponse = await response.json();
        console.log('Response Body:', data);

        if (data.success) {
          const mappedCards: CardInfo[] = data.response.map((card, index) => ({
            id: index + 1,
            name: card.cardName,
            number: `(${card.cardNumber})`,
            color: 'bg-gradient-to-r from-gray-800 to-gray-900', // 기본 색상
            logo: card.imageUrl,
            discount: card.discountAmount, // 퍼센트 대신 금액 사용
            benefits: [], // API에서 제공하지 않는 정보
            isDefaultCard: card.isDefaultCard,
          }));

          setCards(mappedCards);

          // 할인 금액이 가장 높은 카드를 최고 혜택 카드로 설정
          const bestCard = mappedCards.reduce((prev, current) =>
            prev.discount > current.discount ? prev : current
          );
          setBestDiscountCard(bestCard);
          setSelectedCard(bestCard); // 최고 혜택 카드를 초기 선택 상태로 설정
          onCardSelect(bestCard); // 부모 컴포넌트에도 선택 상태 전달
        }
      } catch (error) {
        console.error('카드 추천 정보를 가져오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardRecommendations();
  }, [userId, merchantId, amount, isAuthenticated, onCardSelect]);

  if (isLoading) {
    return <div className="flex-1 p-6">카드 정보를 불러오는 중...</div>;
  }

  if (!bestDiscountCard || cards.length === 0) {
    return <div className="flex-1 p-6">사용 가능한 카드가 없습니다.</div>;
  }

  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">결제 카드 선택</h2>

      {/* 최고 혜택 카드 */}
      <div
        className={`${
          selectedCard?.id === bestDiscountCard.id
            ? 'bg-blue-100 border-2 border-blue-500'
            : 'bg-white border border-gray-200 hover:border-gray-300'
        } rounded-lg overflow-hidden mb-4 flex flex-col cursor-pointer`}
        onClick={() => {
          setSelectedCard(bestDiscountCard);
          onCardSelect(bestDiscountCard);
        }}
      >
        {/* 타이틀 */}
        <div className="flex items-center px-3 pt-3">
          <ThumbsUp className="text-green-500 mr-2 size-5" />
          <span className="text-green-500 text-base font-semibold">최고 혜택 추천 카드</span>
          {bestDiscountCard.isDefaultCard && (
            <span className="ml-auto bg-black text-white text-sm px-3 py-0.5 rounded-full">
              대표
            </span>
          )}
        </div>

        {/* 카드 정보 */}
        <div className="flex items-center px-3">
          <div className="flex items-center justify-center min-w-[100px] min-h-[100px] mr-3 overflow-hidden">
            <Image
              src="/everydiscount.png"
              alt="카드의정석 EVERY DISCOUNT"
              width={100}
              height={100}
              className="h-24 w-auto -rotate-90 object-contain"
            />
          </div>
          <div>
            <p className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[270px]">
              {bestDiscountCard.number} {bestDiscountCard.name}
            </p>
            <div className="bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1">
              {bestDiscountCard.discount.toLocaleString()}원 할인
            </div>
          </div>
        </div>

        {/* 결제 버튼 - 선택된 경우에만 표시 */}
        {selectedCard?.id === bestDiscountCard.id && (
          <div className="px-3 pb-3 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProceedToPayment();
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm font-medium rounded-lg"
            >
              이 카드로 결제하기
            </button>
          </div>
        )}
      </div>

      {/* 다른 카드 목록 */}
      {cards
        .filter((card) => card.id !== bestDiscountCard.id)
        .map((card) => (
          <div
            key={card.id}
            className={`${
              selectedCard?.id === card.id
                ? 'bg-blue-100 border-2 border-blue-500'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            } rounded-lg mb-3 overflow-hidden cursor-pointer`}
            onClick={() => {
              setSelectedCard(card);
              onCardSelect(card);
            }}
          >
            <div className="flex px-4 py-2 items-center">
              {/* 카드 이미지 */}
              <div className="flex items-center justify-center min-w-[60px] min-h-[60px] mr-3 overflow-hidden">
                <Image
                  src={card.logo || '/placeholder.svg'}
                  alt={card.name}
                  width={60}
                  height={60}
                  className="h-14 w-auto -rotate-90 object-contain"
                />
              </div>

              {/* 카드 이름 + 혜택 뱃지 (수직 정렬) */}
              <div className="flex flex-col justify-center">
                <p className="text-sm font-medium leading-tight">
                  {card.number} {card.name}
                </p>
                <span className="mt-1 bg-gray-100 text-gray-800 text-[10px] font-medium px-2 py-0.5 rounded-full inline-block w-fit">
                  {card.discount > 0 ? `${card.discount.toLocaleString()}원 할인` : '할인 없음'}
                </span>
              </div>
            </div>

            {/* 결제 버튼 - 선택된 경우에만 표시 */}
            {selectedCard?.id === card.id && (
              <div className="px-3 pb-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProceedToPayment();
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm font-medium rounded-lg"
                >
                  이 카드로 결제하기
                </button>
              </div>
            )}
          </div>
        ))}

      {/* 카드 등록 버튼 */}
      <button className="w-full border border-dashed border-gray-300 rounded-lg py-3 mt-2 text-gray-600 hover:bg-gray-50">
        + 카드 등록하기
      </button>
    </div>
  );
}
