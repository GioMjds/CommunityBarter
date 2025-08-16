'use client';

import { useState, useId } from 'react';
import { User, Lock } from 'lucide-react';
import Link from 'next/link';

type Field = 'name' | 'email' | 'password';

export default function RegisterPage() {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
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
		<div className="flex items-center justify-center min-h-screen bg-dark-background">
			<form
				onSubmit={handleSubmit}
				className="p-8 rounded-xl shadow-lg w-full max-w-md mx-4 bg-dark-muted"
			>
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold mt-4 text-dark-foreground">
						Create Account
					</h1>
					<p className="mt-2 text-dark-muted-foreground">
						Enter your details to register
					</p>
				</div>

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
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onFocus={() => handleFocus('password')}
							onBlur={() => handleBlur('password')}
							className="w-full p-3 pl-12 rounded-lg focus:outline-none border border-[#3B3B4B] bg-dark-muted text-dark-foreground"
							required
						/>
					</div>
				</div>

				<button className="w-full py-3 px-4 rounded-lg font-medium transition-all bg-primary-dark text-dark-foreground">
					Register
				</button>

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
