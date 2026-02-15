"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { use } from 'react';

export default function ProfileDetailsPage({ params }) {
    const { id } = use(params);
    const { user } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/marriage-profiles/${id}`);
                setProfile(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch profile');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id]);

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const ageDifMs = Date.now() - birthDate.getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (error || !profile) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <Navbar />
                <div className="max-w-3xl mx-auto p-6 mt-10 text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Profile not found'}</p>
                    <button onClick={() => router.back()} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded-lg">Go Back</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="max-w-4xl mx-auto p-6 mt-10">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
                    <div className="bg-emerald-600 h-32 w-full"></div>
                    <div className="px-8 pb-8">
                        <div className="relative -top-12 mb-[-30px]">
                            <div className="inline-block bg-white dark:bg-gray-900 p-2 rounded-full shadow-md">
                                {profile.image ? (
                                    <img 
                                        src={`http://127.0.0.1:8000/storage/${profile.image}`} 
                                        alt="Profile" 
                                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 dark:border-emerald-900"
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.style.display = 'none';
                                            e.target.nextSibling.style.display = 'flex';
                                        }}
                                    />
                                ) : null}
                                <div className={`w-24 h-24 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-3xl font-bold text-emerald-600 dark:text-emerald-400 capitalize ${profile.image ? 'hidden' : ''}`}>
                                    {profile.gender[0]}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start pt-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white capitalize mb-1">
                                    {profile.gender === 'male' ? 'Brother' : 'Sister'} from {profile.city}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 text-lg">
                                    {calculateAge(profile.date_of_birth)} years old • {profile.marital_status}
                                </p>
                            </div>
                            <button className="mt-4 md:mt-0 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                                Contact Profile
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                    Personal Details
                                </h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Profession</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{profile.profession || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Location</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{profile.city}, {profile.country}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Marital Status</span>
                                        <span className="font-medium text-gray-900 dark:text-white capitalize">{profile.marital_status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Profile ID</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{profile.id}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-gray-700 pb-2">
                                    About
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                    {profile.bio}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
