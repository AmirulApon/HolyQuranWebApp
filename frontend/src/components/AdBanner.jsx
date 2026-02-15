"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export default function AdBanner({ position, className = '' }) {
    const [ad, setAd] = useState(null);

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const res = await api.get(`/advertisements?position=${position}`);
                if (res.data && res.data.length > 0) {
                    // Randomly select one ad if multiple exist for the position
                    const randomIndex = Math.floor(Math.random() * res.data.length);
                    setAd(res.data[randomIndex]);
                }
            } catch (error) {
                console.error("Failed to fetch ad", error);
            }
        };

        fetchAd();
    }, [position]);

    if (!ad) return null;

    return (
        <div className={`w-full overflow-hidden rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 ${className}`}>
            <a href={ad.link || '#'} target="_blank" rel="noopener noreferrer" className="block relative">
                <img 
                    src={ad.image_url} 
                    alt={ad.title} 
                    className="w-full h-auto object-cover max-h-32 md:max-h-48"
                />
                <div className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-2 py-1">
                    Sponsored
                </div>
            </a>
        </div>
    );
}
