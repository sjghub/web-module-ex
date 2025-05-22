'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, X } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { PaymentInfoSection } from './payment-info';
import { CardSelectionSection } from './card-selection';
import { PasswordInputStep } from './password-input';
import { CARDS, PaymentStep, CardInfo } from '@/constants/payment';

interface PaymentModalProps {
  paymentInfo: {
    merchantName: string;
    productName: string;
    quantity: number;
    price: number;
    totalAmount: number;
    orderId: string;
  };
  onPaymentComplete?: () => void;
}

export function PaymentModal({ paymentInfo, onPaymentComplete }: PaymentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // 모달이 열릴 때 포커스 관리
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  // 최고 할인율 카드 찾기 - 메모이제이션
  const bestDiscountCard = useMemo(
    () => CARDS.reduce((prev, current) => (prev.discount > current.discount ? prev : current)),
    []
  );

  const [step, setStep] = useState<PaymentStep>('select-card');
  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(bestDiscountCard);
  const [password, setPassword] = useState<string>('');

  // 비밀번호 입력 처리 - 이벤트 핸들러 메모이제이션
  const handlePasswordInput = useCallback(
    (value: number) => {
      if (password.length < 6) {
        const newPassword = password + value;
        setPassword(newPassword);

        if (newPassword.length === 6) {
          setStep('processing');

          // 결제 처리 시뮬레이션
          setTimeout(() => {
            setStep('complete');
          }, 2000);
        }
      }
    },
    [password]
  );

  // 비밀번호 지우기 - 이벤트 핸들러 메모이제이션
  const handlePasswordDelete = useCallback(() => {
    if (password.length > 0) {
      setPassword(password.slice(0, -1));
    }
  }, [password]);

  // 카드 선택 처리 - 이벤트 핸들러 메모이제이션
  const handleCardSelect = useCallback((card: CardInfo) => {
    setSelectedCard(card);
  }, []);

  // 선택된 카드로 결제 진행 - 이벤트 핸들러 메모이제이션
  const handleProceedToPayment = useCallback(() => {
    if (selectedCard) {
      setStep('enter-password');
    }
  }, [selectedCard]);

  // 결제 완료 후 처리 - 이벤트 핸들러 메모이제이션
  const handleComplete = useCallback(() => {
    if (onPaymentComplete) {
      onPaymentComplete();
    }
  }, [onPaymentComplete]);

  // 할인 금액 계산 - 계산 함수 메모이제이션
  const calculateDiscount = useMemo(() => {
    if (!selectedCard) return 0;
    return Math.round((paymentInfo.totalAmount * selectedCard.discount) / 100);
  }, [selectedCard, paymentInfo.totalAmount]);

  // 최종 결제 금액 계산 - 계산 함수 메모이제이션
  const calculateFinalAmount = useMemo(() => {
    return paymentInfo.totalAmount - calculateDiscount;
  }, [paymentInfo.totalAmount, calculateDiscount]);

  return (
    <div
      ref={modalRef}
      className={`${
        step === 'select-card' ? 'sm:max-w-[1000px]' : 'sm:max-w-[400px]'
      } transition-none h-[720px] px-6 pb-6 pt-0 gap-0 border-0 overflow-hidden bg-white`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      tabIndex={-1}
    >
      <VisuallyHidden>
        <h2 id="payment-modal-title" className="text-lg leading-none font-semibold sr-only">
          결제 모달
        </h2>
      </VisuallyHidden>
      <div className="flex flex-col">
        {/* 헤더 */}
        <div className="relative flex items-center justify-center h-16">
          <Logo className="text-2xl" />
          <button
            ref={closeButtonRef}
            onClick={() => console.log('닫기')}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            aria-label="결제 모달 닫기"
          >
            <X className="size-6" />
          </button>
        </div>

        <div className="h-px w-19/20 mx-auto bg-gray-200"></div>

        {/* 콘텐츠 */}
        <div className="flex flex-col md:flex-row">
          <PaymentInfoSection
            merchantName={paymentInfo.merchantName}
            productName={paymentInfo.productName}
            quantity={paymentInfo.quantity}
            totalAmount={paymentInfo.totalAmount}
          />

          <CardSelectionSection
            cards={CARDS}
            bestDiscountCard={bestDiscountCard}
            selectedCard={selectedCard}
            onCardSelect={handleCardSelect}
            onProceedToPayment={handleProceedToPayment}
          />
        </div>

        {/* 비밀번호 입력 단계 */}
        {step === 'enter-password' && selectedCard && (
          <PasswordInputStep
            selectedCard={selectedCard}
            password={password}
            onClose={() => setStep('select-card')}
            onPasswordInput={handlePasswordInput}
            onPasswordDelete={handlePasswordDelete}
          />
        )}

        {/* 처리 중 단계 */}
        {step === 'processing' && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center">
            <div className="mb-4 flex justify-center">
              <div className="size-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
            </div>
            <h3 className="mb-1 text-lg font-medium">결제 처리 중</h3>
            <p className="text-sm text-gray-600">잠시만 기다려주세요...</p>
          </div>
        )}

        {/* 완료 단계 */}
        {step === 'complete' && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col">
            <button
              onClick={() => setStep('select-card')}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <X className="size-6" />
            </button>

            <div className="flex-1 flex flex-col items-center px-6 py-18 max-w-md mx-auto w-full">
              <div className="rounded-full bg-green-100 p-4 mb-4">
                <CheckCircle className="size-8 text-green-500" />
              </div>

              <h3 className="text-xl font-bold mb-1">결제 완료</h3>
              <p className="text-gray-600 mb-6 text-center">결제가 성공적으로 완료되었습니다.</p>

              <div className="bg-blue-50 rounded-lg p-4 mb-6 w-full text-center">
                <p className="text-sm text-gray-700">
                  이용해주셔서 감사합니다. 결제 내역은 홈페이지에서 확인하실 수 있습니다.
                </p>
              </div>

              <div className="bg-gray-100 rounded-lg p-4 w-full mb-6">
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">상점명</span>
                  <span className="font-medium text-gray-900">{paymentInfo.merchantName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">상품명</span>
                  <span className="font-medium text-gray-900">{paymentInfo.productName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">수량</span>
                  <span className="font-medium text-gray-900">{paymentInfo.quantity}개</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">결제 금액</span>
                  <span className="font-bold text-gray-900">
                    {paymentInfo.totalAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-700">할인 금액</span>
                  <span className="font-medium text-green-500">
                    -{calculateDiscount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-200 mt-2 pt-3">
                  <span className="text-gray-900 font-bold">최종 결제 금액</span>
                  <span className="font-bold">{calculateFinalAmount.toLocaleString()}원</span>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-black hover:bg-gray-800 text-white py-4 font-medium rounded-lg"
                aria-label="결제 완료 확인"
              >
                확인
              </button>
            </div>
          </div>
        )}

        {/* 에러 단계 */}
        {step === 'error' && (
          <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-red-100 p-3">
                <AlertCircle className="size-10 text-red-600" />
              </div>
            </div>
            <h3 className="mb-1 text-lg font-medium">결제 실패</h3>
            <p className="mb-6 text-sm text-gray-600">
              결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.
            </p>
            <Button onClick={() => setStep('select-card')} className="w-40">
              다시 시도
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
