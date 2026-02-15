<?php

$outputDir = __DIR__ . "/database/seeders/quran_data";

if (!is_dir($outputDir)) {
    mkdir($outputDir, 0777, true);
}

// 1. English (Saheeh International) - ID 20
echo "Fetching English Translation (ID 20)...\n";
$urlEn = "https://api.quran.com/api/v4/quran/translations/20";
$jsonEn = file_get_contents($urlEn);
if ($jsonEn) {
    file_put_contents("$outputDir/translation_en.json", $jsonEn);
    echo "Saved English Translation.\n";
} else {
    echo "Failed to fetch English Translation.\n";
}

// 2. Bangla (Dr. Abu Bakr Muhammad Zakaria) - ID 213
echo "Fetching Bangla Translation (ID 213)...\n";
$urlBn = "https://api.quran.com/api/v4/quran/translations/213";
$jsonBn = file_get_contents($urlBn);
if ($jsonBn) {
    file_put_contents("$outputDir/translation_bn.json", $jsonBn);
    echo "Saved Bangla Translation.\n";
} else {
    echo "Failed to fetch Bangla Translation.\n";
}

echo "Downloads complete.\n";
