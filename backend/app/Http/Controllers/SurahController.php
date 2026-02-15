<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SurahController extends Controller
{
    public function index()
    {
        return response()->json(\App\Models\Surah::orderBy('number')->get());
    }

    public function show(\App\Models\Surah $surah)
    {
        $surah->load(['ayahs.words.root']);
        return response()->json($surah);
    }
}
