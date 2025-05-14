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

        // Only allow processing payments for pending subscriptions
        if ($subscription->status !== 'pending') {
            return redirect()->route('subscriptions.index')
                ->with('error', 'This subscription is already processed.');
        }

        // Get available payment methods
        $paymentMethods = [
            [
                'id' => 'credit_card',
                'name' => 'Credit Card',
                'icon' => 'credit-card',
                'description' => 'Pay with Visa, Mastercard, or American Express',
            ],
            [
                'id' => 'paypal',
                'name' => 'PayPal',
                'icon' => 'paypal',
                'description' => 'Fast and secure payment with PayPal',
            ],
            [
                'id' => 'bank_transfer',
                'name' => 'Bank Transfer',
                'icon' => 'bank',
                'description' => 'Direct transfer from your bank account',
            ],
        ];

        return Inertia::render('Payments/Process', [
            'subscription' => $subscription->load('discount'),
            'paymentMethods' => $paymentMethods,
        ]);
    }

    public function store(Request $request, Subscription $subscription)
    {
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }

        if ($subscription->status !== 'pending') {
            return redirect()->route('subscriptions.index')
                ->with('error', 'This subscription is already processed.');
        }

        $request->validate([
            'payment_method' => 'required|string',
            'card_number' => 'required_if:payment_method,credit_card',
            'card_expiry' => 'required_if:payment_method,credit_card',
            'card_cvc' => 'required_if:payment_method,credit_card',
        ]);

        try {
            // This is a simulated payment process (no real payment gateway)
            // In a real application, you would integrate with Stripe, PayPal, etc.
            
            // Generate a fake transaction ID for demo purposes
            $transactionId = 'TRANS_' . uniqid() . '_' . strtoupper(substr(md5($subscription->id . time()), 0, 8));
            
            // Create the payment record
            $payment = $subscription->payments()->create([
                'user_id' => auth()->id(),
                'amount' => $subscription->price,
                'payment_method' => $request->payment_method,
                'status' => 'completed',
                'transaction_id' => $transactionId,
            ]);

            // Activate the subscription
            $subscription->update(['status' => 'active']);

            return redirect()->route('subscriptions.index')
                ->with('success', 'Payment processed successfully! Your subscription is now active.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Payment failed. Please try again or contact support.');
        }
    }
} 