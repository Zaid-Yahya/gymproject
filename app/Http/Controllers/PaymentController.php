<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        return Inertia::render('Payments/Index', [
            'payments' => auth()->user()->payments()->with('subscription')->latest()->get(),
        ]);
    }

    public function process(Subscription $subscription)
    {
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Payments/Process', [
            'subscription' => $subscription,
            'intent' => auth()->user()->createSetupIntent(),
        ]);
    }

    public function store(Request $request, Subscription $subscription)
    {
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'payment_method' => 'required|string',
        ]);

        try {
            // Process payment with Stripe (you'll need to set up Stripe integration)
            $payment = $subscription->payments()->create([
                'user_id' => auth()->id(),
                'amount' => $subscription->price,
                'payment_method' => $request->payment_method,
                'status' => 'completed',
                'transaction_id' => 'test_' . uniqid(), // Replace with actual Stripe transaction ID
            ]);

            $subscription->update(['status' => 'active']);

            return redirect()->route('subscriptions.index')
                ->with('success', 'Payment processed successfully.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Payment failed. Please try again.');
        }
    }
} 