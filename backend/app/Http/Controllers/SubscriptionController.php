<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Subscription;
use Carbon\Carbon;

class SubscriptionController extends Controller
{
    private $plans = [
        [
            'id' => 'monthly',
            'name' => 'Monthly Plan',
            'price' => 99,
            'period' => 'month',
            'features' => ['Full Access', 'Audio Recitation', 'Translations', 'No Ads']
        ],
        [
            'id' => 'yearly',
            'name' => 'Yearly Plan',
            'price' => 799,
            'period' => 'year',
            'features' => ['Full Access', 'Audio Recitation', 'Translations', 'No Ads', 'Save 20%']
        ],
        [
            'id' => 'lifetime',
            'name' => 'Lifetime Access',
            'price' => 1999,
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

        $status = 'active';
        $transaction_id = $request->transaction_id ?? ('mock_' . time());

        if ($request->payment_method === 'sslcommerz') {
            $status = 'pending';
            $transaction_id = "SSLSUB_" . uniqid();
        } else if (in_array($request->payment_method, ['bkash', 'nagad', 'rocket'])) {
            $status = 'pending'; // Manual verify
        }

        $subscription = Subscription::updateOrCreate(
            ['user_id' => $user->id],
            [
                'plan_type' => $planId,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => $status,
                'amount' => $this->getPlanPrice($planId),
                'payment_method' => $request->payment_method,
                'payment_id' => $transaction_id,
            ]
        );

        if ($request->payment_method === 'sslcommerz') {
            $post_data = array();
            $post_data['store_id'] = env('SSLC_STORE_ID', 'testbox');
            $post_data['store_passwd'] = env('SSLC_STORE_PASSWORD', 'qwerty');
            $post_data['total_amount'] = $subscription->amount;
            $post_data['currency'] = "USD"; 
            $post_data['tran_id'] = $transaction_id;
            $post_data['success_url'] = url('/api/sslcommerz/subscription/success');
            $post_data['fail_url'] = url('/api/sslcommerz/subscription/fail');
            $post_data['cancel_url'] = url('/api/sslcommerz/subscription/cancel');
            
            $post_data['cus_name'] = $user->name ?: 'Subscriber';
            $post_data['cus_email'] = $user->email ?: 'test@test.com';
            $post_data['cus_add1'] = "Dhaka";
            $post_data['cus_add2'] = "Dhaka";
            $post_data['cus_city'] = "Dhaka";
            $post_data['cus_state'] = "Dhaka";
            $post_data['cus_postcode'] = "1000";
            $post_data['cus_country'] = "Bangladesh";
            $post_data['cus_phone'] = "01711111111";
            $post_data['shipping_method'] = "NO";
            $post_data['num_of_item'] = 1;
            $post_data['product_name'] = "Subscription " . $planId;
            $post_data['product_category'] = "Subscription";
            $post_data['product_profile'] = "general";

            $handle = curl_init();
            curl_setopt($handle, CURLOPT_URL, 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php');
            curl_setopt($handle, CURLOPT_TIMEOUT, 30);
            curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 30);
            curl_setopt($handle, CURLOPT_POST, 1);
            curl_setopt($handle, CURLOPT_POSTFIELDS, $post_data);
            curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($handle, CURLOPT_SSL_VERIFYPEER, FALSE);

            $content = curl_exec($handle);
            $code = curl_getinfo($handle, CURLINFO_HTTP_CODE);
            curl_close($handle);

            if($code == 200) {
                $sslcz = json_decode($content, true);

                if(isset($sslcz['GatewayPageURL']) && $sslcz['GatewayPageURL']!="") {
                    return response()->json([
                        'message' => 'Redirecting to payment gateway',
                        'url' => $sslcz['GatewayPageURL']
                    ], 200);
                }
            }
        }

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

    public function success(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $subscription = Subscription::where('payment_id', $tran_id)->first();
        if ($subscription) {
            $subscription->update(['status' => 'active']);
        }
        return redirect('http://localhost:3000/dashboard?status=success');
    }

    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $subscription = Subscription::where('payment_id', $tran_id)->first();
        if ($subscription) {
            $subscription->update(['status' => 'cancelled']);
        }
        return redirect('http://localhost:3000/dashboard?status=fail');
    }

    public function cancel(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $subscription = Subscription::where('payment_id', $tran_id)->first();
        if ($subscription) {
            $subscription->update(['status' => 'cancelled']);
        }
        return redirect('http://localhost:3000/dashboard?status=cancel');
    }
}
