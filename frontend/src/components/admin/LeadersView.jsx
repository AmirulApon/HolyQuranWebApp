"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { PencilSquareIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { districts } from '@/constants/districts';

export default function LeadersView() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLeader, setEditingLeader] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        district: '',
        phone: '',
        email: '',
        image_url: ''
    });
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchLeaders();
    }, [page]);

    const fetchLeaders = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/admin/leaders?page=${page}`);
            setLeaders(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (error) {
            console.error("Failed to fetch leaders", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this leader?')) return;
        try {
            await api.delete(`/admin/leaders/${id}`);
            fetchLeaders();
        } catch (error) {
            alert('Failed to delete leader');
        }
    };

    const openModal = (leader = null) => {
        if (leader) {
            setEditingLeader(leader);
            setFormData({
                name: leader.name,
                role: leader.role,
                district: leader.district,
                phone: leader.phone || '',
                email: leader.email || '',
                image_url: leader.image_url || ''
            });
        } else {
            setEditingLeader(null);
            setFormData({
                name: '',
                role: '',
                district: '',
                phone: '',
                email: '',
                image_url: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);
        try {
            if (editingLeader) {
                await api.put(`/admin/leaders/${editingLeader.id}`, formData);
            } else {
                await api.post('/admin/leaders', formData);
            }
            setIsModalOpen(false);
            fetchLeaders();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save leader');
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Community Leaders</h2>
                <button 
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Leader
                </button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">District</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">Loading leaders...</td>
                                </tr>
                            ) : leaders.length > 0 ? (
                                leaders.map((leader) => (
                                    <tr key={leader.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 dark:text-white">{leader.name}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{leader.role}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{leader.district}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            <div>{leader.phone}</div>
                                            <div className="text-xs">{leader.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button 
                                                    onClick={() => openModal(leader)}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                >
                                                    <PencilSquareIcon className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(leader.id)}
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
                                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No leaders found.</td>
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

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl max-w-lg w-full p-6 relative">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                        
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                            {editingLeader ? 'Edit Leader' : 'Add New Leader'}
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.role}
                                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">District</label>
                                    <select 
                                        required
                                        value={formData.district}
                                        onChange={(e) => setFormData({...formData, district: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    >
                                        <option value="">Select District</option>
                                        {districts.map(d => (
                                            <option key={d} value={d}>{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                    <input 
                                        type="text" 
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                                <input 
                                    type="url" 
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            
                            <div className="flex justify-end gap-3 mt-6">
                                <button 
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={submitLoading}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
                                >
                                    {submitLoading ? 'Saving...' : 'Save Leader'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
