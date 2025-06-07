import { ArrowLeft } from 'lucide-react';
import { PaymentKeypad } from '@/components/payment-module/payment-keypad';
import { CardInfo } from '@/constants/payment';

interface PasswordInputStepProps {
  selectedCard: CardInfo;
  password: string;
  onClose: () => void;
  onPasswordInput: (value: number) => void;
  onPasswordDelete: () => void;
  error: string | null;
}

export function PasswordInputStep({
  selectedCard,
  password,
  onClose,
  onPasswordInput,
  onPasswordDelete,
}: PasswordInputStepProps) {
  return (
    <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center">
      <button
        onClick={onClose}
        className="absolute left-4 top-4 text-gray-500 hover:text-gray-700"
        aria-label="비밀번호 입력 취소"
      >
        <ArrowLeft className="size-6" />
      </button>

      <div className="mb-6 text-center">
        <h3 className="mb-1 text-xl font-bold">{selectedCard.name}</h3>
        <p className="text-sm text-gray-600">{selectedCard.number}</p>
      </div>

      <div className="mb-6">
        <p className="mb-12 text-center text-sm text-gray-600">
          간편 결제를 위한 6자리 비밀번호를 입력해주세요.
        </p>
        <div className="flex justify-center gap-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-center w-6 h-6">
              {password.length > i ? (
                <div className="w-2 h-2 bg-black rounded-full"></div>
              ) : (
                <div className="w-6 h-0.5 bg-black"></div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="w-64">
        <PaymentKeypad onNumberClick={onPasswordInput} onDeleteClick={onPasswordDelete} />
      </div>
    </div>
  );
}
