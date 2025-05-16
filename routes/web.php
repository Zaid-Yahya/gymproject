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

Route::get('/', function () {
    $comments = Comment::with('user')
        ->where('is_approved', true)
        ->latest()
        ->take(10)
        ->get();

    return Inertia::render('Home', [
        'comments' => $comments
    ]);
})->name('home');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    // Subscription routes
    Route::get('/subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
    Route::get('/subscriptions/plans', [SubscriptionController::class, 'plans'])->name('subscriptions.plans');
    Route::post('/subscriptions/subscribe', [SubscriptionController::class, 'subscribe'])->name('subscriptions.subscribe');
    Route::post('/subscriptions/{subscription}/cancel', [SubscriptionController::class, 'cancel'])->name('subscriptions.cancel');
    Route::post('/subscriptions/{subscription}/renew', [SubscriptionController::class, 'renew'])->name('subscriptions.renew');

    // Payment routes
    Route::get('/payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::get('/payments/{subscription}/process', [PaymentController::class, 'process'])->name('payment.process');
    Route::post('/payments/{subscription}', [PaymentController::class, 'store'])->name('payment.store');

    // Discount routes
    Route::get('/discounts', [DiscountController::class, 'index'])->name('discounts.index');
    Route::get('/discounts/create', [DiscountController::class, 'create'])->name('discounts.create');
    Route::post('/discounts', [DiscountController::class, 'store'])->name('discounts.store');
    Route::get('/discounts/{discount}/edit', [DiscountController::class, 'edit'])->name('discounts.edit');
    Route::put('/discounts/{discount}', [DiscountController::class, 'update'])->name('discounts.update');
    Route::delete('/discounts/{discount}', [DiscountController::class, 'destroy'])->name('discounts.destroy');
    Route::post('/discounts/validate', [DiscountController::class, 'validateCode'])->name('discounts.validate');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin routes
    Route::get('/admin', [App\Http\Controllers\AdminController::class, 'index'])->name('admin.index');

    // Comment routes
    Route::post('/comments', [CommentController::class, 'store'])->name('comments.store');
    Route::post('/comments/{comment}/approve', [CommentController::class, 'approve'])->name('comments.approve')->middleware('admin');
    Route::delete('/comments/{comment}', [CommentController::class, 'destroy'])->name('comments.destroy')->middleware('admin');
});

Route::get('/bmi-calculator', function () {
    return Inertia::render('BmiCalculator');
})->name('bmi.calculator');

require __DIR__.'/auth.php';
