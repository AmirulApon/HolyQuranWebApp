"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';

export default function Dashboard() {
    const { user, logout, loading } = useAuth();
    const router = useRouter();

    const [progress, setProgress] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        
        if (user) {
            api.get('/reading-progress')
                .then(res => setProgress(res.data))
                .catch(err => console.error(err));
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div>
                        <h1 className="text-2xl font-bold font-serif">My Dashboard</h1>
                        <p className="text-gray-500 dark:text-gray-400">Welcome back, {user.name}!</p>
                    </div>
                    <div className="flex gap-4">
                        <Link href="/" className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors">
                            Read Quran
                        </Link>
                        <button 
                            onClick={logout}
                            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm font-medium transition-colors border border-red-100"
                        >
                            Logout
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Profile Section */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Profile Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Name</label>
                                <p className="text-gray-800 dark:text-gray-200">{user.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Email</label>
                                <p className="text-gray-800 dark:text-gray-200">{user.email}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 uppercase font-semibold">Joined</label>
                                <p className="text-gray-800 dark:text-gray-200">{new Date(user.created_at).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Reading Stats - Placeholder */}
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-semibold mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">Reading Progress</h2>
                        <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                            {progress ? (
                                <div className="w-full">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quran Completion</span>
                                        <span className="text-sm font-medium text-emerald-600">{progress.percentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
                                        <div 
                                            className="bg-emerald-600 h-2.5 rounded-full transition-all duration-1000" 
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4 text-center">
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{progress.total_read}</div>
                                            <div className="text-xs text-gray-500 uppercase">Ayahs Read</div>
                                        </div>
                                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700 shadow-sm">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{progress.total_ayahs - progress.total_read}</div>
                                            <div className="text-xs text-gray-500 uppercase">Remaining</div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm">Loading progress...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
