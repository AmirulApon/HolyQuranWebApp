<?php

namespace App\Http\Controllers;

use App\Models\ReadingProgress;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReadingProgressController extends Controller
{
    // Total Ayahs in the Quran
    const TOTAL_AYAHS = 6236;

    public function index()
    {
        $user = Auth::guard('api')->user();

        // 1. Get all progress records
        $progress = ReadingProgress::where('user_id', $user->id)->get();

        // 2. Calculate Total Ayahs Read
        // This is an approximation. If we tracked every single ayah, we'd count rows in a pivot table.
        // Here we track "last read ayah" per surah. 
        // A better approximation for "total read" based on "last read":
        // Sum of (last_read_ayah_number) for each surah.
        // This assumes sequential reading.
        
        $totalRead = $progress->sum('last_read_ayah_number');
        
        // Cap at total ayahs just in case
        if ($totalRead > self::TOTAL_AYAHS) {
            $totalRead = self::TOTAL_AYAHS;
        }

        $percentage = ($totalRead / self::TOTAL_AYAHS) * 100;

        return response()->json([
            'total_read' => $totalRead,
            'total_ayahs' => self::TOTAL_AYAHS,
            'percentage' => round($percentage, 2),
            'surah_progress' => $progress->mapWithKeys(function ($item) {
                return [$item->surah_id => $item->last_read_ayah_number];
            }),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'surah_id' => 'required|integer',
            'ayah_number' => 'required|integer',
        ]);

        $user = Auth::guard('api')->user();

        $progress = ReadingProgress::updateOrCreate(
            [
                'user_id' => $user->id,
                'surah_id' => $request->surah_id,
            ],
            [
                'last_read_ayah_number' => $request->ayah_number,
                // We can determine 'is_completed' if we knew the total ayahs for this surah.
                // For now, let's just update the position.
            ]
        );

        return response()->json(['message' => 'Progress saved', 'progress' => $progress]);
    }
}
