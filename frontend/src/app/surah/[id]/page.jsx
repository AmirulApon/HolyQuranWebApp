import Link from 'next/link';
import SurahViewer from '@/components/SurahViewer';

async function getSurah(id) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  const res = await fetch(`${apiUrl}/surahs/${id}`, {
    cache: 'no-store',
  });

  if (res.status === 403) {
    return null;
  }

  if (!res.ok) {
    throw new Error('Failed to fetch surah');
  }

  return res.json();
}

export async function generateStaticParams() {
  return Array.from({ length: 114 }, (_, i) => ({
    id: (i + 1).toString(),
  }));
}

export default async function SurahPage({ params }) {
  const { id } = await params;
  const surah = await getSurah(id);

  return <SurahViewer surah={surah} surahId={id} />;
}
