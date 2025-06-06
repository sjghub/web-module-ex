'use client';

import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { PaymentInfoSection } from './payment-info';
import { CardSelectionSection } from './card-selection';
import { PasswordInputStep } from './password-input';
import { PaymentComplete } from './payment-complete';
import { PaymentStep, CardInfo } from '@/constants/payment';

export interface PaymentInfo {
  merchantName: string;
  productName: string;
  quantity: number;
  price: number;
  totalAmount: number;
  orderId: string;
}

interface PaymentModalProps {
  paymentInfo: PaymentInfo;
}

export function PaymentModal({ paymentInfo }: PaymentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 모달이 열릴 때 포커스 관리
  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.focus();
    }
  }, []);

  const [selectedCard, setSelectedCard] = useState<CardInfo | null>(null);
  const [step, setStep] = useState<PaymentStep>('select-card');
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

  // 할인 금액 계산 - 계산 함수 메모이제이션
  const calculateDiscount = useMemo(() => {
    if (!selectedCard) return 0;
    return Math.round((paymentInfo.totalAmount * selectedCard.discount) / 100);
  }, [selectedCard, paymentInfo.totalAmount]);

  // 최종 결제 금액 계산 - 계산 함수 메모이제이션
  const calculateFinalAmount = useMemo(() => {
    return paymentInfo.totalAmount - calculateDiscount;
  }, [paymentInfo.totalAmount, calculateDiscount]);

  // 결제 완료 후 처리 - 이벤트 핸들러 메모이제이션
  const handleComplete = useCallback(() => {
    const paymentResult = {
      type: 'PAYMENT_COMPLETE',
      data: {
        orderId: paymentInfo.orderId,
        amount: calculateFinalAmount,
        discount: calculateDiscount,
        cardInfo: selectedCard,
        timestamp: new Date().toISOString(),
      },
    };

    // 부모 창으로 메시지 전달
    if (window.parent !== window) {
      window.parent.postMessage(paymentResult, '*');
    }
  }, [paymentInfo.orderId, calculateFinalAmount, calculateDiscount, selectedCard]);

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
        </div>

        <div className="h-px w-19/20 mx-auto bg-gray-200"></div>

        {/* 콘텐츠 */}
        {step === 'select-card' && (
          <div className="flex flex-col md:flex-row">
            <PaymentInfoSection
              merchantName={paymentInfo.merchantName}
              productName={paymentInfo.productName}
              quantity={paymentInfo.quantity}
              totalAmount={paymentInfo.totalAmount}
            />

            <CardSelectionSection
              userId={1}
              merchantId={7}
              amount={paymentInfo.totalAmount}
              onCardSelect={handleCardSelect}
              onProceedToPayment={handleProceedToPayment}
            />
          </div>
        )}

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
          <PaymentComplete
            paymentInfo={paymentInfo}
            calculateDiscount={calculateDiscount}
            calculateFinalAmount={calculateFinalAmount}
            onComplete={handleComplete}
          />
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
