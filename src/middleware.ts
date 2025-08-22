import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;
	return NextResponse.next();
}

export const config = {
	matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ]
}