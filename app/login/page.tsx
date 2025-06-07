import { Suspense } from 'react';
import LoginPage from './LoginPage';

export default function Page() {
  return (
      <Suspense fallback={<div>로그인 페이지 로딩 중...</div>}>
        <LoginPage />
      </Suspense>
  );
}