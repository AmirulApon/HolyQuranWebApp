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
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('sslcommerz');
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/plans');
                setPlans(response.data);
            } catch (error) {
                console.error("Failed to fetch plans", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSubscribe = (planId) => {
        if (!user) {
            router.push('/login');
            return;
        }
        setSelectedPlan(planId);
    };

    const confirmSubscription = async () => {
        setProcessing(selectedPlan);
        try {
            const res = await api.post('/subscribe', {
                plan_id: selectedPlan,
                payment_method: paymentMethod,
                transaction_id: transactionId
            });
            
            if (res.data.url) {
                window.location.href = res.data.url;
                return;
            }

            alert('Subscription successful! You now have full access.');
            setSelectedPlan(null);
            router.push('/dashboard');
        } catch (error) {
            console.error("Subscription failed", error);
            if (error.response?.status !== 401) {
                alert('Subscription failed. Please try again.');
            }
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading plans...</div>;
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
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">৳{plan.price}</span>
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

            {/* Payment Modal */}
            {selectedPlan && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Complete Subscription</h2>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Payment Method
                            </label>
                            <select 
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="sslcommerz">SSLCommerz (Mobile Banking/Cards)</option>
                                <option value="bkash">bKash</option>
                                <option value="nagad">Nagad</option>
                                <option value="rocket">Rocket</option>
                                <option value="credit_card">Credit Card</option>
                                <option value="paypal">PayPal</option>
                                <option value="bank_transfer">Bank Transfer</option>
                            </select>
                        </div>

                        {['bkash', 'nagad', 'rocket'].includes(paymentMethod) && (
                            <div className="bg-emerald-50 dark:bg-emerald-800/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-700 mb-4">
                                <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
                                    <strong>Instruction:</strong> Please send Taka to this {paymentMethod === 'bkash' ? 'bKash' : paymentMethod === 'nagad' ? 'Nagad' : 'Rocket'} number: <strong>01670655682</strong>. Taka received by this number.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Transaction ID
                                    </label>
                                    <input 
                                        type="text" 
                                        value={transactionId}
                                        onChange={(e) => setTransactionId(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="Enter Transaction ID"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 mt-6">
                            <button 
                                onClick={() => setSelectedPlan(null)}
                                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmSubscription}
                                disabled={!!processing || (['bkash', 'nagad', 'rocket'].includes(paymentMethod) && !transactionId)}
                                className="flex-1 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-70"
                            >
                                {processing ? 'Processing...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
