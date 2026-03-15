<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DonationController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:1',
            'currency' => 'nullable|string',
            'donor_name' => 'nullable|string|max:255',
            'donor_email' => 'nullable|email|max:255',
            'payment_method' => 'required|string',
            'transaction_id' => 'nullable|string',
            'message' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $donation = Donation::create($request->all());

        if ($request->payment_method === 'sslcommerz') {
            $transaction_id = "SSLCZ_" . uniqid();
            $donation->update(['transaction_id' => $transaction_id, 'status' => 'pending']);

            $post_data = array();
            $post_data['store_id'] = env('SSLC_STORE_ID', 'testbox');
            $post_data['store_passwd'] = env('SSLC_STORE_PASSWORD', 'qwerty');
            $post_data['total_amount'] = $donation->amount;
            $post_data['currency'] = $donation->currency ?: "BDT"; 
            $post_data['tran_id'] = $transaction_id;
            $post_data['success_url'] = url('/api/sslcommerz/success');
            $post_data['fail_url'] = url('/api/sslcommerz/fail');
            $post_data['cancel_url'] = url('/api/sslcommerz/cancel');
            
            $post_data['cus_name'] = $donation->donor_name ?: 'Anonymous';
            $post_data['cus_email'] = $donation->donor_email ?: 'test@test.com';
            $post_data['cus_add1'] = "Dhaka";
            $post_data['cus_add2'] = "Dhaka";
            $post_data['cus_city'] = "Dhaka";
            $post_data['cus_state'] = "Dhaka";
            $post_data['cus_postcode'] = "1000";
            $post_data['cus_country'] = "Bangladesh";
            $post_data['cus_phone'] = "01711111111";
            $post_data['shipping_method'] = "NO";
            $post_data['num_of_item'] = 1;
            $post_data['product_name'] = "Donation";
            $post_data['product_category'] = "Donation";
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
        } else {
            $donation->update(['status' => 'completed']);
        }

        return response()->json([
            'message' => 'Donation received successfully',
            'donation' => $donation
        ], 201);
    }

    public function success(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $donation = Donation::where('transaction_id', $tran_id)->first();
        if ($donation) {
            $donation->update(['status' => 'completed']);
        }
        return redirect('http://localhost:3000/donation?status=success');
    }

    public function fail(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $donation = Donation::where('transaction_id', $tran_id)->first();
        if ($donation) {
            $donation->update(['status' => 'failed']);
        }
        return redirect('http://localhost:3000/donation?status=fail');
    }

    public function cancel(Request $request)
    {
        $tran_id = $request->input('tran_id');
        $donation = Donation::where('transaction_id', $tran_id)->first();
        if ($donation) {
            $donation->update(['status' => 'failed']);
        }
        return redirect('http://localhost:3000/donation?status=cancel');
    }
}
