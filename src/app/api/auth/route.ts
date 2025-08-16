import { type NextRequest, NextResponse } from "next/server";
import { createSession, cookiesToDelete } from "@/lib/auth";
import { otpStorage } from "@/configs/otp";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";
import cloudinary from "@/lib/cloudinary";
import { compare, hash } from "bcrypt";
import { sendOtpEmail } from "@/configs/email";

export async function POST(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const action = searchParams.get("action");

        switch (action) {
            case "logout": {
                const sessionId = req.cookies.get("access_token")?.value;

                if (!sessionId) {
                    return NextResponse.json({
                        error: "No session found"
                    }, { status: 400 });
                }

                const response = NextResponse.json({
                    message: "Logged out successfully"
                }, { status: 200 });

                const deletionOfCookies = await cookiesToDelete();

                for (const cookie of deletionOfCookies) {
                    response.cookies.delete(cookie);
                }

                return response;
            }
            case "login": {
                const { identifier, password } = await req.json(); // Identifier for either email or username

                const user = await prisma.users.findFirst({
                    where: {
                        OR: [
                            { email: identifier },
                            { username: identifier }
                        ]
                    }
                });

                if (!identifier || !password) {
                    return NextResponse.json({
                        error: "Email or username and password are required."
                    }, { status: 400 });
                }

                if (!user) {
                    return NextResponse.json({
                        error: "User not found."
                    }, { status: 404 });
                }

                const isPasswordValid = await compare(password, user.password);

                if (!isPasswordValid) {
                    return NextResponse.json({
                        error: "Your password is incorrect."
                    }, { status: 401 });
                }

                const session = await createSession(user.id);

                if (!session) {
                    return NextResponse.json({
                        error: "Failed to create session."
                    }, { status: 500 });
                }

                const response = NextResponse.json({
                    message: `User ${user.name} logged in.`,
                    user: {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        username: user.username,
                        profileImage: user.profileImage
                    }
                }, { status: 200 });

                response.cookies.set({
                    name: "access_token",
                    value: session.accessToken,
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24,
                });

                response.cookies.set({
                    name: "refresh_token",
                    value: session.refreshToken,
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    path: "/",
                    maxAge: 60 * 60 * 24 * 30,
                });

                return response;
            }
            case "send_register_otp": { // /register page.tsx -> for email verification in register/page.tsx
                const { firstName, lastName, email, age, username, password, confirmPassword } = await req.json();
            
                if (!firstName || !lastName) {
                    return NextResponse.json({
                        error: "First name and last name are required."
                    }, { status: 400 });
                }

                if (!email || !age || !username || !password || !confirmPassword) {
                    return NextResponse.json({
                        error: "All fields are required."
                    }, { status: 400 });
                }

                const ageNum = Number(age);
                
                if (isNaN(ageNum) || (ageNum < 18 || ageNum > 90)) {
                    return NextResponse.json({
                        error: "Age must be a number between 18 and 90."
                    }, { status: 400 });
                }

                if (password !== confirmPassword) {
                    return NextResponse.json({
                        error: "Passwords do not match."
                    }, { status: 200 });
                }

                const existingUsername = await prisma.users.findUnique({
                    where: { username: username }
                });

                if (existingUsername) {
                    return NextResponse.json({
                        error: "Username already exists."
                    }, { status: 400 });
                }

                const otp = Math.floor(10000 + Math.random() * 90000).toString();
                const hashedPassword = await hash(password, 10);

                otpStorage.set(firstName, lastName, email, otp, hashedPassword, 5, username);

                await sendOtpEmail(email, otp);

                return NextResponse.json({
                    message: "OTP sent to your email",
                    firstName: firstName,
                    lastName: lastName,
                    username: username,
                    age: ageNum,
                    otp: otp
                }, { status: 200 });
            }
            case "verify_otp": {
                const { email, otp } = await req.json();

                const validation = otpStorage.validate(email, otp);

                if (!validation.valid) {
                    return NextResponse.json({
                        error: validation.error
                    }, { status: 400 });
                }

                const hashedPassword = validation.data?.hashedPassword;
                const firstName = validation.data?.firstName;
                const lastName = validation.data?.lastName;
                const username = validation.data?.username;
                const age = validation.data?.age;

                if (!hashedPassword || !username) {
                    return NextResponse.json({
                        error: "No hashed password found in this email."
                    }, { status: 400 });
                }

                let profileImageUrl: string = "";

                try {
                    const defaultPath = path.join(
                        process.cwd(),
                        "public",
                        "Default_pfp.jpg"
                    );
                    const imageBuffer = fs.readFileSync(defaultPath);
                    const base64Items = `data:image/jpeg;base64,${imageBuffer.toString("base64")}`;
                    
                    const uploadResponse = await cloudinary.uploader.upload(
                        base64Items,
                        {
                            folder: "palitantayo/profiles",
                            public_id: `user-${email.replace(/[^a-zA-Z0-9]/g, "_")}`,
                            overwrite: true,
                            resource_type: "image"
                        }
                    );

                    profileImageUrl = uploadResponse.secure_url;
                } catch (error) {
                    console.error(`Error uploading profile image: ${error}`);
                }

                const newUser = await prisma.users.create({
                    data: {
                        id: crypto.randomUUID(),
                        name: `${firstName} ${lastName}`,
                        email: email,
                        password: hashedPassword,
                        username: username,
                        age: age,
                        profileImage: profileImageUrl
                    }
                });

                otpStorage.delete(email);

                return NextResponse.json({
                    message: `User ${username} created successfully`,
                    user: {
                        id: newUser.id,
                        email: newUser.email,
                        name: newUser.name,
                        username: newUser.username,
                        age: newUser.age,
                        profileImage: newUser.profileImage
                    }
                }, { status: 201 });
            }
            default: {
                return NextResponse.json({
                    error: "Invalid action"
                }, { status: 400 });
            }
        }
    } catch (error) {
        return NextResponse.json({
            error: `/api/auth POST error: ${error}`,
        }, { status: 500 });
    }
}