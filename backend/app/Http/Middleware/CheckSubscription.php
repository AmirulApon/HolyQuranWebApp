<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Get requested Surah ID from route
        // Assuming route is /surahs/{surah}
        $surahId = $request->route('surah');

        // Note: $surahId might be an object if route model binding is used, or string/int
        if (is_object($surahId)) {
            $surahId = $surahId->number; // Assuming Surah model has 'number'
        }

        // 2. Allow first 5 Surahs (Free Tier - approx 10% of content logic)
        if ($surahId && $surahId <= 5) {
            return $next($request);
        }

        // 3. Check Authentication
        if (!Auth::guard('api')->check()) {
            return response()->json([
                'message' => 'Subscription required for this content.',
                'code' => 'subscription_required'
            ], 403);
        }

        $user = Auth::guard('api')->user();

        // 4. Check Subscription Status
        $subscription = $user->subscription()->where('status', 'active')->first();

        if (!$subscription) {
             return response()->json([
                'message' => 'Active subscription required.',
                'code' => 'subscription_required'
            ], 403);
        }

        // 5. Check Expiry (if not lifetime)
        if ($subscription->plan_type !== 'lifetime' && Carbon::now()->greaterThan($subscription->end_date)) {
            return response()->json([
                'message' => 'Subscription expired. Please renew.',
                'code' => 'subscription_expired'
            ], 403);
        }

        return $next($request);
    }
}
