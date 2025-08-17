'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';

export default function VerifyPage() {
	const [otp, setOtp] = useState(Array(6).fill(''));
	const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert('OTP entered: ' + otp.join(''));
	};

	const handleFocus = (index: number) => {
		const input = inputsRef.current[index];
		if (input)
			input.setSelectionRange(input.value.length, input.value.length);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-dark-background px-4">
			{/* Logo */}
			<div className="mb-4">
				<Image
					src="/Logo.png"
					alt="Community Barter Logo"
					width={80}
					height={80}
					className="bg-white rounded-full px-3 py-2"
				/>
			</div>

			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold mt-4 text-primary-dark">
					Verify OTP
				</h1>
				<p className="mt-2 text-dark-muted-foreground">
					We sent a 6-digit code to your email
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="p-8 rounded-xl shadow-lg w-full max-w-md bg-dark-muted border border-gray-700"
			>
				<div className="text-center mb-8">
					<p className="mt-2 text-dark-muted-foreground">
						We sent a 6-digit OTP to:
					</p>
					<p className=" font-bold mt-4 text-primary-dark">
						adasdad@gmail.com
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
							className="w-12 h-12 text-center  focus:ring-2 focus:ring-primary-dark text-dark-foreground rounded-lg border border-muted-foreground bg-dark-muted focus:outline-none text-lg"
						/>
					))}
				</div>

				<button className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-primary-dark text-dark-foreground">
					Verify
				</button>

				<div className="mt-4 text-center text-sm text-dark-muted-foreground">
					Didn't receive the code?{' '}
					<button
						type="button"
						className="text-primary-dark underline"
					>
						Resend OTP
					</button>
				</div>
			</form>
		</div>
	);
}
