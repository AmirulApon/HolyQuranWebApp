"use client";

import { useState } from 'react';
import api from '@/lib/axios';


export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            await api.post('/contact', formData);
            setSuccess(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="max-w-4xl mx-auto p-6 mt-10">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden md:flex">
                    <div className="md:w-1/3 p-8 bg-emerald-600 text-white">
                        <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
                        <p className="mb-6 opacity-90">
                            Have questions, suggestions, or feedback? We'd love to hear from you.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                <span>support@quranapp.com</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <svg className="w-6 h-6 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                <span>123 Islamic Center Rd,<br/>Dhaka, Bangladesh</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-2/3 p-8">
                        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Send a Message</h2>
                        
                        {success && (
                            <div className="bg-emerald-100 text-emerald-700 p-4 rounded-lg mb-6">
                                Your message has been sent successfully. We will get back to you soon.
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                                <input 
                                    type="text" 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                                <textarea 
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`w-full py-3 rounded-lg font-bold text-white transition-opacity ${loading ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
