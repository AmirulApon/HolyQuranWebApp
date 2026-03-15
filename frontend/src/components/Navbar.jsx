"use client";

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex-shrink-0 flex items-center text-emerald-600 font-bold font-serif text-xl">
                            The Holy Quran
                        </Link>
                    </div>

                    <div className="hidden sm:flex sm:items-center sm:ml-6 space-x-4">
                        <Link href="/" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                            Home
                        </Link>

                        <Link href="/donation" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                            Donate
                        </Link>
                        <Link href="/contact" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium">
                            Contact
                        </Link>
                        {user?.role === 'admin' && (
                            <Link href="/admin" className="text-emerald-600 dark:text-emerald-400 font-bold hover:text-emerald-700">
                                Admin Panel
                            </Link>
                        )}
                        {user ? (
                            <>
                                <Link href="/dashboard" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Dashboard
                                </Link>
                                <span className="text-gray-400 text-sm">|</span>
                                <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                                    {user.name}
                                </span>
                                <button 
                                    onClick={logout}
                                    className="text-red-600 hover:text-red-700 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 px-3 py-2 rounded-md text-sm font-medium">
                                    Login
                                </Link>
                                <Link href="/register" className="bg-emerald-600 text-white hover:bg-emerald-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Register
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
