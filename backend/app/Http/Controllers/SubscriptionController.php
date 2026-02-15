<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Subscription;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    // Define available plans
    private $plans = [
        [
            'id' => 'monthly',
            'name' => 'Monthly Plan',
            'price' => 9.99,
            'period' => 'month',
            'features' => ['Full Access', 'Audio Recitation', 'Translations', 'No Ads']
        ],
        [
            'id' => 'yearly',
            'name' => 'Yearly Plan',
            'price' => 99.99,
            'period' => 'year',
            'features' => ['Full Access', 'Audio Recitation', 'Translations', 'No Ads', 'Save 20%']
        ],
        [
            'id' => 'lifetime',
            'name' => 'Lifetime Access',
            'price' => 299.99,
            'period' => 'lifetime',
            'features' => ['Full Access Forever', 'All Future Updates', 'Priority Support']
        ]
    ];

    public function plans()
    {
        return response()->json($this->plans);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|in:monthly,yearly,lifetime',
            'payment_method' => 'required', // mock for now
        ]);

        $user = Auth::user();
        $planId = $request->plan_id;
        
        $startDate = Carbon::now();
        $endDate = null;

        if ($planId === 'monthly') {
            $endDate = $startDate->copy()->addMonth();
        } elseif ($planId === 'yearly') {
            $endDate = $startDate->copy()->addYear();
        }
        // Lifetime has null end_date

        $subscription = Subscription::updateOrCreate(
            ['user_id' => $user->id],
            [
                'plan_type' => $planId,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'active',
                'amount' => $this->getPlanPrice($planId),
                'payment_method' => $request->payment_method,
                'payment_id' => 'mock_' . time(),
            ]
        );

        return response()->json(['message' => 'Subscription successful', 'subscription' => $subscription]);
    }

    public function status()
    {
        $subscription = Auth::user()->subscription()->where('status', 'active')->first();
        
        if (!$subscription) {
            return response()->json(['active' => false]);
        }
        
        // Check expiry for non-lifetime
        if ($subscription->plan_type !== 'lifetime' && Carbon::now()->greaterThan($subscription->end_date)) {
             $subscription->update(['status' => 'expired']);
             return response()->json(['active' => false]);
        }

        return response()->json(['active' => true, 'subscription' => $subscription]);
    }

    private function getPlanPrice($id) {
        foreach ($this->plans as $plan) {
            if ($plan['id'] == $id) return $plan['price'];
        }
        return 0;
    }
}
