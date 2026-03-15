"use client";

import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ surah, currentAyah, onAyahChange }) {
    const [isPlaying, setIsPlaying] = useState(false);
    // currentAyah state removed, now using props
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [audioLanguage, setAudioLanguage] = useState('ar'); // 'ar', 'en', 'bn'
    const audioRef = useRef(null);

    // Format surahId to 3 digits (e.g., 1 -> 001)
    const formattedSurahId = surah.id.toString().padStart(3, '0');

    // Get formatted Ayah ID (e.g., 1 -> 001, 002, etc.)
    const getFormattedAyahId = (ayahNum) => {
        return ayahNum.toString().padStart(3, '0');
    };

    const getAudioSrc = (ayahNum) => {
        const formattedAyahId = getFormattedAyahId(ayahNum);
        if (audioLanguage === 'ar') {
            // Mishary Rashid Alafasy (Verse by Verse)
            return `https://everyayah.com/data/Alafasy_128kbps/${formattedSurahId}${formattedAyahId}.mp3`;
        } else if (audioLanguage === 'en') {
            // Ibrahim Walk (Verse by Verse)
            return `https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/${formattedSurahId}${formattedAyahId}.mp3`;
        } else if (audioLanguage === 'bn') {
             // Fallback for Bangla: Full Surah Audio
             // Source: AlQurans.com or similar reliable source
             // Using a generic pattern if available, or a specific known source.
             // Since we don't have verse-by-verse, we play the full file.
             // We need to handle this differently in logic (no auto-scroll per ayah, or approximate).
             // For now, let's use a full surah link.
             // https://download.quranicaudio.com/quran/mishaari_with_bangla/001.mp3 was 404.
             // Let's try: https://server7.mp3quran.net/basit/Al-Mushaf-Al-Moallim/001.mp3 (Arabic)
             // Let's use the one from Archive.org if we can find a direct link, or a standard one.
             // https://archive.org/download/Quran_Bangla_Translation_Mishary_Rashid_Alafasy/001.mp3 (This was 404?)
             // Let's try to use a direct AlQuranBD source if possible, or warn user.
             // User wants it solved. 
             // Let's use a specific known working one or disable with a better message.
             // Actually, the user said "ENGLISH AND BANGLA IS NOT WORKING".
             // I'll fix English. For Bangla, I will try to use:
             // https://download.quranicaudio.com/quran/mishaari_with_bangla/${formattedSurahId}.mp3
             // wait, I checked that and it 404'd.
             // Source: https://archive.org/details/Al-Quran_audio_arabic_bangla
             // File format: 01.mp3, 02.mp3, ..., 10.mp3, ..., 100.mp3
             const banglaSurahId = surah.id.toString().padStart(2, '0');
             return `https://archive.org/download/Al-Quran_audio_arabic_bangla/${banglaSurahId}.mp3`;
        }
        return '';
    };

    // Auto-scroll to active Ayah
    useEffect(() => {
        if (audioLanguage === 'bn') return; // Disable auto-scroll for Bangla full audio

        const element = document.getElementById(`ayah-${currentAyah}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        
        // Auto-play when ayah changes if it's not the initial load or if we were already playing
        // But for simplicity/user intent: if user clicks an ayah, they probably want to hear it.
        // We can check if isPlaying is true. If not, we might want to start playing or let user click play.
        // However, the requirement is "automatically change the ayah audio".
        // Let's ensure it plays if we receive a new ayah and we want it to auto-play.
        // A common pattern is: if the ayah changes and it wasn't a reset (like 1), play.
        // Or simply: if isPlaying is true, it keeps playing new source.
        // If user *clicked* an ayah, we explicitly want to play. 
        // We might need a prop `autoPlay` or handle it in parent.
        // For now, let's just let the `src` change handle the audio loading.
        // The `handleLoadedMetadata` already calls `play()` if `isPlaying` is true.
        // We might need to set `isPlaying(true)` when `currentAyah` changes from props IF it was a user interaction?
        // Actually, let's check `handleLoadedMetadata`.
    }, [currentAyah, audioLanguage]);

    // Effect to auto-play when currentAyah changes (detected via prop change)
    useEffect(() => {
        if (audioRef.current && currentAyah !== 1 && !isPlaying) {
             // If we want to auto-play on click, we should set isPlaying to true.
             // But we need to distinguish between "user clicked" and "initial load".
             // We can assume if currentAyah changes and it's not 1 (or even if it is 1 but triggered by click), we play.
             // For now, let's rely on the parent or user to start playing? 
             // no, user said "automatically change audio".
             // Let's set isPlaying(true) when currentAyah changes.
             setIsPlaying(true);
        }
    }, [currentAyah]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
            if (isPlaying) {
                audioRef.current.play();
            }
        }
    };

    const handleEnded = () => {
        if (audioLanguage === 'bn') {
             setIsPlaying(false);
             setProgress(0);
             return;
        }

        if (currentAyah < surah.ayah_count) {
            onAyahChange(currentAyah + 1);
        } else {
            setIsPlaying(false);
            onAyahChange(1); // Reset to start
        }
    };

    const handleSeek = (e) => {
        const width = e.target.clientWidth;
        const clickX = e.nativeEvent.offsetX;
        const duration = audioRef.current.duration;
        audioRef.current.currentTime = (clickX / width) * duration;
    };

    const handleLanguageChange = (lang) => {
        setAudioLanguage(lang);
        setIsPlaying(false);
        setProgress(0);
        onAyahChange(1);
        if (audioRef.current) {
            audioRef.current.load();
        }
    };

    const formatTime = (seconds) => {
        if (!seconds) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-4 z-50">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Audio Element */}
                <audio 
                    ref={audioRef}
                    key={audioLanguage + currentAyah} // Force re-render on source change to ensure reliability
                    src={getAudioSrc(currentAyah)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleEnded}
                />

                {/* Controls */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <button 
                        onClick={togglePlay}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-md"
                    >
                        {isPlaying ? (
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/></svg>
                        ) : (
                            <svg className="w-5 h-5 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        )}
                    </button>
                    
                    <div className="flex flex-col flex-1 sm:w-64">
                         <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-1">
                            {audioLanguage === 'bn' ? (
                                <span>Full Surah</span>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <span>Ayah</span>
                                    <select 
                                        value={currentAyah} 
                                        onChange={(e) => onAyahChange(parseInt(e.target.value))}
                                        className="bg-transparent text-gray-700 dark:text-gray-300 font-medium focus:outline-none cursor-pointer border-b border-transparent hover:border-gray-300 dark:hover:border-gray-600 pb-0.5"
                                    >
                                        {Array.from({ length: surah.ayah_count }, (_, i) => i + 1).map(num => (
                                            <option key={num} value={num} className="bg-white dark:bg-gray-800">
                                                {num}
                                            </option>
                                        ))}
                                    </select>
                                    <span>/ {surah.ayah_count}</span>
                                </div>
                            )}
                            <span>{formatTime(audioRef.current?.currentTime)} / {formatTime(duration)}</span>
                        </div>
                        <div 
                            className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full cursor-pointer relative overflow-hidden"
                            onClick={handleSeek}
                        >
                            <div 
                                className="absolute top-0 left-0 h-full bg-emerald-500 rounded-full transition-all duration-100"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Language Selector */}
                <div className="flex gap-2">
                    {[
                        { code: 'ar', label: 'Arabic' },
                        { code: 'en', label: 'English' },
                        { code: 'bn', label: 'Bangla' }
                    ].map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                                audioLanguage === lang.code 
                                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500' 
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
