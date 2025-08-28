'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { POST } from '@/configs/axios';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RegisterOtpResponse {
	message: string;
	firstName: string;
	lastName: string;
	email: string;
	otp: string;
}

type Field = 'firstName' | 'lastName' | 'email' | 'password' | 'confirmPassword';

type FormData = {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	confirmPassword: string;
};

export default function RegisterPage() {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
	const [isFocused, setIsFocused] = useState({
		firstName: false,
		lastName: false,
		email: false,
		password: false,
		confirmPassword: false,
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<FormData>({
		mode: 'onSubmit',
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			confirmPassword: '',
		},
	});

	const firstNameValue = watch('firstName');
	const lastNameValue = watch('lastName');
	const emailValue = watch('email');
	const passwordValue = watch('password');
	const confirmPasswordValue = watch('confirmPassword');

	const registerMutation = useMutation({
		mutationFn: async (formData: FormData): Promise<RegisterOtpResponse> => {
			return await POST<RegisterOtpResponse>({
				url: '/auth?action=send_register_otp',
				data: {
					firstName: formData.firstName,
					lastName: formData.lastName,
					email: formData.email,
					password: formData.password,
					confirmPassword: formData.confirmPassword,
				},
				config: {
					headers: { 'Content-Type': 'application/json' },
				},
			});
		},
		onSuccess: (response) => {
			if (response) {
				if (typeof window !== 'undefined') {
					localStorage.setItem('register_email', response.email);
				}
				router.push(`/verify`);
			}
		},
		onError: (error) => {
			console.error(`Registration failed: ${error}`);
		},
	});

	const handleFocus = (field: Field) => {
		setIsFocused((prev) => ({ ...prev, [field]: true }));
	};

	const handleBlur = (field: Field) => {
		setIsFocused((prev) => ({ ...prev, [field]: false }));
	};

	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-dark-background px-4">
			<header className="mb-4">
				<Image
					src="/Logo.png"
					alt="Community Barter Logo"
					width={80}
					height={80}
					className="bg-white rounded-full px-3 py-2"
				/>
			</header>

			<header className="text-center mb-8">
				<h1 className="text-3xl font-bold mt-4 text-primary-dark">
					Create Account
				</h1>
				<p className="mt-2 text-dark-muted-foreground">
					Join our community by filling in your details below
				</p>
			</header>

			<form
				onSubmit={handleSubmit((data) => registerMutation.mutate(data))}
				className="p-8 rounded-xl shadow-lg w-full max-w-md bg-dark-muted border border-gray-700"
			>
				{registerMutation.isError && (
					<div className="mb-4 p-3 bg-red-900/20 text-red-300 rounded-lg text-sm">
						{registerMutation.error instanceof Error
							? registerMutation.error.message
							: 'An error occurred during registration'}
					</div>
				)}

				<div className="grid grid-cols-2 gap-4 mb-6">
					<div className="relative">
						<label
							htmlFor="firstName"
							className={`absolute left-3 transition-all duration-200 z-50 ${
								isFocused.firstName || firstNameValue
									? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
									: 'top-3 left-12 text-dark-muted-foreground'
							}`}
						>
							First Name
						</label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
							<input
								type="text"
								{...register('firstName', {
									required: 'First name is required',
								})}
								onFocus={() => handleFocus('firstName')}
								onBlur={() => handleBlur('firstName')}
								className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
							/>
						</div>
						{errors.firstName && (
							<p className="mt-1 text-sm text-red-400">
								{errors.firstName.message}
							</p>
						)}
					</div>

					<div className="relative">
						<label
							htmlFor='lastName'
							className={`absolute left-3 transition-all duration-200 z-50 ${
								isFocused.lastName || lastNameValue
									? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
									: 'top-3 left-12 text-dark-muted-foreground'
							}`}
						>
							Last Name
						</label>
						<div className="relative">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
							<input
								type="text"
								{...register('lastName', {
									required: 'Last name is required',
								})}
								onFocus={() => handleFocus('lastName')}
								onBlur={() => handleBlur('lastName')}
								className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
							/>
						</div>
						{errors.lastName && (
							<p className="mt-1 text-sm text-red-400">
								{errors.lastName.message}
							</p>
						)}
					</div>
				</div>

				<div className="relative mb-6">
					<label
						htmlFor="email"
						className={`absolute left-3 transition-all duration-200 z-50 ${
							isFocused.email || emailValue
								? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
								: 'top-3 left-12 text-dark-muted-foreground'
						}`}
					>
						Email Address
					</label>
					<div className="relative">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
						<input
							type="email"
							{...register('email', {
								required: 'Email is required',
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: 'Invalid email address',
								},
							})}
							onFocus={() => handleFocus('email')}
							onBlur={() => handleBlur('email')}
							className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
						/>
					</div>
					{errors.email && (
						<p className="mt-1 text-sm text-red-400">
							{errors.email.message}
						</p>
					)}
				</div>

				<div className="relative mb-6">
					<label
						htmlFor='password'
						className={`absolute left-3 transition-all duration-200 z-50 ${
							isFocused.password || passwordValue
								? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
								: 'top-3 left-12 text-dark-muted-foreground'
						}`}
					>
						Password
					</label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
						<input
							type={showPassword ? 'text' : 'password'}
							{...register('password', {
								required: 'Password is required',
								minLength: {
									value: 8,
									message:
										'Password must be at least 8 characters',
								},
							})}
							onFocus={() => handleFocus('password')}
							onBlur={() => handleBlur('password')}
							className="w-full p-3 pl-12 pr-10 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground"
						>
							{showPassword ? <EyeOff /> : <Eye />}
						</button>
					</div>
					{errors.password && (
						<p className="mt-1 text-sm text-red-400">
							{errors.password.message}
						</p>
					)}
				</div>

				<div className="relative mb-8">
					<label
						htmlFor='confirmPassword'
						className={`absolute left-3 transition-all duration-200 z-50 ${
							isFocused.confirmPassword || confirmPasswordValue
								? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
								: 'top-3 left-12 text-dark-muted-foreground'
						}`}
					>
						Confirm Password
					</label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
						<input
							type={showConfirmPassword ? 'text' : 'password'}
							{...register('confirmPassword', {
								required: 'Confirm Password is required',
							})}
							onFocus={() => handleFocus('confirmPassword')}
							onBlur={() => handleBlur('confirmPassword')}
							className="w-full p-3 pl-12 pr-10 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword(!showConfirmPassword)}
							className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground"
						>
							{showConfirmPassword ? <EyeOff /> : <Eye />}
						</button>
					</div>
					{errors.confirmPassword && (
						<p className="mt-1 text-sm text-red-400">
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<button
					type="submit"
					className="w-full cursor-pointer uppercase py-3 px-4 rounded-lg font-semibold transition-all bg-primary-dark text-dark-foreground"
					disabled={registerMutation.isPending}
				>
					{registerMutation.isPending ? 'Registering...' : 'Register'}
				</button>

				<div className="flex items-center my-6">
					<hr className="flex-1 border-gray-600" />
					<span className="px-3 text-gray-400 text-sm font-medium">
						or
					</span>
					<hr className="flex-1 border-gray-600" />
				</div>

				<div className="mt-6 text-center text-sm text-dark-muted-foreground">
					Already have an account?{' '}
					<Link href="/login">
						<span className="text-primary-dark underline">
							Login
						</span>
					</Link>
				</div>
			</form>
		</main>
	);
}
