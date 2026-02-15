<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Quran API Backend is running successfully.',
        'version' => '1.0.0',
        'documentation' => 'Use /api/surahs to fetch data.'
    ]);
});
