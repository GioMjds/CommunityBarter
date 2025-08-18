'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { POST } from '@/configs/axios';
import { useMutation } from '@tanstack/react-query';
import { User, Lock, Eye, EyeOff, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';

type FormData = {
	otp: string;
	username: string;
	age: number;
	contactNumber: string;
};

export default function VerifyPage() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const email = searchParams.get('email');
	const [otp, setOtp] = useState(Array(6).fill(''));
	const [step, setStep] = useState<number>(1);
	const [tempUser, setTempUser] = useState<{
		firstName: string;
		lastName: string;
		email: string;
		hashedPassword: string;
	} | null>(null);
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

	useEffect(() => {
		const storedEmail = localStorage.getItem('register_email');
		if (storedEmail) sendEmail(storedEmail);
		else router.push('/login');
	}, [router]);

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<FormData>();

	const verifyMutation = useMutation({
		mutationFn: async (otpCode: string) => {
			return await POST({
				url: '/auth?action=verify_otp',
				data: {
					email,
					otp: otpCode,
				},
				config: {
					headers: { 'Content-Type': 'application/json' },
				},
			});
		},
		onSuccess: () => {
			setStep(2);
		},
		onError: (error) => {
			console.error(`OTP verification failed: ${error}`);
		},
	});

	const resendOtpMutation = useMutation({
		mutationFn: async (email: string) => {
			return await POST({
				url: '/auth?action=resend_otp',
				data: {
					email: email
				},
				config: {
					headers: { 'Content-Type': 'application/json' },
				}
			});
		},
		onError: (error) => {
			console.error(`OTP resend failed: ${error}`);
		}
	});

	const completeProfileMutation = useMutation({
		mutationFn: async (data: FormData) => {
			if (!tempUser) throw new Error('User data not found');

			return await POST({
				url: '/auth?action=complete_profile',
				data: {
					firstName: tempUser.firstName,
					lastName: tempUser.lastName,
					email: tempUser.email,
					hashedPassword: tempUser.hashedPassword,
					username: data.username,
					age: data.age,
					contactNumber: data.contactNumber,
				},
				config: {
					headers: { 'Content-Type': 'application/json' },
					withCredentials: true
				},
			});
		},
		onSuccess: (response) => {
			router.push('/');
		},
		onError: (error) => {
			console.error(`Profile completion failed: ${error}`);
			alert('Profile completion failed. Please try again.');
		},
	});

	const handleChange = (value: string, index: number) => {
		if (!/^\d*$/.test(value)) return;
		const newOtp = [...otp];
		newOtp[index] = value.slice(-1);
		setOtp(newOtp);

		if (value) {
			const nextEmpty = newOtp.findIndex((v) => v === '');
			if (nextEmpty !== -1) {
				inputsRef.current[nextEmpty]?.focus();
			} else {
				inputsRef.current[5]?.focus();
			}
		}
	};

	const handleKeyDown = (
		e: React.KeyboardEvent<HTMLInputElement>,
		index: number
	) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			const newOtp = [...otp];
			newOtp[index - 1] = '';
			setOtp(newOtp);
			inputsRef.current[index - 1]?.focus();
		} else if (e.key === 'ArrowLeft' && index > 0) {
			const prev = inputsRef.current[index - 1];
			prev?.focus();
			if (prev)
				prev.setSelectionRange(prev.value.length, prev.value.length);
		} else if (e.key === 'ArrowRight' && index < 5) {
			const next = inputsRef.current[index + 1];
			next?.focus();
			if (next)
				next.setSelectionRange(next.value.length, next.value.length);
		} else {
			const input = inputsRef.current[index];
			if (input)
				input.setSelectionRange(input.value.length, input.value.length);
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const pasteData = e.clipboardData.getData('Text').slice(0, 6).split('');
		const newOtp = [...otp];
		for (let i = 0; i < 6; i++) {
			if (pasteData[i]) newOtp[i] = pasteData[i];
		}
		setOtp(newOtp);
		const lastIndex = pasteData.length >= 6 ? 5 : pasteData.length - 1;
		inputsRef.current[lastIndex]?.focus();
		e.preventDefault();
	};

	const handleFocus = (index: number) => {
		const input = inputsRef.current[index];
		if (input)
			input.setSelectionRange(input.value.length, input.value.length);
	};

	const handleOtpSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const otpCode = otp.join('');
		verifyMutation.mutate(otpCode);
	};

	const handleResendOtp = () => {
		alert('OTP resent to your email');
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-dark-background px-4">
			<div className="mb-4">
				<Image
					src="/Logo.png"
					alt="Community Barter Logo"
					width={80}
					height={80}
					className="bg-white rounded-full px-3 py-2"
				/>
			</div>

			{step === 1 ? (
				<>
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold mt-4 text-primary-dark">
							Verify OTP
						</h1>
						<p className="mt-2 text-dark-muted-foreground">
							We sent a 6-digit code to your email
						</p>
					</div>

					<form
						onSubmit={handleOtpSubmit}
						className="p-8 rounded-xl shadow-lg w-full max-w-md bg-dark-muted border border-gray-700"
					>
						<div className="text-center mb-8">
							<p className="mt-2 text-dark-muted-foreground">
								We sent a 6-digit OTP to:
							</p>
							<p className="font-bold mt-4 text-primary-dark">
								{email}
							</p>
						</div>

						<div className="flex justify-between mb-8">
							{otp.map((digit, index) => (
								<input
									key={index}
									ref={(el) => {
										inputsRef.current[index] = el;
									}}
									type="text"
									inputMode="numeric"
									maxLength={1}
									value={digit}
									onChange={(e) =>
										handleChange(e.target.value, index)
									}
									onKeyDown={(e) => handleKeyDown(e, index)}
									onPaste={handlePaste}
									onFocus={() => handleFocus(index)}
									className="w-12 h-12 text-center focus:ring-2 focus:ring-primary-dark text-dark-foreground rounded-lg border border-muted-foreground bg-dark-muted focus:outline-none text-lg"
								/>
							))}
						</div>

						<button
							type="submit"
							className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-primary-dark text-dark-foreground"
							disabled={verifyMutation.isPending}
						>
							{verifyMutation.isPending
								? 'Verifying...'
								: 'Verify'}
						</button>

						<div className="mt-4 text-center text-sm text-dark-muted-foreground">
							Didn't receive the code?{' '}
							<button
								type="button"
								className="text-primary-dark underline"
								onClick={handleResendOtp}
							>
								Resend OTP
							</button>
						</div>
					</form>
				</>
			) : (
				<>
					<div className="text-center mb-8">
						<h1 className="text-3xl font-bold mt-4 text-primary-dark">
							Complete Your Profile
						</h1>
						<p className="mt-2 text-dark-muted-foreground">
							Just a few more details to get started
						</p>
					</div>

					<form
						onSubmit={handleSubmit((data) =>
							completeProfileMutation.mutate(data)
						)}
						className="p-8 rounded-xl shadow-lg w-full max-w-md bg-dark-muted border border-gray-700"
					>
						<div className="mb-6">
							<label className="block text-sm font-medium text-dark-muted-foreground mb-2">
								Username
							</label>
							<div className="relative">
								<User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
								<input
									type="text"
									{...register('username', {
										required: 'Username is required',
										minLength: {
											value: 3,
											message:
												'Username must be at least 3 characters',
										},
										pattern: {
											value: /^[a-zA-Z0-9_]+$/,
											message:
												'Username can only contain letters, numbers, and underscores',
										},
									})}
									className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
								/>
							</div>
							{errors.username && (
								<p className="mt-1 text-sm text-red-400">
									{errors.username.message}
								</p>
							)}
						</div>

						<div className="mb-6">
							<label className="block text-sm font-medium text-dark-muted-foreground mb-2">
								Age
							</label>
							<input
								type="number"
								{...register('age', {
									required: 'Age is required',
									min: {
										value: 18,
										message:
											'You must be at least 18 years old',
									},
									max: {
										value: 120,
										message: 'Please enter a valid age',
									},
									valueAsNumber: true,
								})}
								className="w-full p-3 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
							/>
							{errors.age && (
								<p className="mt-1 text-sm text-red-400">
									{errors.age.message}
								</p>
							)}
						</div>

						<div className="mb-8">
							<label className="block text-sm font-medium text-dark-muted-foreground mb-2">
								Contact Number
							</label>
							<div className="relative">
								<Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
								<input
									type="tel"
									{...register('contactNumber', {
										required: 'Contact number is required',
										pattern: {
											value: /^[0-9]{10,15}$/,
											message:
												'Please enter a valid phone number (10-15 digits)',
										},
									})}
									className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
									placeholder="e.g., 09123456789"
								/>
							</div>
							{errors.contactNumber && (
								<p className="mt-1 text-sm text-red-400">
									{errors.contactNumber.message}
								</p>
							)}
						</div>

						<button
							type="submit"
							className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-primary-dark text-dark-foreground"
							disabled={completeProfileMutation.isPending}
						>
							{completeProfileMutation.isPending
								? 'Completing...'
								: 'Complete Registration'}
						</button>
					</form>
				</>
			)}
		</div>
	);
}
