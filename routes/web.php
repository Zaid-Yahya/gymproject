<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\CommentController;
use App\Models\Comment;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ReservationController;

Route::get('/', function () {
    // If an authenticated user is an admin, redirect them to the admin dashboard
    if (auth()->check() && auth()->user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    }

    $comments = Comment::with('user')
        ->where('is_approved', true)
        ->latest()
        ->take(10)
        ->get();
        
    $data = [
        'comments' => $comments
    ];
    
    // Add subscription info for authenticated users
    if (auth()->check()) {
        $subscriptionController = app(SubscriptionController::class);
        $activeSubscription = auth()->user()->subscriptions()
            ->where('status', 'active')
            ->latest()
            ->first();
            
        $data['activeSubscription'] = $activeSubscription;
        $data['hasActiveSubscription'] = !is_null($activeSubscription);
        
        // If subscription exists, add remaining days info
        if ($activeSubscription) {
            $endDate = \Carbon\Carbon::parse($activeSubscription->end_date);
            $daysRemaining = now()->diffInDays($endDate);
            $activeSubscription->remaining_days = $daysRemaining;
            
            // Calculate percentage of subscription used
            $totalDays = \Carbon\Carbon::parse($activeSubscription->start_date)->diffInDays($endDate);
            $percentUsed = ($totalDays - $daysRemaining) / max(1, $totalDays) * 100;
            $activeSubscription->percent_used = min(100, max(0, round($percentUsed)));
        }
    }

    return Inertia::render('Home', $data);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    // Admin routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
        Route::get('/subscriptions', [AdminController::class, 'subscriptions'])->name('subscriptions');
        Route::get('/subscriptions/create', [AdminController::class, 'createSubscriptionForm'])->name('subscriptions.create');
        Route::post('/subscriptions/store', [AdminController::class, 'storeSubscription'])->name('subscriptions.store');
        Route::delete('/subscriptions/{subscription}', [AdminController::class, 'destroySubscription'])->name('subscriptions.destroy');
        Route::get('/payments', [AdminController::class, 'payments'])->name('payments');
        Route::get('/discounts', [AdminController::class, 'discounts'])->name('discounts');
        Route::get('/statistics', [AdminController::class, 'renderStatisticsPage'])->name('statistics');
        Route::get('/profile', [AdminController::class, 'profile'])->name('profile');
        Route::post('/profile', [AdminController::class, 'updateProfile'])->name('profile.update');
    });

    // New API route for statistics data
    Route::get('/api/admin/statistics', [AdminController::class, 'getStatisticsData'])->middleware('admin');

    // Subscription routes
    Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('/subscriptions/plans', [SubscriptionController::class, 'plans'])->name('subscriptions.plans');
    Route::post('/subscriptions/create-pending', [SubscriptionController::class, 'createPendingSubscription'])->name('subscriptions.createPending');
    Route::post('/subscriptions/complete/{subscription}', [SubscriptionController::class, 'completeSubscription'])->name('subscriptions.complete');
    Route::post('/subscriptions/upgrade', [SubscriptionController::class, 'upgrade'])->name('subscriptions.upgrade');
    Route::post('/subscriptions/{subscription}/cancel', [SubscriptionController::class, 'cancel'])->name('subscriptions.cancel');

    // Payment routes
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/{subscription}/process', [PaymentController::class, 'process'])->name('payment.process');
    Route::post('/payments/{subscription}', [PaymentController::class, 'store'])->name('payment.store');
    Route::post('/payments/{subscription}/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Comment routes
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::post('/comments/{comment}/approve', [CommentController::class, 'approve'])->name('comments.approve')->middleware('admin');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy')->middleware('admin');

    // Reservation routes
    Route::get('/reservations/create', [ReservationController::class, 'create'])->name('reservations.create');
    Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');
});

// --- Temporarily unprotected routes for testing promo code management ---
Route::get('/discounts', [DiscountController::class, 'index'])->name('discounts.index');
Route::post('/discounts', [DiscountController::class, 'store'])->name('discounts.store');
Route::delete('/discounts/{discount}', [DiscountController::class, 'destroy'])->name('discounts.destroy');

Route::get('/bmi-calculator', function () {
    return Inertia::render('BmiCalculator');
})->name('bmi.calculator');

require __DIR__.'/auth.php';
