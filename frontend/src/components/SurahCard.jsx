"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SurahCard({ surah }) {
  const [lastRead, setLastRead] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(`surah_${surah.id}_last_read`);
    if (saved) {
      setLastRead(parseInt(saved, 10));
    }
  }, [surah.id]);

  return (
    <Link 
      href={`/surah/${surah.id}`}
      className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 group relative overflow-hidden"
    >
      {lastRead && (
        <div className="absolute top-0 right-0 bg-emerald-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium shadow-sm z-10">
          Last Read: Ayah {lastRead}
        </div>
      )}
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center justify-center w-10 h-10 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full font-semibold group-hover:bg-emerald-200 dark:group-hover:bg-emerald-800 transition-colors">
          {surah.number}
        </div>
        <div className="text-right">
          <span className="block font-arabic text-xl mb-1">{surah.name_ar}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">{surah.type} • {surah.ayah_count} Ayahs</span>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {surah.name_en}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{surah.meaning_en}</p>
      </div>
    </Link>
  );
}
