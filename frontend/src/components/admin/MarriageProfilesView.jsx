"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function MarriageProfilesView() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchProfiles();
    }, [page]);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/marriage-profiles?page=${page}`);
            setProfiles(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Failed to fetch profiles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this profile?')) return;
        try {
            await api.delete(`/admin/marriage-profiles/${id}`);
            fetchProfiles();
        } catch (error) {
            alert('Failed to delete profile');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Marriage Profiles</h2>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gender</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading profiles...</td>
                                </tr>
                            ) : profiles.length > 0 ? (
                                profiles.map((profile) => (
                                    <tr key={profile.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{profile.user?.name || 'Unknown User'}</div>
                                            <div className="text-sm text-gray-500">{profile.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 capitalize">{profile.gender}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {profile.city}, {profile.country}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                profile.is_public 
                                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                                {profile.is_public ? 'Public' : 'Private'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={`/marriage/${profile.id}`} 
                                                    target="_blank"
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <EyeIcon className="w-5 h-5" />
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(profile.id)}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                >
                                                    <TrashIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No profiles found.</td>
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
