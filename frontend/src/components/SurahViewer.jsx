"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import AdBanner from './AdBanner';
import AudioPlayer from '@/components/AudioPlayer';

export default function SurahViewer({ surah, surahId }) {
  const [currentSurah, setCurrentSurah] = useState(surah);
  const [language, setLanguage] = useState('en');
  const [lastReadAyah, setLastReadAyah] = useState(null);
  const { user } = useAuth();
  const [loading, setLoading] = useState(!surah);
  const [currentAudioAyah, setCurrentAudioAyah] = useState(1);

    useEffect(() => {
        if (!surah) {
            setLoading(true);
            api.get(`/surahs/${surahId}`)
                .then(res => {
                    setCurrentSurah(res.data);
                })
                .catch(err => {
                    console.error("Failed to fetch surah", err);
                })
                .finally(() => setLoading(false));
        } else {
            setCurrentSurah(surah);
        }
    }, [surah, surahId]);

  useEffect(() => {
    if (currentSurah) {
        const saved = localStorage.getItem(`surah_${currentSurah.id}_last_read`);
        if (saved) setLastReadAyah(Number(saved));
    }
  }, [currentSurah]);
  
  const handleAyahClick = async (ayahNumber) => {
    if (!currentSurah) return;
    setLastReadAyah(ayahNumber);
    // Also update audio player to this ayah
    setCurrentAudioAyah(ayahNumber);

    localStorage.setItem(`surah_${currentSurah.id}_last_read`, ayahNumber.toString());

    if (user) {
        try {
            await api.post('/reading-progress', {
                surah_id: currentSurah.id,
                ayah_number: ayahNumber
            });
        } catch (error) {
            if (error.response?.status !== 401) {
                console.error("Failed to save progress", error);
            }
        }
    }
  };

  const cleanText = (text) => {
    if (!text) return '';
    return text.replace(/<sup.*?<\/sup>/g, '').trim();
  };

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading Surah...</div>;
  }



    if (!currentSurah) return <div className="text-center py-10">Surah not found.</div>;

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 pb-24">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header with Language Toggle */}
        <header className="mb-10 text-center border-b border-gray-200 dark:border-gray-800 pb-8">
          <div className="flex justify-between items-center mb-6">
             <Link href="/" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                &larr; Back to Surah List
             </Link>
             
             <div className="flex gap-2 bg-gray-200 dark:bg-gray-800 p-1 rounded-lg">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'en' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${language === 'bn' ? 'bg-white dark:bg-gray-700 shadow-sm text-emerald-600' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                  বাংলা
                </button>
             </div>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-bold mb-2 font-serif">{currentSurah.name_en}</h1>
            <h2 className="text-3xl font-arabic mb-2">{currentSurah.name_ar}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">{currentSurah.meaning_en}</p>
            <div className="mt-4 flex gap-4 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full">{currentSurah.type}</span>
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-800 rounded-full">{currentSurah.ayah_count} Ayahs</span>
            </div>
          </div>
        </header>

        {/* Ayah List */}
        <div className="space-y-12">
          {currentSurah.number !== 1 && currentSurah.number !== 9 && (
            <div className="text-center text-3xl font-arabic mb-8">
              بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
          )}

          {currentSurah.ayahs?.map((ayah) => (
            <div 
              key={ayah.id} 
              id={`ayah-${ayah.number}`}
              onClick={() => handleAyahClick(ayah.number)}
              className={`p-6 rounded-2xl shadow-sm border transition-all cursor-pointer ${
                lastReadAyah === ayah.number 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 ring-1 ring-emerald-500' 
                  : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:border-emerald-200 dark:hover:border-emerald-800'
              }`}
            >
              {/* Ayah Number & Actions */}
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="flex items-center gap-3">
                    <span className="bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold">
                    {ayah.number}
                    </span>
                    {lastReadAyah === ayah.number && (
                        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded">
                            Last Read
                        </span>
                    )}
                </div>
                <div className="flex gap-2">
                   {/* Actions like play audio, bookmark could go here */}
                </div>
              </div>

              {/* Word by Word / Arabic Text */}
              <div className="flex flex-wrap flex-row-reverse gap-4 mb-8 justify-end" dir="rtl">
                {ayah.words && ayah.words.length > 0 ? (
                  ayah.words.map((word) => (
                    <div key={word.id} className="group relative flex flex-col items-center text-center">
                      <span className="text-3xl font-arabic mb-2 hover:text-emerald-600 transition-colors cursor-pointer">
                        {word.text_uthmani}
                      </span>
                      {/* Word Translation Logic */}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {language === 'bn' && word.translation_bn ? word.translation_bn : word.translation_en}
                      </span>
                      {word.root && (
                        <div className="hidden group-hover:block absolute -top-12 bg-black text-white text-xs px-2 py-1 rounded max-w-[150px] z-10 w-max">
                          Root: {word.root.letters} ({word.root.meaning_en})
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="w-full text-center">
                    <p className="text-3xl font-arabic leading-loose text-gray-900 dark:text-gray-100 mb-4">
                      {ayah.text_uthmani}
                    </p>
                  </div>
                )}
              </div>

              {/* Full Translation */}
              <div className={`text-lg leading-relaxed ${language === 'bn' ? 'font-bengali' : 'font-serif'} text-gray-700 dark:text-gray-300`}>
                {language === 'bn' 
                    ? (cleanText(ayah.translation_bn) || <span className="italic text-gray-400">অনুবাদ উপলব্ধ নেই</span>)
                    : (cleanText(ayah.translation_en) || <span className="italic text-gray-400">Translation unavailable</span>)
                }
              </div>
            </div>
          ))}
        </div>

        {/* Next/Previous Surah Navigation */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-between items-center">
            {currentSurah.number > 1 ? (
                <Link 
                    href={`/surah/${currentSurah.number - 1}`}
                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-lg shadow-sm hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500 border border-gray-200 dark:border-gray-700 transition-all"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                    Previous Surah
                </Link>
            ) : <div></div>}

            {currentSurah.number < 114 ? (
                <Link 
                    href={`/surah/${currentSurah.number + 1}`}
                    className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg shadow-sm hover:bg-emerald-700 transition-all"
                >
                    Next Surah
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                </Link>
            ) : <div></div>}
        </div>
      </div>
      <AudioPlayer surah={currentSurah} currentAyah={currentAudioAyah} onAyahChange={setCurrentAudioAyah} />
    </main>
  );
}
