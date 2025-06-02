'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SigninRequest {
  username: string;
  password: string;
}

interface TokenResponse {
  accessToken: string;
  redirectUrl: string;
}

interface CommonResponse<T> {
  success: boolean;
  status: string;
  message: string;
  response: T;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (id: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback(async (id: string, password: string) => {
    if (!id || !password) {
      throw new Error('아이디와 비밀번호를 모두 입력해주세요.');
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: id,
          password: password,
        } as SigninRequest),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
        throw new Error('로그인 중 오류가 발생했습니다.');
      }

      const result: CommonResponse<TokenResponse> = await response.json();

      if (!result.success || !result.response) {
        throw new Error(result.message || '로그인에 실패했습니다.');
      }

      const { accessToken } = result.response;
      localStorage.setItem('accessToken', accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
