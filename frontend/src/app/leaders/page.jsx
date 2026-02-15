"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { districts } from '@/constants/districts';


export default function LeadersPage() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [district, setDistrict] = useState('');
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchLeaders();
    }, [district]);

    const fetchLeaders = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (district) params.append('district', district);
            
            const res = await api.get(`/leaders?${params.toString()}`);
            setLeaders(res.data);
        } catch (error) {
            console.error("Failed to fetch leaders", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredLeaders = leaders.filter(leader => 
        leader.name.toLowerCase().includes(search.toLowerCase()) ||
        leader.role.toLowerCase().includes(search.toLowerCase())
    );



    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="max-w-6xl mx-auto p-6 mt-6">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Community Leaders</h1>
                    <p className="text-gray-600 dark:text-gray-400">Find leaders and scholars in your district.</p>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select District</label>
                        <select 
                            value={district} 
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        >
                            <option value="">All Districts</option>
                            {districts.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex-1">
                         <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search Name/Role</label>
                         <input 
                            type="text" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name..."
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        />
                    </div>
                </div>

                {/* Leaders Grid */}
                {loading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : filteredLeaders.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLeaders.map(leader => (
                            <div key={leader.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
                                    {leader.image_url ? (
                                        <img src={leader.image_url} alt={leader.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-gray-400">
                                            {leader.name.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{leader.name}</h3>
                                <div className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs px-3 py-1 rounded-full mb-3 uppercase tracking-wide font-medium">
                                    {leader.role || 'Community Leader'}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    {leader.district}
                                </p>
                                
                                <div className="w-full border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                                    <div className="flex flex-col gap-2 text-sm">
                                        {leader.phone && (
                                            <a href={`tel:${leader.phone}`} className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                                                {leader.phone}
                                            </a>
                                        )}
                                        {leader.email && (
                                            <a href={`mailto:${leader.email}`} className="text-gray-600 dark:text-gray-300 hover:text-emerald-600 flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                                                {leader.email}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-500">No leaders found in this district.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
