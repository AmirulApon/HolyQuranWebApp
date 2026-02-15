"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import Link from 'next/link';

export default function MarriagePage() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        gender: '',
        city: '',
        country: ''
    });

    useEffect(() => {
        fetchProfiles();
    }, [filters]);

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.gender) params.append('gender', filters.gender);
            if (filters.city) params.append('city', filters.city);
            if (filters.country) params.append('country', filters.country);

            const res = await api.get(`/marriage-profiles?${params.toString()}`);
            setProfiles(res.data.data || res.data); // Handle pagination or direct array
        } catch (error) {
            console.error("Failed to fetch profiles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="max-w-6xl mx-auto p-6 mt-6">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Matrimonial Services</h1>
                        <p className="text-gray-600 dark:text-gray-400">Find your righteous partner according to Sunnah.</p>
                    </div>
                    <Link 
                        href="/marriage/create" 
                        className="mt-4 md:mt-0 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        Create My Profile
                    </Link>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm mb-8 border border-gray-100 dark:border-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                            <select 
                                name="gender" 
                                value={filters.gender} 
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            >
                                <option value="">All</option>
                                <option value="male">Groom (Male)</option>
                                <option value="female">Bride (Female)</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                            <input 
                                type="text" 
                                name="city"
                                value={filters.city}
                                onChange={handleFilterChange}
                                placeholder="e.g. Dhaka"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                            <input 
                                type="text" 
                                name="country"
                                value={filters.country}
                                onChange={handleFilterChange}
                                placeholder="e.g. Bangladesh"
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                    </div>
                </div>

                {/* Profiles Grid */}
                {loading ? (
                    <div className="text-center py-12">Loading profiles...</div>
                ) : profiles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {profiles.map(profile => (
                            <div key={profile.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                                                {profile.gender === 'male' ? 'Brother' : 'Sister'}
                                            </h3>
                                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                                                {calculateAge(profile.date_of_birth)} years old
                                            </p>
                                        </div>
                                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded text-xs uppercase">
                                            {profile.marital_status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4 text-sm text-gray-600 dark:text-gray-300">
                                        <p className="flex items-center gap-2">
                                            <span className="font-semibold w-20">Profession:</span> {profile.profession || 'N/A'}
                                        </p>
                                        <p className="flex items-center gap-2">
                                            <span className="font-semibold w-20">Location:</span> {profile.city}, {profile.country}
                                        </p>
                                    </div>
                                    
                                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                                        {profile.bio}
                                    </p>

                                    <Link 
                                        href={`/marriage/${profile.id}`}
                                        className="block w-full text-center py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors font-medium"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                        <p className="text-gray-500">No profiles found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
