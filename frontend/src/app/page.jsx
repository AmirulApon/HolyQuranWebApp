import Link from 'next/link';
import SurahCard from '@/components/SurahCard';

async function getSurahs() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const res = await fetch(`${apiUrl}/surahs`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function Home() {
  const surahs = await getSurahs();

  return (
    <main className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 font-serif">The Holy Quran</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Word-by-Word Analysis & Translation</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surahs.map((surah) => (
            <SurahCard key={surah.id} surah={surah} />
          ))}
        </div>
      </div>
    </main>
  );
}
