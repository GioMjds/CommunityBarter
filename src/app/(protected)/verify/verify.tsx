'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { User, Phone } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { POST } from '@/configs/axios';

interface OtpVerifyResponse {
	message: string;
	user: {
		firstName: string;
		lastName: string;
		email: string;
		password: string;
	};
}

interface ResendOtpResponse {
	message: string;
}

interface CompleteProfileResponse {
	message: string;
	user: {
		id: string;
		firstName: string;
		lastName: string;
		name: string;
		email: string;
		username: string;
		password: string;
		age: number;
		contact_number: string;
		profileImage: string;
	};
}

type FormData = {
	username: string;
	age: number;
	contactNumber: string;
};

export default function VerifyPage({ verifyEmail = "" }: { verifyEmail?: string }) {
	const [otp, setOtp] = useState<string[]>(new Array(5).fill(''));
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [resendLoading, setResendLoading] = useState<boolean>(false);
	const [resendMessage, setResendMessage] = useState<string | null>(null);
	const [cooldownTime, setCooldownTime] = useState<number>(0);
	const [isCooldown, setIsCooldown] = useState<boolean>(false);
	const [email, setEmail] = useState<string>(verifyEmail);
	const [step, setStep] = useState<number>(1);
	const [userData, setUserData] = useState<CompleteProfileResponse['user'] | null>(null);

	const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

	const router = useRouter();

	useEffect(() => {
		const storedEmail = localStorage.getItem('register_email');
		if (storedEmail) setEmail(storedEmail);
		else router.push('/login');
	}, [router]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	const verifyMutation = useMutation({
		mutationFn: async (): Promise<OtpVerifyResponse> => {
			return await POST<OtpVerifyResponse>({
				url: '/auth?action=verify_otp',
				data: {
					email: email,
					otp: otp.join(''),
				},
			});
		},
		onSuccess: (response) => {
			if (response && response.message) {
				setSuccess('OTP verified successfully!');
				setUserData(response.user);
				setStep(2);
			}
		},
		onError: (error: string) => {
			setError(error || 'An error occurred while verifying OTP.');
			setOtp(new Array(5).fill(''));
			inputRefs.current[0]?.focus();
		},
	});

	const resendOtpMutation = useMutation({
		mutationFn: async (): Promise<ResendOtpResponse> => {
			return await POST({
				url: '/auth?action=resend_otp',
				data: { email: email },
			});
		},
		onSuccess: (response) => {
			if (response && response.message) {
				setResendMessage('OTP resent successfully!');
				setCooldownTime(60);
				setIsCooldown(true);
			}
		},
		onError: (error: string) => {
			setError(`Failed to resend OTP. ${error}`);
		},
	});

	const completeProfileMutation = useMutation({
		mutationFn: async (
			data: FormData
		): Promise<CompleteProfileResponse> => {
			return await POST<CompleteProfileResponse>({
				url: '/auth?action=complete_profile',
				data: {
					firstName: userData?.firstName,
					lastName: userData?.lastName,
					email: userData?.email,
					hashedPassword: userData?.password,
					username: data.username,
					age: data.age,
					contactNumber: data.contactNumber,
				},
			});
		},
		onSuccess: () => {
			localStorage.removeItem('register_email');
			router.push('/');
		},
		onError: (error: string) => {
			setError(`Failed to complete profile: ${error}`);
		},
	});

	useEffect(() => {
		let timer: NodeJS.Timeout | null = null;
		if (isCooldown) {
			timer = setInterval(() => {
				setCooldownTime((prevTime) => {
					if (prevTime <= 1) {
						setIsCooldown(false);
						return 0;
					}
					return prevTime - 1;
				});
			}, 1000);
		}
		return () => {
			if (timer) clearInterval(timer);
		};
	}, [isCooldown]);

	const formatCooldownTime = () => {
		const minutes = Math.floor(cooldownTime / 60);
		const seconds = cooldownTime % 60;
		return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
	};

	const handleChange = (index: number, value: string) => {
		if (/^[0-9]$/.test(value)) {
			const newOtp = [...otp];
			newOtp[index] = value;
			setOtp(newOtp);
			if (index < 4) inputRefs.current[index + 1]?.focus();
		} else if (value === '') {
			const newOtp = [...otp];
			newOtp[index] = '';
			setOtp(newOtp);
		}
	};

	const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
		if (e.key === 'Backspace' && !otp[index] && index > 0) {
			inputRefs.current[index - 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pasteData = e.clipboardData.getData('text/plain').slice(0, 5);
		const newOtp = [...otp];
		pasteData.split('').forEach((char, i) => {
			if (i < 5 && /^[0-9]$/.test(char)) {
				newOtp[i] = char;
			}
		});
		setOtp(newOtp);
		const lastFilledIndex = pasteData.split('').findIndex((c) => !c) - 1;
		inputRefs.current[Math.min(4, lastFilledIndex)]?.focus();
	};

	const handleResendOtp = async () => {
		setResendLoading(true);
		setResendMessage(null);
		setError(null);
		try {
			resendOtpMutation.mutate();
		} catch (error) {
			console.error(`Error resending OTP: ${error}`);
			setError('Failed to resend OTP. Please try again.');
		} finally {
			setResendLoading(false);
		}
	};

	if (!email) return null;

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-primary to-bg-accent">
			<motion.div
				initial={{ opacity: 0, y: 40 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: 'easeOut' }}
				className="bg-white/90 shadow-xl rounded-2xl p-8 w-full max-w-md flex flex-col items-center border border-border-light backdrop-blur-md"
			>
				{step === 1 ? (
					<>
						<div className="mb-4">
							<Image
								src="/Logo.png"
								alt="Community Barter Logo"
								width={80}
								height={80}
								className="bg-white rounded-full px-3 py-2"
							/>
						</div>

						<h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">
							Verify OTP
						</h1>
						{email && (
							<div className="mb-2 text-lg font-semibold text-primary break-all">
								{email}
							</div>
						)}
						<p className="text-text-light mb-6 text-center text-base">
							Enter the 5-digit code sent to your email to verify
							your account.
						</p>

						<form
							onSubmit={(e) => {
								e.preventDefault();
								verifyMutation.mutate();
							}}
							className="w-full flex flex-col gap-4"
						>
							<div className="flex justify-center gap-2 mb-2">
								{otp.map((value, i) => (
									<input
										key={i}
										ref={(el) => {
											inputRefs.current[i] = el;
										}}
										type="text"
										maxLength={1}
										className="w-10 h-12 text-center text-2xl font-semibold border-b-2 border-[var(--color-border)] focus:outline-none focus:border-[var(--color-accent)] bg-transparent transition-colors duration-200"
										inputMode="numeric"
										pattern="[0-9]*"
										value={value}
										onChange={(e) =>
											handleChange(i, e.target.value)
										}
										onKeyDown={(e) => handleKeyDown(i, e)}
										onPaste={handlePaste}
										disabled={verifyMutation.isPending}
									/>
								))}
							</div>

							{error && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-red-500 text-center font-medium"
								>
									{error}
								</motion.p>
							)}

							{success && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-green-600 text-center font-medium"
								>
									{success}
								</motion.p>
							)}

							<motion.button
								whileTap={{ scale: 0.97 }}
								whileHover={{ scale: 1.03 }}
								type="submit"
								className={`w-full py-2 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${
									verifyMutation.isPending
										? 'opacity-50 cursor-not-allowed'
										: 'cursor-pointer'
								}`}
								disabled={
									otp.some((num) => num === '') ||
									verifyMutation.isPending
								}
							>
								{verifyMutation.isPending
									? 'Verifying...'
									: 'Verify OTP'}
							</motion.button>
						</form>

						<div className="mt-6 text-sm text-text-light">
							Didn&apos;t receive a code?{' '}
							{isCooldown ? (
								<span className="text-gray-400">
									Resend available in {formatCooldownTime()}
								</span>
							) : (
								<button
									className={`text-accent hover:underline font-medium ${
										resendLoading
											? 'opacity-50 cursor-not-allowed'
											: ''
									}`}
									onClick={handleResendOtp}
									disabled={resendLoading || isCooldown}
								>
									{resendLoading ? 'Resending...' : 'Resend'}
								</button>
							)}
						</div>

						{resendMessage && (
							<motion.p
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className="text-green-600 text-center font-medium mt-2"
							>
								{resendMessage}
							</motion.p>
						)}
					</>
				) : (
					<>
						<div className="mb-4">
							<Image
								src="/Logo.png"
								alt="Community Barter Logo"
								width={80}
								height={80}
								className="bg-white rounded-full px-3 py-2"
							/>
						</div>

						<h1 className="text-3xl font-bold text-primary mb-2 tracking-tight">
							Complete Your Profile
						</h1>
						<p className="text-text-light mb-6 text-center text-base">
							Just a few more details to get started
						</p>

						<form
							onSubmit={handleSubmit((data) =>
								completeProfileMutation.mutate(data)
							)}
							className="w-full flex flex-col gap-4"
						>
							<div>
								<label className="block text-sm font-medium text-text-light mb-2">
									Username
								</label>
								<div className="relative">
									<User className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
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
										className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-border-light bg-white text-foreground"
									/>
								</div>
								{errors.username && (
									<p className="mt-1 text-sm text-red-400">
										{errors.username.message}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-text-light mb-2">
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
									className="w-full p-3 rounded-lg focus:outline-none border border-border-light bg-white text-foreground"
								/>
								{errors.age && (
									<p className="mt-1 text-sm text-red-400">
										{errors.age.message}
									</p>
								)}
							</div>

							<div>
								<label className="block text-sm font-medium text-text-light mb-2">
									Contact Number
								</label>
								<div className="relative">
									<Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-text-light" />
									<input
										type="tel"
										{...register('contactNumber', {
											required:
												'Contact number is required',
											pattern: {
												value: /^[0-9]{10,15}$/,
												message:
													'Please enter a valid phone number (10-15 digits)',
											},
										})}
										className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-border-light bg-white text-foreground"
										placeholder="e.g., 09123456789"
									/>
								</div>
								{errors.contactNumber && (
									<p className="mt-1 text-sm text-red-400">
										{errors.contactNumber.message}
									</p>
								)}
							</div>

							{error && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-red-500 text-center font-medium"
								>
									{error}
								</motion.p>
							)}

							<motion.button
								whileTap={{ scale: 0.97 }}
								whileHover={{ scale: 1.03 }}
								type="submit"
								className={`w-full py-2 rounded-lg bg-gradient-to-r from-secondary to-accent text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 ${
									completeProfileMutation.isPending
										? 'opacity-50 cursor-not-allowed'
										: 'cursor-pointer'
								}`}
								disabled={completeProfileMutation.isPending}
							>
								{completeProfileMutation.isPending
									? 'Completing...'
									: 'Complete Registration'}
							</motion.button>
						</form>
					</>
				)}
			</motion.div>
		</div>
	);
}
