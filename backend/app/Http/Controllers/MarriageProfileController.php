<?php

namespace App\Http\Controllers;

use App\Models\MarriageProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class MarriageProfileController extends Controller
{
    public function index(Request $request)
    {
        $query = MarriageProfile::where('is_public', true);

        if ($request->has('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->has('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        if ($request->has('country')) {
            $query->where('country', 'like', '%' . $request->country . '%');
        }

        $profiles = $query->with('user:id,name')->latest()->paginate(10);

        return response()->json($profiles);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'bio' => 'required|string',
            'gender' => 'required|in:male,female',
            'date_of_birth' => 'required|date',
            'marital_status' => 'required|string',
            'profession' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'is_public' => 'boolean',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = Auth::guard('api')->user();
        $data = $request->except(['image']);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('profiles', 'public');
            $data['image'] = $path; // Store relative path
        }

        $profile = MarriageProfile::updateOrCreate(
            ['user_id' => $user->id],
            $data
        );

        return response()->json([
            'message' => 'Profile saved successfully',
            'profile' => $profile
        ]);
    }

    public function show($id)
    {
        $profile = MarriageProfile::with('user:id,name')->findOrFail($id);
        
        if (!$profile->is_public && $profile->user_id !== Auth::guard('api')->id()) {
            return response()->json(['message' => 'Profile is private'], 403);
        }

        return response()->json($profile);
    }

    public function myProfile()
    {
        $user = Auth::guard('api')->user();
        $profile = MarriageProfile::where('user_id', $user->id)->first();

        return response()->json($profile);
    }
}
