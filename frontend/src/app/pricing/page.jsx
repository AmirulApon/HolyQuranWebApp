"use client";

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function PricingPage() {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const router = useRouter();
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                // Ensure auth before fetching if plans are protected, though usually public.
                // Our API route for plans is protected by auth:api in routes/api.php
                // ideally plans should be public, but let's stick to current backend logic
                const response = await api.get('/plans');
                setPlans(response.data);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPlans();
        } else {
             // If not logged in, we might want to show plans anyway?
             // But backend requires auth. For now, let's redirect or show login prompt.
             // Better user experience: Show static plans if not logged in, but let's fetch for accuracy.
        }
    }, [user]);

    const handleSubscribe = async (planId) => {
        if (!user) {
            router.push('/login');
            return;
        }

        setProcessing(planId);
        try {
            await api.post('/subscribe', {
                plan_id: planId,
                payment_method: 'mock_card'
            });
            alert('Subscription successful! You now have full access.');
            router.push('/dashboard');
        } catch (error) {
            console.error("Subscription failed", error);
            alert('Subscription failed. Please try again.');
        } finally {
            setProcessing(null);
        }
    };

    if (loading && user) {
        return <div className="min-h-screen flex items-center justify-center">Loading plans...</div>;
    }

    if (!user) {
        return (
             <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
                <h1 className="text-3xl font-bold mb-4">Pricing Plans</h1>
                <p className="mb-6 text-gray-600">Please log in to view and subscribe to plans.</p>
                <button 
                    onClick={() => router.push('/login')}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                >
                    Log In
                </button>
             </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold font-serif mb-4 text-gray-900 dark:text-white">Unlock Full Knowledge</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400">Choose the plan that fits your journey.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div key={plan.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 flex flex-col hover:border-emerald-500 transition-colors relative overflow-hidden">
                            {plan.id === 'yearly' && (
                                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-3 py-1 rounded-bl-lg">
                                    Best Value
                                </div>
                            )}
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline mb-6">
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">${plan.price}</span>
                                <span className="text-base font-medium text-gray-500 ml-2">/{plan.period}</span>
                            </div>
                            
                            <ul className="mb-8 space-y-4 flex-1">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center text-gray-600 dark:text-gray-300">
                                        <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button
                                onClick={() => handleSubscribe(plan.id)}
                                disabled={!!processing}
                                className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-colors ${
                                    plan.id === 'lifetime' 
                                        ? 'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600' 
                                        : 'bg-emerald-600 hover:bg-emerald-700'
                                } disabled:opacity-70`}
                            >
                                {processing === plan.id ? 'Processing...' : 'Subscribe Now'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
