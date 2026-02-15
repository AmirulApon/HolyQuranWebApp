<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Donation;
use App\Models\Subscription;
use App\Models\Leader;
use Illuminate\Support\Facades\DB;
use App\Models\ContactMessage;
use App\Models\MarriageProfile;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    public function stats()
    {
        // 1. Total Donations
        $totalDonations = Donation::sum('amount');
        $donationCount = Donation::count();

        // 2. User Statistics
        $totalUsers = User::count();
        $adminCount = User::where('role', 'admin')->count();

        // 3. Subscriptions
        $activeSubscriptions = Subscription::where('status', 'active')->count();
        $totalRevenue = Subscription::where('status', 'active')->sum('amount'); // Assuming amount is stored in subscriptions or we calculate from plans

        // 4. Leaders
        $totalLeaders = Leader::count();

        // 5. Recent Activity (for dashboard feed)
        $recentDonations = Donation::latest()->take(5)->get();
        $recentUsers = User::latest()->take(5)->get();

        return response()->json([
            'donations' => [
                'total_amount' => $totalDonations,
                'count' => $donationCount,
                'recent' => $recentDonations
            ],
            'users' => [
                'total' => $totalUsers,
                'admins' => $adminCount,
                'recent' => $recentUsers
            ],
            'subscriptions' => [
                'active' => $activeSubscriptions,
                'revenue' => $totalRevenue // Placeholder if amount isn't directly on subscription table
            ],
            'leaders' => [
                'total' => $totalLeaders
            ]
        ]);
    }

    // Donations Management
    public function getDonations()
    {
        $donations = Donation::latest()->paginate(10);
        return response()->json($donations);
    }

    // Leaders Management
    public function getLeaders()
    {
        $leaders = Leader::latest()->paginate(10);
        return response()->json($leaders);
    }

    public function storeLeader(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $leader = Leader::create($request->all());
        return response()->json($leader, 201);
    }

    public function updateLeader(Request $request, $id)
    {
        $leader = Leader::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'district' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'image_url' => 'nullable|url',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $leader->update($request->all());
        return response()->json($leader);
    }

    public function destroyLeader($id)
    {
        $leader = Leader::findOrFail($id);
        $leader->delete();
        return response()->json(['message' => 'Leader deleted successfully']);
    }

    // Subscriptions Management
    public function getSubscriptions()
    {
        $subscriptions = Subscription::with('user')->latest()->paginate(10);
        return response()->json($subscriptions);
    }

    // Messages Management
    public function getMessages()
    {
        $messages = ContactMessage::latest()->paginate(10);
        return response()->json($messages);
    }

    // Marriage Profiles Management
    public function getMarriageProfiles()
    {
        $profiles = MarriageProfile::with('user')->latest()->paginate(10);
        return response()->json($profiles);
    }

    public function destroyMarriageProfile($id)
    {
        $profile = MarriageProfile::findOrFail($id);
        $profile->delete();
        return response()->json(['message' => 'Profile deleted successfully']);
    }
}
