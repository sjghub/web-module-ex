'use server';

import { PaymentRequest } from '@/constants/payment';

interface PaymentResponse {
  success: boolean;
  status: string;
  message: string;
  response?: {
    errorCode: string;
    time: string;
    stackTrace: string;
    errors: string;
  };
}

export async function processPayment(
  username: string,
  request: PaymentRequest
): Promise<PaymentResponse> {
  try {
    const response = await fetch('http://localhost:8082/module/api/payment/pay', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Name': username,
      },
      body: JSON.stringify(request),
      cache: 'no-store',
    });

    const data = await response.json();
    console.log('서버 응답:', data);

    if (!response.ok) {
      return {
        success: false,
        status: data.status || 'ERROR',
        message: data.message || '결제 처리에 실패했습니다.',
        response: data.response,
      };
    }

    return {
      success: true,
      status: 'SUCCESS',
      message: '결제가 성공적으로 처리되었습니다.',
      response: data,
    };
  } catch (error) {
    console.error('결제 처리 중 오류:', error);
    throw error;
  }
}
