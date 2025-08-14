import { type NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        return NextResponse.json({ message: 'Hello mga bisaya' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};