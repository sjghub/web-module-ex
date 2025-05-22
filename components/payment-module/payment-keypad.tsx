import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SkipBackIcon as Backspace, RefreshCw } from "lucide-react";

type PaymentKeypadProps = {
  onNumberClick: (num: number) => void;
  onDeleteClick: () => void;
};

export function PaymentKeypad({
  onNumberClick,
  onDeleteClick,
}: PaymentKeypadProps) {
  const [pinNumbers, setPinNumbers] = useState<number[]>([]);

  useEffect(() => {
    shufflePinNumbers();
  }, []);

  const shufflePinNumbers = () => {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = numbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    setPinNumbers(numbers);
  };

  const handleShufflePinNumbers = () => {
    shufflePinNumbers();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        {/* 1~9 랜덤 출력 */}
        {pinNumbers.map((num) => (
          <Button
            key={num}
            type="button"
            onClick={() => onNumberClick(num)}
            className="h-16 text-2xl font-medium text-gray-900 hover:bg-gray-50"
            variant="ghost" // <- 여기!
          >
            {num}
          </Button>
        ))}

        {/* 재배열 */}
        <Button
          type="button"
          onClick={handleShufflePinNumbers}
          className="h-16 text-gray-900 hover:bg-gray-50"
          variant="ghost" // <- 그대로 유지
        >
          <RefreshCw className="size-5" />
        </Button>

        {/* 0 */}
        <Button
          type="button"
          onClick={() => onNumberClick(0)}
          className="h-16 text-2xl font-medium bg-white text-gray-900 hover:bg-gray-50"
          variant="ghost" // <- 여기!
        >
          0
        </Button>

        {/* 삭제 */}
        <Button
          type="button"
          onClick={onDeleteClick}
          className="h-16 text-gray-900 hover:bg-gray-50"
          variant="ghost" // <- 그대로 유지
        >
          <Backspace className="size-5" />
        </Button>
      </div>
    </div>
  );
}
