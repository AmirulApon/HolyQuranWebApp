<?php

namespace App\Http\Controllers;

use App\Models\Advertisement;
use Illuminate\Http\Request;

class AdvertisementController extends Controller
{
    public function index(Request $request)
    {
        $query = Advertisement::where('is_active', true);

        if ($request->has('position')) {
            $query->where('position', $request->position);
        }

        $ads = $query->latest()->get();

        return response()->json($ads);
    }
}
