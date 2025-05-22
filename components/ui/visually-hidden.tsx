import * as React from 'react';

export const VisuallyHidden = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ ...props }, ref) => (
  <span
    ref={ref}
    className="sr-only" // TailwindCSS의 스크린 리더 전용 클래스
    {...props}
  />
));
VisuallyHidden.displayName = 'VisuallyHidden';
