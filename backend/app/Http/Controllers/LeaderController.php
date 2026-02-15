<?php

namespace App\Http\Controllers;

use App\Models\Leader;
use Illuminate\Http\Request;

class LeaderController extends Controller
{
    public function index(Request $request)
    {
        $query = Leader::where('is_active', true);

        if ($request->has('district')) {
            $query->where('district', 'like', '%' . $request->district . '%');
        }

        if ($request->has('role')) {
            $query->where('role', 'like', '%' . $request->role . '%');
        }

        $leaders = $query->latest()->get();

        return response()->json($leaders);
    }

    public function show($id)
    {
        $leader = Leader::findOrFail($id);
        return response()->json($leader);
    }
}
