'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentModal } from '@/components/payment-module/payment-modal';
import { PaymentInfo } from '@/components/payment-module/payment-modal';
import { useAuth } from './context/AuthContext';

const Page = () => {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      const currentUrl = window.location.href;
      router.replace(`/login?returnUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // URL에서 결제 정보 가져오기
    const searchParams = new URLSearchParams(window.location.search);
    const info: PaymentInfo = {
      merchantName: searchParams.get('merchantName') || '',
      productName: searchParams.get('productName') || '',
      quantity: Number(searchParams.get('quantity')) || 0,
      price: Number(searchParams.get('price')) || 0,
      totalAmount: Number(searchParams.get('totalAmount')) || 0,
      orderId: searchParams.get('orderId') || '',
    };
    setPaymentInfo(info);
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !paymentInfo) return null;

  return <PaymentModal paymentInfo={paymentInfo} />;
};

export default Page;
