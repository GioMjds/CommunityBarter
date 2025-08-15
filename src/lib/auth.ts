import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { JWTPayload, SignJWT, jwtVerify } from "jose";
import prisma from "./prisma";

interface SessionData extends JWTPayload {
    userId: string;
    email: string;
    username: string;
}

const secretKey = process.env.JWT_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: Record<string, unknown>) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime("1d")
        .sign(encodedKey);
};

export async function decrypt(token: string) {
    const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ['HS256'],
    });
    return payload;
};

export async function createSession(userId: string) {
    try {
        if (!secretKey) {
            console.error(`JWT secret key is not defined`);
            return null;
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: { email: true, username: true },
        });

        if (!user) throw new Error("User not found.");

        const sessionData: SessionData = {
            userId,
            email: user.email,
            username: user.username,
        };

        const accessToken = await new SignJWT(sessionData)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime("1d")
            .sign(encodedKey);
        
        const refreshToken = await new SignJWT({ userId })
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime("30d")
            .sign(encodedKey);

        return { sessionData, accessToken, refreshToken };
    } catch (error) {
        console.error(`Error creating session: ${error}`);
        return null;
    }
};

export async function verifyToken(token: string) {
    return jwtVerify(token, encodedKey);
};

export async function cookiesToDelete() {
    return ['access_token', 'refresh_token'];
};

export async function getSession(): Promise<SessionData | null> {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('access_token')?.value;
        
        if (token) {
            try {
                const verified = await jwtVerify(token, encodedKey);
                return verified.payload as SessionData;
            } catch (error) {
                console.error(`Error verifying token: ${error}`);
            }
        }

        return null;
    } catch (error) {
        console.error(`Error getting session: ${error}`);
        return null;
    }
};

export async function getCurrentUser() {
    const session = await getSession();
    if (!session) return null;
    
    try {
        const user = await prisma.users.findUnique({
            where: { id: session.userId },
            select: {
                id: true,
                name: true,
                email: true,
                username: true,
                profileImage: true
            },
        });

        return user;
    } catch (error) {
        console.error(`Error fetching user: ${error}`);
        return null;
    }
};