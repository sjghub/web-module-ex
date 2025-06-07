import Image from 'next/image';

interface PaymentInfoSectionProps {
  merchantName: string;
  productName: string;
  quantity: number;
  totalAmount: number;
}

export function PaymentInfoSection({
  merchantName,
  productName,
  quantity,
  totalAmount,
}: PaymentInfoSectionProps) {
  return (
    <div className="flex-1 p-6">
      <h2 className="text-xl font-bold mb-4">결제 정보</h2>

      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">상점명</span>
          <span className="font-medium">{merchantName}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">상품명</span>
          <span className="font-medium">{productName}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">수량</span>
          <span className="font-medium">{quantity}개</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">결제 금액</span>
          <span className="font-bold">{totalAmount.toLocaleString()}원</span>
        </div>
      </div>

      <div className="mt-4 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600">쿠팡에 3번이나 방문하셨네요!</p>
        <p className="text-sm text-gray-600">최대 혜택을 받을 수 있는 카드를 추천해드릴까요?</p>
        <div className="flex justify-end mt-2">
          <a
            href="https://www.paydeuk.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            카드 추천 받으러 가기 →
          </a>
        </div>
      </div>

      <div className="mt-4 overflow-hidden">
        <Image
          src="/starbucks.png"
          alt="별이 쏟아지는, 스타벅스 현대카드"
          width={400}
          height={200}
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
