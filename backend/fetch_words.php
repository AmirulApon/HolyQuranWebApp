<?php

$baseUrl = "https://api.quran.com/api/v4/verses/by_chapter/";
$outputDir = __DIR__ . "/database/seeders/quran_data";

if (!is_dir($outputDir)) {
    mkdir($outputDir, 0777, true);
}

// Loop through all 114 Surahs
for ($i = 1; $i <= 114; $i++) {
    echo "Fetching Chapter $i...\n";
    
    $allVerses = [];
    $page = 1;
    
    while (true) {
        $url = $baseUrl . "$i?language=en&words=true&word_fields=text_uthmani,text_indopak,translation,location&fields=text_uthmani,text_indopak&per_page=50&page=$page";
        
        $json = file_get_contents($url);
        
        if ($json === FALSE) {
            echo "Failed to fetch Chapter $i Page $page\n";
            break;
        }
        
        $data = json_decode($json, true);
        
        if (isset($data['verses'])) {
            $allVerses = array_merge($allVerses, $data['verses']);
        }
        
        if (isset($data['pagination']['next_page']) && $data['pagination']['next_page'] !== null) {
            $page++;
            // Be nice to API
            usleep(200000); // 0.2s
        } else {
            break;
        }
    }
    
    // Save combined data
    // We recreate the structure to match what we expect: {"verses": [...]}
    $finalData = ['verses' => $allVerses];
    
    file_put_contents("$outputDir/chapter_$i.json", json_encode($finalData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    
    echo "Saved Chapter $i with " . count($allVerses) . " verses.\n";
}

echo "Download complete.\n";
