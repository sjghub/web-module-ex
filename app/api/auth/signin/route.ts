// app/api/auth/signin/route.ts
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; // 개발 환경용 (주의)

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { username, password } = body;

        const res = await fetch('https://internal-alb.example.com/auth/api/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: 'Upstream 서버 오류', status: res.status },
                { status: res.status },
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        console.error('[API] signin route error:', err);
        return NextResponse.json(
            { success: false, message: 'API 처리 중 오류 발생', error: String(err) },
            { status: 500 },
        );
    }
}
