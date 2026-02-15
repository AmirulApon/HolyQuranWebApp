"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/axios';
import Link from 'next/link';

export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/login', { email, password });
            login(response.data.access_token, response.data.user);
        } catch (err) {
             if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold font-serif mb-2">Welcome Back</h1>
                    <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link href="/register" className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">
                        Create Account
                    </Link>
                </div>
                
                <div className="mt-4 text-center">
                     <Link href="/" className="text-gray-400 hover:text-gray-600 text-sm">
                        &larr; Back to Home
                     </Link>
                </div>
            </div>
        </main>
    );
}
