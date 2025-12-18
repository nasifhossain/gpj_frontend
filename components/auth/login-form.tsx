'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/lib/api/auth';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authService.login({ email, password });

            // Store token securely (omitted for now as per prompt instructions to "only do this for now")
            // but let's at least log it or pretend to store it so the logic is complete
            if (response.token) {
                // localStorage.setItem('token', response.token); 
            }

            if (response.role === 'ADMIN') {
                router.push('/admin');
            } else {
                setError('Unauthorized: Only admins can access this area.');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md p-8 bg-white rounded-lg border border-gray-100 shadow-sm">
            <div>
                <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600">
                    Or <a href="#" className="font-medium text-blue-600 hover:text-blue-500">contact support</a> if you have issues
                </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4 rounded-md shadow-sm">
                    <Input
                        id="email-address"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        label="Email address"
                        placeholder="admin@test.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        label="Password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                        {error}
                    </div>
                )}

                <div>
                    <Button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all transform hover:scale-[1.02]"
                        isLoading={isLoading}
                    >
                        Sign in
                    </Button>
                </div>
            </form>
        </div>
    );
}
