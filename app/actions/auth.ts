'use server';

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

export async function signin(id: string, password: string): Promise<CommonResponse<TokenResponse>> {
  if (!id || !password) {
    throw new Error('아이디와 비밀번호를 모두 입력해주세요.');
  }

  try {
    const response = await fetch('http://localhost:8080/auth/api/signin', {
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

    return result;
  } catch (error) {
    throw error;
  }
}
