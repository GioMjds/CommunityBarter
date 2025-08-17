'use client';

import { useState, useId } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

type Field = 'email' | 'password';

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
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isFocused, setIsFocused] = useState({
		email: false,
		password: false,
	});

	const emailId = useId();
	const passwordId = useId();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Email:', email);
		console.log('Password:', password);
		alert(`Logging in with ${email}`);
	};

	const handleFocus = (field: Field) => {
		setIsFocused((prev) => ({ ...prev, [field]: true }));
	};

	const handleBlur = (field: Field) => {
		setIsFocused((prev) => ({ ...prev, [field]: false }));
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="min-h-screen bg-[var(--color-dark-background)] flex items-center justify-center p-4">
			<div className="w-full max-w-md">
				{/* Logo Section */}
				<div className="text-center mb-8">
					<div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl mb-6">
						<Image
							src="/logo.png"
							alt="Community Barter Logo"
							width={60}
							height={60}
							className="rounded-full"
						/>
					</div>
					<h1 className="text-4xl font-bold text-[var(--color-primary-dark)] mb-2">
						Welcome Back
					</h1>
					<p className="text-[var(--color-dark-muted-foreground)] text-lg">
						Sign in to your Community Barter account
					</p>
				</div>

				{/* Login Form */}
				<div className="bg-[var(--color-dark-muted)] rounded-2xl shadow-2xl border border-[#3B3B4B] p-8">
					<form onSubmit={handleSubmit} className="space-y-6">
						{/* Email Field */}
						<div className="relative mb-6">
							<label
								htmlFor={emailId}
								className={`absolute left-3 transition-all duration-300 z-50 ${
									isFocused.email || email
										? '-top-3 text-xs px-2 py-1 translate-y-1 bg-[var(--color-dark-background)] text-[#3B82F6] rounded-md'
										: 'top-4 left-12 text-[var(--color-dark-muted-foreground)]'
								}`}
							>
								Email Address
							</label>
							<div className="relative">
								<User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted-foreground)] w-5 h-5" />
								<input
									id={emailId}
									type="email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onFocus={() => handleFocus('email')}
									onBlur={() => handleBlur('email')}
									className="w-full pl-12 pr-4 py-4 bg-[var(--color-dark-muted)] border border-[#3B3B4B] rounded-xl text-[var(--color-dark-foreground)] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300"
									required
								/>
							</div>
						</div>

						{/* Password Field */}
						<div className="relative mb-6">
							<label
								htmlFor={passwordId}
								className={`absolute left-3 transition-all duration-300 z-50 ${
									isFocused.password || password
										? '-top-3 text-xs px-2 py-1 translate-y-1 bg-[var(--color-dark-background)] text-[#3B82F6] rounded-md'
										: 'top-4 left-12 text-[var(--color-dark-muted-foreground)]'
								}`}
							>
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted-foreground)] w-5 h-5" />
								<input
									id={passwordId}
									type={showPassword ? 'text' : 'password'}
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									onFocus={() => handleFocus('password')}
									onBlur={() => handleBlur('password')}
									className="w-full pl-12 pr-12 py-4 bg-[var(--color-dark-muted)] border border-[#3B3B4B] rounded-xl text-[var(--color-dark-foreground)] focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300"
									required
								/>
								<button
									type="button"
									onClick={togglePasswordVisibility}
									className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted-foreground)] hover:text-[var(--color-dark-foreground)] transition-colors duration-200"
								>
									{showPassword ? (
										<EyeOff className="w-5 h-5" />
									) : (
										<Eye className="w-5 h-5" />
									)}
								</button>
							</div>
						</div>

						{/* Forgot Password Link */}
						<div className="text-right">
							<a
								href="#"
								className="text-sm text-[#3B82F6] hover:text-[#60A5FA] transition-colors duration-200"
							>
								Forgot your password?
							</a>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full bg-[var(--color-primary-dark)] hover:bg-[#E65C00] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
						>
							Sign In
						</button>
					</form>

					{/* Divider */}
					<div className="my-6 flex items-center">
						<div className="flex-1 border-t border-[#3B3B4B]"></div>
						<span className="px-4 text-[var(--color-dark-muted-foreground)] text-sm">or</span>
						<div className="flex-1 border-t border-[#3B3B4B]"></div>
					</div>

					{/* Sign Up Link */}
					<div className="text-center">
						<p className="text-[var(--color-dark-muted-foreground)]">
							Don't have an account?{' '}
							<a
								href="#"
								className="text-[#3B82F6] hover:text-[#60A5FA] font-medium transition-colors duration-200"
							>
								Sign up here
							</a>
						</p>
					</div>
				</div>

				{/* Footer */}
				<div className="text-center mt-8">
					<p className="text-[var(--color-dark-muted-foreground)] text-sm">
						© 2024 Community Barter. All rights reserved.
					</p>
				</div>
			</div>
		</div>
	);
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