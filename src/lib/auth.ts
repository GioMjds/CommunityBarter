import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWTPayload, SignJWT, jwtVerify } from "jose";

interface SessionData extends JWTPayload {
    userId: string;
    email: string;
    username: string;
}

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(data: SessionData) {
    try {
        if (!secretKey) {
            console.error(`JWT secret key is not defined`);
            return null;
        }
    } catch (error) {
        return null;
    }
}