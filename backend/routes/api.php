<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SurahController;

use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:api')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    
    // Admin Routes
    Route::get('/admin/stats', [App\Http\Controllers\AdminController::class, 'stats']);
    
    // Admin Management Routes
    Route::get('/admin/donations', [App\Http\Controllers\AdminController::class, 'getDonations']);
    Route::get('/admin/leaders', [App\Http\Controllers\AdminController::class, 'getLeaders']);
    Route::post('/admin/leaders', [App\Http\Controllers\AdminController::class, 'storeLeader']);
    Route::put('/admin/leaders/{id}', [App\Http\Controllers\AdminController::class, 'updateLeader']);
    Route::delete('/admin/leaders/{id}', [App\Http\Controllers\AdminController::class, 'destroyLeader']);
    Route::get('/admin/subscriptions', [App\Http\Controllers\AdminController::class, 'getSubscriptions']);
    Route::get('/admin/messages', [App\Http\Controllers\AdminController::class, 'getMessages']);
    Route::get('/admin/marriage-profiles', [App\Http\Controllers\AdminController::class, 'getMarriageProfiles']);
    Route::delete('/admin/marriage-profiles/{id}', [App\Http\Controllers\AdminController::class, 'destroyMarriageProfile']);
    
    // Subscription Routes
    Route::get('/plans', [App\Http\Controllers\SubscriptionController::class, 'plans']);
    Route::post('/subscribe', [App\Http\Controllers\SubscriptionController::class, 'subscribe']);
    Route::get('/subscription/status', [App\Http\Controllers\SubscriptionController::class, 'status']);

    // Reading Progress Routes
    Route::get('/reading-progress', [App\Http\Controllers\ReadingProgressController::class, 'index']);
    Route::post('/reading-progress', [App\Http\Controllers\ReadingProgressController::class, 'store']);
    Route::post('/reading-progress', [App\Http\Controllers\ReadingProgressController::class, 'store']);

    // Marriage Profile Routes
    Route::get('/marriage-profiles/me', [App\Http\Controllers\MarriageProfileController::class, 'myProfile']);
    Route::post('/marriage-profiles', [App\Http\Controllers\MarriageProfileController::class, 'store']);
});

Route::get('/marriage-profiles', [App\Http\Controllers\MarriageProfileController::class, 'index']);
Route::get('/marriage-profiles/{id}', [App\Http\Controllers\MarriageProfileController::class, 'show']);

Route::get('/marriage-profiles/{id}', [App\Http\Controllers\MarriageProfileController::class, 'show']);

Route::get('/leaders', [App\Http\Controllers\LeaderController::class, 'index']);
Route::get('/leaders/{id}', [App\Http\Controllers\LeaderController::class, 'show']);

Route::get('/leaders/{id}', [App\Http\Controllers\LeaderController::class, 'show']);

Route::post('/contact', [App\Http\Controllers\ContactController::class, 'store']);

Route::get('/advertisements', [App\Http\Controllers\AdvertisementController::class, 'index']);

Route::post('/donate', [App\Http\Controllers\DonationController::class, 'store']); // Public route for now

Route::get('/surahs', [SurahController::class, 'index']);

Route::middleware(['subscribed'])->group(function () {
    Route::get('/surahs/{surah}', [SurahController::class, 'show']);
});
