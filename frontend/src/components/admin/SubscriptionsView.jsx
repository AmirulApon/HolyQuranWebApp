"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function SubscriptionsView() {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchSubscriptions();
    }, [page]);

    const fetchSubscriptions = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/subscriptions?page=${page}`);
            setSubscriptions(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Failed to fetch subscriptions", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Subscriptions</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Plan</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Date</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading subscriptions...</td>
                                </tr>
                            ) : subscriptions.length > 0 ? (
                                subscriptions.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{sub.user?.name || 'Unknown User'}</div>
                                            <div className="text-sm text-gray-500">{sub.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 capitalize">{sub.plan_name || 'Standard'}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">
                                            ${Number(sub.amount || 0).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(sub.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                sub.status === 'active' 
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No subscriptions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                 {/* Pagination */}
                 {totalPages > 1 && (
                    <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex justify-center gap-2">
                        <button 
                            disabled={page === 1}
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-3 py-1 self-center text-sm text-gray-600">
                            Page {page} of {totalPages}
                        </span>
                        <button 
                            disabled={page === totalPages}
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
