'use client';

import { useState, useId } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, Shield } from 'lucide-react';
import Image from 'next/image';

type Step = 'email' | 'otp' | 'otpSuccess' | 'password' | 'success';
type Field = 'email' | 'otp' | 'password' | 'confirmPassword';

export default function ForgotPasswordPage() {
	const [currentStep, setCurrentStep] = useState<Step>('email');
	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isFocused, setIsFocused] = useState({
		email: false,
		otp: false,
		password: false,
		confirmPassword: false,
	});
	const [isLoading, setIsLoading] = useState(false);
	const [slideDirection, setSlideDirection] = useState<'forward' | 'backward'>('forward');

	const emailId = useId();
	const otpId = useId();
	const passwordId = useId();
	const confirmPasswordId = useId();

	const handleFocus = (field: Field) => {
		setIsFocused((prev) => ({ ...prev, [field]: true }));
	};

	const handleBlur = (field: Field) => {
		setIsFocused((prev) => ({ ...prev, [field]: false }));
	};

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	const handleEmailSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!email) return;

		setSlideDirection('forward');
		setIsLoading(true);
		// Simulate API call
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsLoading(false);
		setCurrentStep('otp');
	};

	const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!otp || otp.length !== 6) return;

		setSlideDirection('forward');
		setIsLoading(true);
		// Simulate OTP verification
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsLoading(false);
		
		// Show success message first
		setCurrentStep('otpSuccess');
		// Then transition to password step after 2 seconds
		setTimeout(() => {
			setCurrentStep('password');
		}, 2000);
	};

	const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!password || !confirmPassword || password !== confirmPassword) return;

		setSlideDirection('forward');
		setIsLoading(true);
		// Simulate password reset
		await new Promise(resolve => setTimeout(resolve, 1000));
		setIsLoading(false);
		
		// Show success step instead of alert
		setCurrentStep('success');
	};

	const goBack = () => {
		if (currentStep === 'otp') {
			setSlideDirection('backward');
			setCurrentStep('email');
			setOtp('');
		} else if (currentStep === 'password') {
			setSlideDirection('backward');
			setCurrentStep('otp');
			setPassword('');
			setConfirmPassword('');
		}
	};

	const resetForm = () => {
		setCurrentStep('email');
		setEmail('');
		setOtp('');
		setPassword('');
		setConfirmPassword('');
	};

	const renderStepIndicator = () => (
		<div className="flex items-center justify-center mb-6">
			<div className="flex items-center space-x-2">
				<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ease-in-out transform ${
					currentStep === 'email' || currentStep === 'otp' || currentStep === 'password' || currentStep === 'success' ? 'bg-[var(--color-primary-dark)] text-white scale-110' : 'bg-[#3B3B4B] text-[var(--color-dark-muted-foreground)] scale-100'
				}`}>
					1
				</div>
				<div className={`w-12 h-0.5 transition-all duration-500 ease-in-out ${
					currentStep === 'otp' || currentStep === 'password' || currentStep === 'success' ? 'bg-[var(--color-primary-dark)]' : 'bg-[#3B3B4B]'
				}`}></div>
				<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ease-in-out transform ${
					currentStep === 'otp' || currentStep === 'otpSuccess' || currentStep === 'password' || currentStep === 'success' ? 'bg-[var(--color-primary-dark)] text-white scale-110' : 'bg-[#3B3B4B] text-[var(--color-dark-muted-foreground)] scale-100'
				}`}>
					2
				</div>
				<div className={`w-12 h-0.5 transition-all duration-500 ease-in-out ${
					currentStep === 'password' || currentStep === 'success' ? 'bg-[var(--color-primary-dark)]' : 'bg-[#3B3B4B]'
				}`}></div>
				<div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-500 ease-in-out transform ${
					currentStep === 'password' || currentStep === 'success' ? 'bg-[var(--color-primary-dark)] text-white scale-110' : 'bg-[#3B3B4B] text-[var(--color-dark-muted-foreground)] scale-100'
				}`}>
					3
				</div>
			</div>
		</div>
	);

	const renderEmailStep = () => (
		<form onSubmit={handleEmailSubmit} className="space-y-6">
			<div className="relative">
				<label
					htmlFor={emailId}
					className={`absolute left-3 pointer-events-none transition-all duration-300 ${
						isFocused.email || email
							? '-top-2.5 text-xs px-2 bg-[var(--color-dark-muted)] text-[#3B82F6] rounded z-10'
							: 'top-4 left-12 text-[var(--color-dark-muted-foreground)]'
					}`}
				>
					Email Address
				</label>
				<div className="relative">
					<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted-foreground)] w-5 h-5 z-10" />
					<input
						id={emailId}
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						onFocus={() => handleFocus('email')}
						onBlur={() => handleBlur('email')}
						className="w-full pl-12 pr-4 py-4 bg-transparent border border-[#3B3B4B] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300"
						required
					/>
				</div>
			</div>

			<button
				type="submit"
				disabled={isLoading}
				className="w-full bg-[var(--color-primary-dark)] hover:bg-[#E65C00] disabled:bg-[#666] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
			>
				{isLoading ? (
					<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
				) : (
					<>
						Send OTP
						<ArrowRight className="ml-2 w-5 h-5" />
					</>
				)}
			</button>
		</form>
	);

	const renderOtpStep = () => (
		<form onSubmit={handleOtpSubmit} className="space-y-6">
			<div className="text-center mb-6">
				<p className="text-[var(--color-dark-muted-foreground)] mb-2">
					We've sent a 6-digit OTP to:
				</p>
				<p className="text-[var(--color-primary-dark)] font-semibold">{email}</p>
				
				{/* Testing OTP - Remove in production */}
				<div className="mt-4 p-3 bg-[#1e1e2f] border border-[#3B82F6] rounded-lg">
					<p className="text-[var(--color-dark-muted-foreground)] text-sm mb-2">
						🧪 Testing Mode - Use this OTP:
					</p>
					<p className="text-[#3B82F6] font-mono text-xl font-bold tracking-widest">
						123456
					</p>
				</div>
			</div>

			<div className="relative">
				<label
					htmlFor={otpId}
					className={`absolute left-3 pointer-events-none transition-all duration-300 ${
						isFocused.otp || otp
							? '-top-2.5 text-xs px-2 bg-[var(--color-dark-muted)] text-[#3B82F6] rounded z-10'
							: 'top-4 left-12 text-[var(--color-dark-muted-foreground)]'
					}`}
				>
					Enter OTP
				</label>
				<div className="relative">
					<input
						id={otpId}
						type="text"
						value={otp}
						onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
						onFocus={() => handleFocus('otp')}
						onBlur={() => handleBlur('otp')}
						className="w-full px-4 py-4 bg-transparent border border-[#3B82F6] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300 text-center text-lg tracking-widest"
						maxLength={6}
						required
					/>
				</div>
			</div>

			<div className="flex space-x-3">
				<button
					type="button"
					onClick={goBack}
					className="flex-1 bg-[#3B3B4B] hover:bg-[#4B4B5B] text-[var(--color-dark-foreground)] font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
				>
					<ArrowLeft className="mr-2 w-5 h-5" />
					Back
				</button>
				<button
					type="submit"
					disabled={isLoading || otp.length !== 6}
					className="flex-1 bg-[var(--color-primary-dark)] hover:bg-[#E65C00] disabled:bg-[#666] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
				>
					{isLoading ? (
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					) : (
						<>
							Verify OTP
							<ArrowRight className="ml-2 w-5 h-5" />
						</>
					)}
				</button>
			</div>
		</form>
	);

	const renderOtpSuccessStep = () => (
		<div className="text-center space-y-6">
			{/* Success Icon */}
			<div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6 animate-pulse">
				<svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
				</svg>
			</div>

			{/* Success Message */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold text-green-400 animate-bounce">
					OTP Verified!
				</h2>
				<p className="text-[var(--color-dark-muted-foreground)]">
					Redirecting to password reset...
				</p>
			</div>

			{/* Loading Dots */}
			<div className="flex justify-center space-x-2">
				<div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
				<div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
				<div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
			</div>
		</div>
	);

	const renderPasswordStep = () => (
		<form onSubmit={handlePasswordSubmit} className="space-y-6">
			<div className="text-center mb-6">
				<p className="text-[var(--color-dark-muted-foreground)] mb-2">
					OTP verified successfully!
				</p>
				<p className="text-[var(--color-primary-dark)] font-semibold">
					Now set your new password
				</p>
			</div>

			<div className="relative">
				<label
					htmlFor={passwordId}
					className={`absolute left-3 pointer-events-none transition-all duration-300 ${
						isFocused.password || password
							? '-top-2.5 text-xs px-2 bg-[var(--color-dark-muted)] text-[#3B82F6] rounded z-10'
							: 'top-4 left-12 text-[var(--color-dark-muted-foreground)]'
					}`}
				>
					New Password
				</label>
				<div className="relative">
					<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted-foreground)] w-5 h-5 z-10" />
					<input
						id={passwordId}
						type={showPassword ? 'text' : 'password'}
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						onFocus={() => handleFocus('password')}
						onBlur={() => handleBlur('password')}
						className="w-full pl-12 pr-12 py-4 bg-transparent border border-[#3B3B4B] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300"
						required
					/>
					<button
						type="button"
						onClick={togglePasswordVisibility}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted-foreground)] hover:text-[var(--color-dark-foreground)] transition-colors duration-200 z-10"
					>
						{showPassword ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>

			<div className="relative">
				<label
					htmlFor={confirmPasswordId}
					className={`absolute left-3 pointer-events-none transition-all duration-300 ${
						isFocused.confirmPassword || confirmPassword
							? '-top-2.5 text-xs px-2 bg-[var(--color-dark-muted)] text-[#3B82F6] rounded z-10'
							: 'top-4 left-12 text-[var(--color-dark-muted-foreground)]'
					}`}
				>
					Confirm New Password
				</label>
				<div className="relative">
					<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted-foreground)] w-5 h-5 z-10" />
					<input
						id={confirmPasswordId}
						type={showConfirmPassword ? 'text' : 'password'}
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						onFocus={() => handleFocus('confirmPassword')}
						onBlur={() => handleBlur('confirmPassword')}
						className="w-full pl-12 pr-12 py-4 bg-transparent border border-[#3B3B4B] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all duration-300"
						required
					/>
					<button
						type="button"
						onClick={toggleConfirmPasswordVisibility}
						className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-dark-muted-foreground)] hover:text-[var(--color-dark-foreground)] transition-colors duration-200 z-10"
					>
						{showConfirmPassword ? (
							<EyeOff className="w-5 h-5" />
						) : (
							<Eye className="w-5 h-5" />
						)}
					</button>
				</div>
			</div>

			{confirmPassword && password !== confirmPassword && (
				<div className="text-red-400 text-sm text-center">
					Passwords do not match
				</div>
			)}

			<div className="flex space-x-3">
				<button
					type="button"
					onClick={goBack}
					className="flex-1 bg-[#3B3B4B] hover:bg-[#4B4B5B] text-[var(--color-dark-foreground)] font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
				>
					<ArrowLeft className="mr-2 w-5 h-5" />
					Back
				</button>
				<button
					type="submit"
					disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
					className="flex-1 bg-[var(--color-primary-dark)] hover:bg-[#E65C00] disabled:bg-[#666] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
				>
					{isLoading ? (
						<div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
					) : (
						'Reset Password'
					)}
				</button>
			</div>
		</form>
	);

	const renderSuccessStep = () => (
		<div className="text-center space-y-6">
			{/* Success Icon */}
			<div className="mx-auto w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-6">
				<svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
				</svg>
			</div>

			{/* Success Message */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold text-green-400">
					Password Reset Complete!
				</h2>
				
			</div>

			{/* Action Buttons */}
			<div className="flex space-x-3 pt-4">
				<button
					type="button"
					onClick={resetForm}
					className="flex-1 bg-[#3B3B4B] hover:bg-[#4B4B5B] text-[var(--color-dark-foreground)] font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
				>
					Back
				</button>
				<a
					href="/login"
					className="flex-1 bg-[var(--color-primary-dark)] hover:bg-[#E65C00] text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center"
				>
					Go to Login
				</a>
			</div>
		</div>
	);

	const getStepTitle = () => {
		switch (currentStep) {
			case 'email':
				return 'Forgot Password';
			case 'otp':
				return 'Verify OTP';
			case 'otpSuccess':
				return 'OTP Verified!';
			case 'password':
				return 'Set New Password';
			case 'success':
				return 'Password Reset Success!';
			default:
				return 'Forgot Password';
		}
	};

	const getStepDescription = () => {
		switch (currentStep) {
			case 'email':
				return 'Enter your email address to receive a verification code';
			case 'otp':
				return 'Enter the 6-digit code sent to your email';
			case 'otpSuccess':
				return 'OTP verification successful!';
			case 'password':
				return 'Create a new password for your account';
			case 'success':
				return 'Your password has been successfully reset';
			default:
				return 'Enter your email address to receive a verification code';
		}
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
					<h1 className="text-4xl font-bold text-[var(--color-primary-dark)] mb-2 transition-all duration-500 ease-in-out transform">
						{getStepTitle()}
					</h1>
					<p className="text-[var(--color-dark-muted-foreground)] text-lg transition-all duration-500 ease-in-out">
						{getStepDescription()}
					</p>
				</div>

				{/* Step Indicator */}
				{renderStepIndicator()}

				{/* Form Container */}
				<div className="bg-[var(--color-dark-muted)] rounded-2xl shadow-2xl border border-[#3B3B4B] p-8 relative overflow-hidden">
					<div className={`transition-all duration-500 ease-in-out transform ${
						currentStep === 'email' ? 'translate-x-0 opacity-100' : slideDirection === 'forward' ? '-translate-x-full opacity-0 absolute inset-0' : 'translate-x-full opacity-0 absolute inset-0'
					}`}>
						{renderEmailStep()}
					</div>
					<div className={`transition-all duration-500 ease-in-out transform ${
						currentStep === 'otp' ? 'translate-x-0 opacity-100' : slideDirection === 'forward' ? '-translate-x-full opacity-0 absolute inset-0' : 'translate-x-full opacity-0 absolute inset-0'
					}`}>
						{renderOtpStep()}
					</div>
					<div className={`transition-all duration-500 ease-in-out transform ${
						currentStep === 'otpSuccess' ? 'translate-x-0 opacity-100' : slideDirection === 'forward' ? '-translate-x-full opacity-0 absolute inset-0' : 'translate-x-full opacity-0 absolute inset-0'
					}`}>
						{renderOtpSuccessStep()}
					</div>
					<div className={`transition-all duration-500 ease-in-out transform ${
						currentStep === 'password' ? 'translate-x-0 opacity-100' : slideDirection === 'forward' ? '-translate-x-full opacity-0 absolute inset-0' : 'translate-x-full opacity-0 absolute inset-0'
					}`}>
						{renderPasswordStep()}
					</div>
				</div>

				{/* Success Message - Displayed outside form */}
				<div className={`mt-6 bg-[var(--color-dark-muted)] rounded-2xl shadow-2xl border border-green-500 p-8 text-center transition-all duration-700 ease-in-out transform ${
					currentStep === 'success' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
				}`}>
					{renderSuccessStep()}
				</div>		
                
				
			</div>
		</div>
	);
}