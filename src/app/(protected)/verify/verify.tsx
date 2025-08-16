'use client';

import { useState, useRef } from 'react';

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
		<div className="flex items-center justify-center min-h-screen bg-dark-background">
			<form
				onSubmit={handleSubmit}
				className="p-8 rounded-xl shadow-lg w-full max-w-md mx-4 bg-dark-muted text-dark-foreground"
			>
				<h1 className="text-2xl font-bold text-center mb-4">
					Enter OTP
				</h1>
				<p className="text-center text-dark-muted-foreground mb-6">
					We sent a 6-digit code to your email
				</p>

				<div className="flex justify-between mb-6">
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
							className="w-12 h-12 text-center rounded-lg border border-[#3B3B4B] bg-dark-muted focus:outline-none text-lg"
						/>
					))}
				</div>

				<button
					type="submit"
					className="w-full py-3 px-4 rounded-lg font-medium bg-primary-dark text-dark-foreground"
				>
					Verify
				</button>
			</form>
		</div>
	);
}
