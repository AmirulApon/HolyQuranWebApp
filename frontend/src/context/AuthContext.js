"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Hydrate from localStorage
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    const login = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        router.push('/');
    };

    const register = (newToken, newUser) => {
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('auth_token', newToken);
        localStorage.setItem('auth_user', JSON.stringify(newUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        router.push('/');
    };

    const logout = async () => {
        try {
            if (token) {
                await api.post('/logout');
            }
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setToken(null);
            setUser(null);
            localStorage.removeItem('auth_token');
            localStorage.removeItem('auth_user');
            delete api.defaults.headers.common['Authorization'];
            router.push('/login');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
