"use client";

import { useState } from 'react';
import api from '@/lib/axios';


export default function DonationPage() {
    const [amount, setAmount] = useState('');
    const [currency, setCurrency] = useState('BDT');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('credit_card');
    const [transactionId, setTransactionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const res = await api.post('/donate', {
                amount,
                currency,
                donor_name: name,
                donor_email: email,
                message,
                payment_method: paymentMethod,
                transaction_id: transactionId,
            });
            if (res.data.url) {
                window.location.href = res.data.url;
                return;
            }
            setSuccess(true);
            setAmount('');
            setName('');
            setEmail('');
            setMessage('');
            setTransactionId('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to process donation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="max-w-4xl mx-auto p-6 mt-10">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden md:flex">
                    <div className="md:w-1/2 p-8 bg-emerald-600 text-white">
                        <h1 className="text-3xl font-bold mb-4">Support Our Mission</h1>
                        <p className="mb-6 opacity-90">
                            Your generous donation helps us maintain and expand the Quran application, keeping it free and accessible to everyone.
                        </p>
                        <h3 className="text-xl font-semibold mb-2">Why Donate?</h3>
                        <ul className="list-disc list-inside space-y-2 opacity-90">
                            <li>Server and maintenance costs</li>
                            <li>Developing new features</li>
                            <li>Supporting educational content</li>
                            <li>Ad-free experience for all</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Make a Donation</h2>
                        
                        {success && (
                            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-lg mb-6">
                                Thank you for your donation! May Allah reward you.
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Currency
                                    </label>
                                    <select 
                                        value={currency}
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    >
                                        <option value="BDT">BDT (Taka)</option>
                                        <option value="USD">USD (Dollar)</option>
                                        <option value="EUR">EUR (Euro)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Donation Amount
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                            {currency === 'BDT' ? '৳' : currency === 'EUR' ? '€' : '$'}
                                        </span>
                                        <input 
                                            type="number" 
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="w-full pl-8 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                            placeholder="10.00"
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name (Optional)
                                    </label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email (Optional)
                                    </label>
                                    <input 
                                        type="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <div>
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
                                <div className="bg-emerald-50 dark:bg-emerald-800/20 p-4 rounded-lg border border-emerald-100 dark:border-emerald-700">
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
                                            required={['bkash', 'nagad', 'rocket'].includes(paymentMethod)}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Message (Optional)
                                </label>
                                <textarea 
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    placeholder="Leave a message..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-bold text-white transition-opacity ${loading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                {loading ? 'Processing...' : 'Donate Now'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
