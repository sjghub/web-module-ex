import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const username = req.headers.get('x-user-name') || '';
        const authHeader = req.headers.get('authorization');
        const response = await fetch('https://internal-alb.example.com/service/api/card/my', {
            method: 'GET',
            headers: {
                'X-User-Name': username,
                ...(authHeader && { Authorization: authHeader }),
            }
        });

        if (!response.ok) {
            return NextResponse.json(
                { success: false, message: '내 카드 목록을 불러오는데 실패했습니다.' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log("data = ", data );
        return NextResponse.json(data);
    } catch (error) {
        console.error('카드 목록 API 실패:', error);
        return NextResponse.json(
            { success: false, message: '서버 오류 발생', error: String(error) },
            { status: 500 }
        );
    }
}