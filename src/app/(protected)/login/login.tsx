'use client';

import Link from 'next/link';
import { POST } from '@/configs/axios';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type Field = 'email' | 'password';

type FormData = {
	identifier: string; // Can be email or username
	password: string;
};

export default function LoginPage() {
	const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [isFocused, setIsFocused] = useState({
        email: false,
        password: false,
    });

    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
		watch,
    } = useForm<FormData>({
        mode: 'onSubmit',
        defaultValues: {
            identifier: '',
            password: '',
        },
    });

	const identifierValue = watch('identifier');
	const passwordValue = watch('password');

    const loginMutation = useMutation({
        mutationFn: async (formData: FormData) => {
            return await POST({
                url: '/auth?action=login',
                data: {
                    identifier: formData.identifier,
                    password: formData.password,
                },
                config: {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                },
            });
        },
        onSuccess: (response) => {
            if (response) {
                router.push('/');
            }
        },
        onError: (error) => {
            console.error(`Login failed: ${error}`);
        },
    });

    const handleFocus = (field: Field) => {
        setIsFocused((prev) => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field: Field) => {
        setIsFocused((prev) => ({ ...prev, [field]: false }));
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-dark-background">
            <form
                onSubmit={handleSubmit((data) => loginMutation.mutate(data))}
                className="p-8 rounded-xl shadow-lg w-full max-w-md mx-4 bg-dark-muted border border-gray-700"
            >
                <header className="text-center mb-8">
                    <h1 className="text-3xl font-bold mt-4 text-dark-foreground">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-dark-muted-foreground">
                        Please enter your credentials to login
                    </p>
                </header>

                {loginMutation.isError && (
                    <div className="mb-4 p-3 bg-red-900/20 text-red-300 rounded-lg text-sm">
                        {loginMutation.error instanceof Error
                            ? loginMutation.error.message
                            : 'An error occurred during login'}
                    </div>
                )}

                <div className="relative mb-6">
                    <label
                        htmlFor="email"
                        className={`absolute left-3 transition-all duration-200 z-50 ${
                            isFocused.email || !!identifierValue
                                ? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
                                : 'top-3 left-12 text-dark-muted-foreground'
                        }`}
                    >
                        Email or Username
                    </label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
                        <input
                            type="text"
                            {...register('identifier', {
                                required: 'Email or username is required',
                            })}
                            onFocus={() => handleFocus('email')}
                            onBlur={() => handleBlur('email')}
                            className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
                        />
                    </div>
                    {errors.identifier && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.identifier.message}
                        </p>
                    )}
                </div>

                <div className="relative mb-8">
                    <label
                        htmlFor="password"
                        className={`absolute left-3 transition-all duration-200 z-50 ${
                            isFocused.password || !!passwordValue
                                ? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
                                : 'top-3 left-12 text-dark-muted-foreground'
                        }`}
                    >
                        Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            {...register('password', {
                                required: 'Password is required',
                            })}
                            onFocus={() => handleFocus('password')}
                            onBlur={() => handleBlur('password')}
                            className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
                        />
						<motion.button
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.9 }}
							className='absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground'
							onClick={() => setPasswordVisible(!passwordVisible)}
							disabled={loginMutation.isPending}
						>
							<FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} size='xl' />
						</motion.button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-400">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full py-3 px-4 cursor-pointer font-semibold rounded-lg uppercase transition-all bg-primary-dark text-dark-foreground"
                    disabled={loginMutation.isPending}
                >
                    {loginMutation.isPending ? 'Logging in...' : 'Login'}
                </button>

                <div className="mt-6 text-center text-sm text-dark-muted-foreground">
                    Don't have an account?{' '}
                    <Link
                        href="/register"
                        className="text-primary-dark underline"
                    >
                        Sign up
                    </Link>
                </div>
            </form>
        </main>
    );
}