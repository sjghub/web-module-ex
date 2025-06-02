'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { KeyRound, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter as DialogFooterContent,
} from '@/components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { Logo } from '@/components/ui/logo';

const DEFAULT_ERROR_MSG = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';

export default function LoginPage() {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      await login(id, password);
      const returnUrl = searchParams.get('returnUrl') || '/';
      router.push(returnUrl);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : DEFAULT_ERROR_MSG);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setErrorMessage('준비 중인 서비스입니다.');
  };

  return (
    <div className="min-h-screen px-4 pt-20">
      <div className="text-6xl flex justify-center mb-10">
        <Logo />
      </div>

      <div className="flex justify-center items-center">
        <div className="w-full max-w-md">
          <Card className="border-gray-100 shadow-sm py-10">
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-2">
                  <label htmlFor="id" className="text-sm font-medium">
                    아이디
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 -translate-y-1/2" />
                    <Input
                      id="id"
                      type="text"
                      className={`pl-10 ${errorMessage ? 'border-red-500' : ''}`}
                      placeholder="아이디를 입력하세요"
                      value={id}
                      onChange={(e) => setId(e.target.value)}
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div className="space-y-2 pb-6">
                  <label htmlFor="password" className="text-sm font-medium">
                    비밀번호
                  </label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 h-4 w-4 text-gray-400 -translate-y-1/2" />
                    <Input
                      id="password"
                      type="password"
                      className={`pl-10 ${errorMessage ? 'border-red-500' : ''}`}
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded"
                  disabled={isLoading}
                >
                  {isLoading ? '로그인 중...' : '로그인'}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Separator />
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <button onClick={handleLinkClick} className="hover:text-black hover:underline">
                  아이디 찾기
                </button>
                <span>|</span>
                <button onClick={handleLinkClick} className="hover:text-black hover:underline">
                  비밀번호 찾기
                </button>
                <span>|</span>
                <button onClick={handleLinkClick} className="hover:text-black hover:underline">
                  회원가입
                </button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Dialog open={!!errorMessage} onOpenChange={() => setErrorMessage('')}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>알림</DialogTitle>
            <DialogDescription>{errorMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooterContent>
            <Button onClick={() => setErrorMessage('')}>확인</Button>
          </DialogFooterContent>
        </DialogContent>
      </Dialog>
    </div>
  );
}
