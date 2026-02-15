<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuranSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Seed All 114 Surahs from API JSON
        $json = file_get_contents(database_path('seeders/surahs.json'));
        $surahsData = json_decode($json, true);

        foreach ($surahsData['chapters'] as $chapter) {
            $type = $chapter['revelation_place'] === 'makkah' ? 'Meccan' : 'Medinan';
            
            \App\Models\Surah::firstOrCreate(
                ['number' => $chapter['id']],
                [
                    'name_en' => $chapter['name_simple'],
                    'name_ar' => $chapter['name_arabic'],
                    'meaning_en' => $chapter['translated_name']['name'],
                    'type' => $type,
                    'ayah_count' => $chapter['verses_count'],
                    'order' => $chapter['revelation_order']
                ]
            );
        }

        // 2. Load Ayah Texts (Uthmani & Indopak)
        $uthmaniJson = file_get_contents(database_path('seeders/quran_uthmani.json'));
        $uthmaniData = json_decode($uthmaniJson, true);
        
        // Create lookup map: "surah:ayah" => text
        $uthmaniMap = [];
        foreach ($uthmaniData['verses'] as $verse) {
            $uthmaniMap[$verse['verse_key']] = $verse['text_uthmani'];
        }

        $indopakJson = file_get_contents(database_path('seeders/quran_indopak.json'));
        $indopakData = json_decode($indopakJson, true);
        $indopakMap = [];
        // The structure might be slightly different, let's assume it follows Verse Key or similar ID
        // Note: The API response for indopak verses might use "verses" key as well
        if (isset($indopakData['verses'])) {
             foreach ($indopakData['verses'] as $verse) {
                $indopakMap[$verse['verse_key']] = $verse['text_indopak'];
            }
        }

        // 3. Seed All Ayahs
        // We iterate through all Surahs and their Ayah counts
        $surahs = \App\Models\Surah::all();
        
        foreach ($surahs as $surah) {
            $ayahsToInsert = [];
            for ($i = 1; $i <= $surah->ayah_count; $i++) {
                $verseKey = $surah->number . ':' . $i;
                
                // Determine Juz/Page (simplified logic or fetch from API if needed, for now default to null or estimitation is complex without data)
                // For MVP, we will rely on what we have or set defaults.
                // Actually, the verses API response often includes 'juz_number' and 'page_number' if we used the right endpoint.
                // But the simple text endpoint might not have it.
                // Let's assume we update Juz/Page later or fetch rich data. 
                // For now, we seed the Text which is what the user wants.

                $textUthmani = $uthmaniMap[$verseKey] ?? '';
                $textIndopak = $indopakMap[$verseKey] ?? '';

                \App\Models\Ayah::firstOrCreate(
                    [
                        'surah_id' => $surah->id,
                        'number' => $i
                    ],
                    [
                        'number_in_quran' => 0, // Needs calculation or API data
                        'juz' => 1, // Placeholder
                        'page' => 1, // Placeholder
                        'text_uthmani' => $textUthmani,
                        'text_indopak' => $textIndopak
                    ]
                );
            }
        }

        // 4. Seed Detailed Words from Downloaded JSONs
        $quranDataDir = database_path('seeders/quran_data');
        if (!is_dir($quranDataDir)) {
            $this->command->warn("Quran data directory not found. Skipping word seeding. Run 'php fetch_words.php' first.");
            return;
        }

        // Pre-load Roots to minimize DB queries
        // $rootsCache = \App\Models\Root::pluck('id', 'letters')->toArray(); // Optimisation for later

        for ($i = 1; $i <= 114; $i++) {
            $file = "$quranDataDir/chapter_$i.json";
            if (!file_exists($file)) continue;

            $surah = \App\Models\Surah::where('number', $i)->first();
            if (!$surah) continue;

            // Check if words already seeded for this Surah to avoid duplicates/slowness
            // We check the first Ayah's words
            $firstAyah = $surah->ayahs()->first();
            if ($firstAyah && $firstAyah->words()->exists()) {
                $this->command->info("Words for Surah $i already seeded. Skipping.");
                continue;
            }

            $this->command->info("Seeding Words for Surah $i...");
            
            $json = file_get_contents($file);
            $data = json_decode($json, true);
            $verses = $data['verses'];

            // Eager load Ayahs for this Surah
            $ayahs = $surah->ayahs()->get()->keyBy('number');

            $wordsToInsert = [];

            foreach ($verses as $verse) {
                $ayahNumber = $verse['verse_number']; // API field: verse_number
                
                if (!isset($ayahs[$ayahNumber])) continue;
                $ayah = $ayahs[$ayahNumber];

                foreach ($verse['words'] as $wordData) {
                    // Skip "end marker" words if any (char_type_name = end)
                    if (isset($wordData['char_type_name']) && $wordData['char_type_name'] === 'end') continue;

                    $textUthmani = $wordData['text_uthmani'] ?? $wordData['text'] ?? '';
                    $translation = $wordData['translation']['text'] ?? '';
                    
                    // Root handling (simplified for now, strictly speaking we should look up or create roots)
                    // For speed, let's just use null or simple lookup if data provides it
                    // The API response depends on fields. If we didn't get root info, we skip root_id.
                    
                    $wordsToInsert[] = [
                        'ayah_id' => $ayah->id,
                        'position' => $wordData['position'],
                        'text_uthmani' => $textUthmani,
                        'text_indopak' => $wordData['text_indopak'] ?? null,
                        'translation_en' => $translation,
                        // 'root_id' => ... 
                    ];
                }
            }

            // Batch Insert
            foreach (array_chunk($wordsToInsert, 500) as $chunk) {
                \App\Models\Word::insert($chunk);
            }
        }
        // 5. Seed Ayah Translations (English & Bangla)
        $this->command->info("Seeding Ayah Translations...");

        $transEnFile = database_path('seeders/quran_data/translation_en.json');
        $transBnFile = database_path('seeders/quran_data/translation_bn.json');

        if (file_exists($transEnFile) && file_exists($transBnFile)) {
            $jsonEn = file_get_contents($transEnFile);
            $dataEn = json_decode($jsonEn, true)['translations']; // Flat list of 6236
            
            $jsonBn = file_get_contents($transBnFile);
            $dataBn = json_decode($jsonBn, true)['translations']; // Flat list of 6236

            $globalIndex = 0;
            
            // Chunking surahs to avoid memory issues if any, but fetching all is fine for 114 rows
            $surahs = \App\Models\Surah::orderBy('number')->get();

            foreach ($surahs as $surah) {
                // Eager load ayahs to avoid N+1, ordered by number
                $ayahs = $surah->ayahs()->orderBy('number')->get();
                
                foreach ($ayahs as $ayah) {
                    if (isset($dataEn[$globalIndex]) && isset($dataBn[$globalIndex])) {
                        // We use direct update query for speed, or model update
                        // Model update is safer but slower. 6236 is small enough for model update in loop?
                        // Actually, updating 6000 rows one by one is slow.
                        // Let's use bulk update if possible or just simple loop.
                        // Simple loop might take 10-20 seconds. Acceptable.
                        
                        $ayah->translation_en = $dataEn[$globalIndex]['text'];
                        $ayah->translation_bn = $dataBn[$globalIndex]['text'];
                        $ayah->save();
                    }
                    $globalIndex++;
                }
            }
        } else {
            $this->command->warn("Translation files not found. Run 'php fetch_translations.php' first.");
        }
    }

    private function seedWords($ayah, $wordsData)
    {
        foreach ($wordsData as $index => $data) {
            $root = \App\Models\Root::firstOrCreate(
                ['letters' => $data[2]],
                ['meaning_en' => $data[3]]
            );
            
            $ayah->words()->firstOrCreate(
                ['position' => $index + 1],
                [
                    'text_uthmani' => $data[0],
                    'translation_en' => $data[1],
                    'root_id' => $root->id
                ]
            );
        }
    }
}
