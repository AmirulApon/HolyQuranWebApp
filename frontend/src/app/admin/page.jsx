"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { 
    ChartBarIcon, 
    CurrencyDollarIcon, 
    UserGroupIcon, 
    CreditCardIcon, 
    EnvelopeIcon, 
    HeartIcon,
    ArrowLeftOnRectangleIcon 
} from '@heroicons/react/24/outline';

import DonationsView from '@/components/admin/DonationsView';
import LeadersView from '@/components/admin/LeadersView';
import SubscriptionsView from '@/components/admin/SubscriptionsView';
import MessagesView from '@/components/admin/MessagesView';
import MarriageProfilesView from '@/components/admin/MarriageProfilesView';

// Sub-components (We can move these to separate files later if they grow)
const DashboardHome = ({ stats }) => {
    if (!stats) return null;
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Overview</h2>
             {/* Stats Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Revenue (Donation + Subscriptions) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Funds</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        ${(Number(stats.donations.total_amount) + Number(stats.subscriptions.revenue || 0)).toFixed(2)}
                    </p>
                    <div className="mt-2 text-xs text-emerald-600 flex items-center">
                        <span className="font-medium">Combined Revenue</span>
                    </div>
                </div>

                {/* Users */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Users</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.users.total}</p>
                    <div className="mt-2 text-xs text-gray-500">
                        {stats.users.admins} Admins
                    </div>
                </div>

                {/* Donations Count */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Donations</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.donations.count}</p>
                    <div className="mt-2 text-xs text-emerald-600">
                        ${Number(stats.donations.total_amount).toFixed(2)} Total
                    </div>
                </div>

                {/* Active Subscriptions */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active Subscriptions</h3>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.subscriptions.active}</p>
                    <div className="mt-2 text-xs text-emerald-600">
                        ${Number(stats.subscriptions.revenue || 0).toFixed(2)} Revenue
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Users</h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {stats.users.recent.map((u) => (
                                <li key={u.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold">
                                            {u.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{u.name}</p>
                                            <p className="text-xs text-gray-500">{u.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-gray-400">
                                        {new Date(u.created_at).toLocaleDateString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Recent Donations */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Donations</h3>
                    </div>
                    <div className="p-6">
                        <ul className="space-y-4">
                            {stats.donations.recent.length > 0 ? (
                                stats.donations.recent.map((d) => (
                                    <li key={d.id} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                ${Number(d.amount).toFixed(2)}
                                            </p>
                                            <p className="text-xs text-gray-500">{d.donor_name || 'Anonymous'}</p>
                                        </div>
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            d.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {d.status}
                                        </span>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-500 text-sm">No recent donations.</p>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function AdminDashboard() {
    const { user, logout, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'admin') {
                router.push('/');
                return;
            }
            fetchStats();
        }
    }, [user, authLoading, router]);

    const fetchStats = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats(res.data);
        } catch (error) {
            console.error("Failed to fetch admin stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading Dashboard...</div>;
    }

    const navigation = [
        { name: 'Dashboard', id: 'dashboard', icon: ChartBarIcon },
        { name: 'Donations', id: 'donations', icon: CurrencyDollarIcon },
        { name: 'Leaders', id: 'leaders', icon: UserGroupIcon },
        { name: 'Subscriptions', id: 'subscriptions', icon: CreditCardIcon },
        { name: 'Messages', id: 'messages', icon: EnvelopeIcon },
        { name: 'Matrimony', id: 'marriage', icon: HeartIcon },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardHome stats={stats} />;
            case 'donations':
                return <DonationsView />;
            case 'leaders':
                return <LeadersView />;
            case 'subscriptions':
                return <SubscriptionsView />;
            case 'messages':
                return <MessagesView />;
            case 'marriage':
                return <MarriageProfilesView />;
            default:
                return <DashboardHome stats={stats} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                        <span>🛡️</span> Admin
                    </h1>
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navigation.map((item) => {
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                                    activeTab === item.id
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100 dark:border-gray-700 space-y-2">
                    <a href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors">
                        <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                        Back to Site
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto h-screen">
                <div className="p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
}
