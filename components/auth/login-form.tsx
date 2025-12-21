'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/lib/api/auth';

export function LoginForm() {
    const router = useRouter();
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAuthSuccess = (response: any) => {
        if (response.token) {
            // Store token in cookie with 7 day expiry
            Cookies.set('token', response.token, { expires: 7, secure: true, sameSite: 'strict' });

            // Store user profile in localStorage
            localStorage.setItem('user_profile', JSON.stringify({
                id: response.id,
                name: response.name,
                email: response.email,
                role: response.role
            }));

            if (!isRegisterMode) {
                toast.success('Successfully logged in!');
            }
        }

        if (response.role === 'ADMIN') {
            router.push('/admin');
        } else if (response.role === 'CLIENT') {
            router.push('/dashboard');
        } else {
            toast.error('Unauthorized: Invalid user role.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (isRegisterMode) {
                // Register the user first
                await authService.register({ name, email, password });
                toast.success('Registration successful! Logging you in...');

                // Then automatically login to get the token
                const loginResponse = await authService.login({ email, password });
                handleAuthSuccess(loginResponse);
            } else {
                const response = await authService.login({ email, password });
                handleAuthSuccess(response);
            }
        } catch (err: any) {
            const errorMessage = isRegisterMode
                ? err.message || 'Registration failed. Please try again.'
                : err.message || 'Login failed. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setIsRegisterMode(!isRegisterMode);
        setName('');
        setEmail('');
        setPassword('');
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-2xl border border-gray-100 shadow-xl backdrop-blur-sm">
            <div>
                <h2 className="mt-2 text-3xl font-bold text-center text-gray-900 tracking-tight">
                    {isRegisterMode ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="mt-2 text-sm text-center text-gray-500">
                    {isRegisterMode
                        ? 'Sign up to get started with GPJ Input Assistant'
                        : 'Sign in to your account to continue'}
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    {isRegisterMode && (
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            label="Full name"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    )}
                    <Input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        label="Email address"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20"
                    />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                        required
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20"
                    />
                </div>

                <div>
                    <Button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:translate-y-[-1px] active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed"
                        isLoading={isLoading}
                    >
                        {isRegisterMode ? 'Create account' : 'Sign in'}
                    </Button>
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        {isRegisterMode ? 'Already have an account?' : "Don't have an account?"}{' '}
                        <button
                            type="button"
                            onClick={toggleMode}
                            className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                        >
                            {isRegisterMode ? 'Sign in' : 'Create account'}
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
