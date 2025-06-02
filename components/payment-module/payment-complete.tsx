import { CheckCircle } from 'lucide-react';
import { PaymentInfo } from './payment-modal';

interface PaymentCompleteProps {
  paymentInfo: PaymentInfo;
  calculateDiscount: number;
  calculateFinalAmount: number;
  onComplete: () => void;
}

export function PaymentComplete({
  paymentInfo,
  calculateDiscount,
  calculateFinalAmount,
  onComplete,
}: PaymentCompleteProps) {
  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col">
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
          onClick={onComplete}
          className="w-full bg-black hover:bg-gray-800 text-white py-4 font-medium rounded-lg"
          aria-label="결제 완료 확인"
        >
          확인
        </button>
      </div>
    </div>
  );
}
