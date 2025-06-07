'use client';

import Image from 'next/image';
import { ThumbsUp, ChevronDown, ChevronUp } from 'lucide-react';
import { CardInfo, MyCard } from '@/constants/payment';
import { useEffect, useState } from 'react';
import { useAuth } from '@/app/context/AuthContext';
import { getCardRecommendations, getMyCards } from '@/app/actions/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

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
  const [recommendedCards, setRecommendedCards] = useState<CardInfo[]>([]);
  const [myCards, setMyCards] = useState<MyCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showMyCards, setShowMyCards] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchRecommendedCards = async () => {
      if (!isAuthenticated) {
        console.log('User is not authenticated');
        return;
      }

      try {
        const token = localStorage.getItem('accessToken');
        let username = 'user'; // 기본값

        // 토큰 디코딩
        if (token) {
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            username = payload.sub; // 토큰에서 사용자 이름 가져오기
          }
        }

        const data = await getCardRecommendations(userId, merchantId, amount, username);

        if (data.success) {
          const mappedCards: CardInfo[] = data.response.map((card, index) => ({
            id: index + 1,
            name: card.cardName,
            number: `(${card.cardNumber})`,
            color: 'bg-gradient-to-r from-gray-800 to-gray-900',
            logo: card.imageUrl,
            imageUrl: card.imageUrl,
            discount: card.discountAmount,
            benefits: [],
            isDefaultCard: card.isDefaultCard,
          }));

          setRecommendedCards(mappedCards);
          setSelectedCard(mappedCards[0]);
          onCardSelect(mappedCards[0]);
        }
      } catch (error) {
        console.error('카드 추천 정보를 가져오는데 실패했습니다:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendedCards();
  }, [userId, merchantId, amount, isAuthenticated, onCardSelect]);

  // 내 카드 목록 조회
  const fetchMyCards = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      let username = 'user'; // 기본값

      // 토큰 디코딩
      if (token) {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          username = payload.sub; // 토큰에서 사용자 이름 가져오기
        }
      }

      const data = await getMyCards(username);
      setMyCards(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    }
  };

  // 내 카드 목록 토글
  const toggleMyCards = async () => {
    if (!showMyCards) {
      await fetchMyCards();
      // 내 카드 목록을 보여줄 때 최고혜택 카드 선택 상태 유지
      setSelectedCard(recommendedCards[0]);
    }
    setShowMyCards(!showMyCards);
  };

  // MyCard를 CardInfo로 변환
  const convertToCardInfo = (myCard: MyCard): CardInfo => {
    return {
      id: myCard.id,
      name: myCard.cardName,
      number: myCard.cardNumber,
      imageUrl: myCard.imageUrl,
      color: '#FFFFFF',
      logo: myCard.imageUrl,
      discount: 0,
      benefits: [],
      isDefaultCard: myCard.isDefaultCard,
      isMyCard: true, // 내 카드 여부를 표시하는 플래그 추가
    };
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 flex items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="size-6 text-red-600" />
          </div>
        </div>
        <p className="text-sm text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">결제 카드 선택</h2>

      {/* 최고 혜택 카드 */}
      <div
        className={`${
          selectedCard?.id === recommendedCards[0].id && !selectedCard?.isMyCard
            ? 'bg-blue-100 border-2 border-blue-500'
            : 'bg-white border border-gray-200 hover:border-gray-300'
        } rounded-lg overflow-hidden mb-4 flex flex-col cursor-pointer`}
        onClick={() => {
          setSelectedCard(recommendedCards[0]);
          onCardSelect(recommendedCards[0]);
        }}
      >
        {/* 타이틀 */}
        <div className="flex items-center px-3 pt-3">
          <ThumbsUp className="text-green-500 mr-2 size-5" />
          <span className="text-green-500 text-base font-semibold">최고 혜택 추천 카드</span>
          {recommendedCards[0].isDefaultCard && (
            <span className="ml-auto bg-black text-white text-sm px-3 py-0.5 rounded-full">
              대표
            </span>
          )}
        </div>

        {/* 카드 정보 */}
        <div className="flex items-center px-3">
          <div className="flex items-center justify-center min-w-[100px] min-h-[100px] mr-3 overflow-hidden">
            <Image
              src={recommendedCards[0].imageUrl || '/placeholder.svg'}
              alt={recommendedCards[0].name}
              width={100}
              height={100}
              className="h-24 w-auto -rotate-90 object-contain"
            />
          </div>
          <div>
            <p className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[270px]">
              {recommendedCards[0].number} {recommendedCards[0].name}
            </p>
            <div className="bg-green-100 text-green-800 text-[10px] font-medium px-2 py-0.5 rounded-full inline-block mt-1">
              {recommendedCards[0].discount.toLocaleString()}원 할인
            </div>
          </div>
        </div>

        {/* 결제 버튼 - 선택된 경우에만 표시 */}
        {selectedCard?.id === recommendedCards[0].id && !selectedCard?.isMyCard && (
          <div className="px-3 pb-3 mt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onProceedToPayment();
              }}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm font-medium rounded-lg cursor-pointer"
            >
              이 카드로 결제하기
            </button>
          </div>
        )}
      </div>

      {/* 다른 카드 목록 */}
      {recommendedCards
        .filter((card) => card.id !== recommendedCards[0].id)
        .map((card) => (
          <div
            key={card.id}
            className={`${
              selectedCard?.id === card.id && !selectedCard?.isMyCard
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
                  {`${card.discount.toLocaleString()}원 할인`}
                </span>
              </div>
            </div>

            {/* 결제 버튼 - 선택된 경우에만 표시 */}
            {selectedCard?.id === card.id && !selectedCard?.isMyCard && (
              <div className="px-3 pb-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProceedToPayment();
                  }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm font-medium rounded-lg cursor-pointer"
                >
                  이 카드로 결제하기
                </button>
              </div>
            )}
          </div>
        ))}

      <div className="mt-6">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 cursor-pointer"
          onClick={toggleMyCards}
        >
          내 카드 모두 보기
          {showMyCards ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>

        {/* 내 카드 목록 */}
        {showMyCards && (
          <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto hide-scrollbar">
            {myCards
              .filter(
                (myCard) =>
                  !recommendedCards.some(
                    (recommendedCard) =>
                      recommendedCard.name === myCard.cardName &&
                      recommendedCard.number === `(${myCard.cardNumber})`
                  )
              )
              .map((card) => (
                <div
                  key={card.id}
                  className={`${
                    selectedCard?.id === card.id && selectedCard?.isMyCard
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  } rounded-lg mb-3 overflow-hidden cursor-pointer`}
                  onClick={() => {
                    const cardInfo = convertToCardInfo(card);
                    setSelectedCard(cardInfo);
                    onCardSelect(cardInfo);
                  }}
                >
                  <div className="flex px-4 py-2 items-center">
                    {/* 카드 이미지 */}
                    <div className="flex items-center justify-center min-w-[60px] min-h-[60px] mr-3 overflow-hidden">
                      <Image
                        src={card.imageUrl}
                        alt={card.cardName}
                        width={60}
                        height={60}
                        className="h-14 w-auto -rotate-90 object-contain"
                      />
                    </div>

                    {/* 카드 이름 + 혜택 뱃지 (수직 정렬) */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center">
                        <p className="text-sm font-medium leading-tight">
                          ({card.cardNumber}) {card.cardName}
                        </p>
                        {card.isDefaultCard && (
                          <span className="ml-2 bg-black text-white text-xs px-2 py-0.5 rounded-full">
                            대표
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 결제 버튼 - 선택된 경우에만 표시 */}
                  {selectedCard?.id === card.id && selectedCard?.isMyCard && (
                    <div className="px-3 pb-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onProceedToPayment();
                        }}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 text-sm font-medium rounded-lg cursor-pointer"
                      >
                        이 카드로 결제하기
                      </button>
                    </div>
                  )}
                </div>
              ))}
            <button
              onClick={() => window.open('https://www.paydeuk.com', '_blank')}
              className="w-full border border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              + 카드 등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
