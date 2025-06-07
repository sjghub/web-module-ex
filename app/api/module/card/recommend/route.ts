import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { userId, merchantId, amount } = body;
        const username = req.headers.get('x-user-name') || '';

        const response = await fetch('https://internal-alb.example.com/module/api/card/recommend', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-User-Name': username,
            },
            body: JSON.stringify({ userId, merchantId, amount }),
        });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: '카드 추천 정보를 가져오는데 실패했습니다.' },
                { status: response.status }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('카드 추천 API 실패:', error);
        return NextResponse.json(
            { success: false, message: '서버 오류 발생', error: String(error) },
            { status: 500 }
        );
    }
}