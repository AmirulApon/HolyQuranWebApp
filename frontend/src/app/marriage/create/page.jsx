"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function CreateProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        bio: '',
        gender: 'male',
        date_of_birth: '',
        marital_status: 'single',
        city: '',
        country: '',
        is_public: true,
        image: null
    });
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        if (user) {
            fetchMyProfile();
        }
    }, [user, authLoading, router]);

    const fetchMyProfile = async () => {
        try {
            const res = await api.get('/marriage-profiles/me');
            if (res.data) {
                setFormData({
                    bio: res.data.bio || '',
                    gender: res.data.gender || 'male',
                    date_of_birth: res.data.date_of_birth || '',
                    marital_status: res.data.marital_status || 'single',
                    profession: res.data.profession || '',
                    city: res.data.city || '',
                    country: res.data.country || '',
                    is_public: res.data.is_public ?? true
                });
            }
        } catch (error) {
            // No profile yet, that's fine
        }
    };

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        if (e.target.type === 'file') {
            setFormData({
                ...formData,
                image: e.target.files[0]
            });
        } else {
            setFormData({
                ...formData,
                [e.target.name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage('');

        try {
            const data = new FormData();
            for (const key in formData) {
                if (key === 'image' && !formData[key]) continue; // Skip if no new image
                data.append(key, formData[key]);
            }
            // For boolean is_public, FormData converts it to "true"/"false" string, backend validation handles 'boolean' rule usually fine but sending 1/0 is safer if needed. Laravel handles string "true" as true.

            await api.post('/marriage-profiles', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Profile saved successfully!');
            setTimeout(() => router.push('/marriage'), 1500);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to save profile');
        } finally {
            setSubmitting(false);
        }
    };

    if (authLoading || !user) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="max-w-3xl mx-auto p-6 mt-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden p-8 border border-gray-100 dark:border-gray-700">
                    <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Create / Update Profile</h1>
                    
                    {message && (
                        <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gender</label>
                                <select 
                                    name="gender" 
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date of Birth</label>
                                <input 
                                    type="date" 
                                    name="date_of_birth"
                                    value={formData.date_of_birth}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Marital Status</label>
                                <select 
                                    name="marital_status" 
                                    value={formData.marital_status}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                >
                                    <option value="single">Single (Never Married)</option>
                                    <option value="married">Married</option>
                                    <option value="divorced">Divorced</option>
                                    <option value="widowed">Widowed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profession</label>
                                <input 
                                    type="text" 
                                    name="profession"
                                    value={formData.profession}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    placeholder="e.g. Software Engineer"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                                <input 
                                    type="text" 
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                                <input 
                                    type="text" 
                                    name="country"
                                    value={formData.country}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Image</label>
                            <input 
                                type="file" 
                                name="image"
                                accept="image/*"
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Upload a professional photo (Max 2MB).</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bio / About Me</label>
                            <textarea 
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={5}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                placeholder="Describe yourself, your family background, and what you are looking for..."
                            ></textarea>
                        </div>

                        <div className="flex items-center">
                            <input 
                                type="checkbox" 
                                id="is_public" 
                                name="is_public"
                                checked={formData.is_public}
                                onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="is_public" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                                Make my profile public (visible to other users)
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            disabled={submitting}
                            className={`w-full py-3 rounded-lg font-bold text-white transition-opacity ${submitting ? 'bg-emerald-400' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                        >
                            {submitting ? 'Saving...' : 'Save Profile'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}
