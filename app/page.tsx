'use client';

import React from 'react';
import { PaymentModal } from '@/components/payment-module/payment-modal';

const page = () => {
  // 결제 정보
  const paymentInfo = {
    merchantName: '테크몰',
    productName: 'product.name',
    quantity: 1,
    price: 10000,
    totalAmount: 1 * 10000,
    orderId: `ORDER-${Date.now()}`,
  };
  // 결제 완료 처리
  const handlePaymentComplete = () => {
    // 주문 완료 페이지로 이동
  };

  return <PaymentModal paymentInfo={paymentInfo} onPaymentComplete={handlePaymentComplete} />;
};

export default page;
