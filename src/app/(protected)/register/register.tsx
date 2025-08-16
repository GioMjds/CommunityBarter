'use client';

import { useState, useId } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Field = 'name' | 'email' | 'password';

export default function RegisterPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [isFocused, setIsFocused] = useState({
		name: false,
		email: false,
		password: false,
	});

	const nameId = useId();
	const emailId = useId();
	const passwordId = useId();

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log('Name:', name);
		console.log('Email:', email);
		console.log('Password:', password);
		alert(`Registering ${name} with email ${email}`);
	};

	const handleFocus = (field: Field) => {
		setIsFocused((prev) => ({ ...prev, [field]: true }));
	};

	const handleBlur = (field: Field) => {
		setIsFocused((prev) => ({ ...prev, [field]: false }));
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

			<div className="text-center mb-8">
				<h1 className="text-3xl font-bold mt-4  text-primary-dark">
					Create Account
				</h1>
				<p className="mt-2 text-dark-muted-foreground">
					Join to our community by filling in your details below
				</p>
			</div>

			<form
				onSubmit={handleSubmit}
				className="p-8 rounded-xl shadow-lg w-full max-w-md bg-dark-muted border border-gray-700"
			>
				<div className="relative mb-6">
					<label
						htmlFor={nameId}
						className={`absolute left-3 transition-all duration-200 z-50 ${
							isFocused.name || name
								? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
								: 'top-3 left-12 text-dark-muted-foreground'
						}`}
					>
						Full Name
					</label>
					<div className="relative">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
						<input
							id={nameId}
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							onFocus={() => handleFocus('name')}
							onBlur={() => handleBlur('name')}
							className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
							required
						/>
					</div>
				</div>

				<div className="relative mb-6">
					<label
						htmlFor={emailId}
						className={`absolute left-3 transition-all duration-200 z-50 ${
							isFocused.email || email
								? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
								: 'top-3 left-12 text-dark-muted-foreground'
						}`}
					>
						Email Address
					</label>
					<div className="relative">
						<User className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
						<input
							id={emailId}
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							onFocus={() => handleFocus('email')}
							onBlur={() => handleBlur('email')}
							className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
							required
						/>
					</div>
				</div>

				<div className="relative mb-8">
					<label
						htmlFor={passwordId}
						className={`absolute left-3 transition-all duration-200 z-50 ${
							isFocused.password || password
								? '-top-3 text-xs px-1 translate-y-1 bg-dark-muted text-primary-dark'
								: 'top-3 left-12 text-dark-muted-foreground'
						}`}
					>
						Password
					</label>
					<div className="relative">
						<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground" />
						<input
							id={passwordId}
							type={showPassword ? 'text' : 'password'}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onFocus={() => handleFocus('password')}
							onBlur={() => handleBlur('password')}
							className="w-full p-3 pl-12 pr-10 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
							required
						/>
						<button
							type="button"
							onClick={() => setShowPassword(!showPassword)}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-muted-foreground"
						>
							{showPassword ? <EyeOff /> : <Eye />}
						</button>
					</div>
				</div>

				<button className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-primary-dark text-dark-foreground">
					Register
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
		</div>
	);
}
