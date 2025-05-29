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

        $paymentContext = $subscription->is_upgrade ? 'upgrade' : 'new subscription';

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
            'paymentContext' => $paymentContext,
            'isUpgrade' => $subscription->is_upgrade,
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

            // Call the SubscriptionController to complete the subscription
            $subscriptionController = app(SubscriptionController::class);
            
            return $subscriptionController->completeSubscription(
                $subscription, 
                new Request([
                    'payment_success' => true,
                    'payment_id' => $transactionId,
                ])
            );
            
        } catch (\Exception $e) {
            // Log the error
            \Log::error('Payment processing failed: ' . $e->getMessage());
            
            // Mark the subscription as failed
            $subscription->update(['status' => 'failed']);
            
            return redirect()->back()
                ->with('error', 'Payment failed. Please try again or contact support.');
        }
    }
    
    public function cancel(Subscription $subscription)
    {
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }
        
        if ($subscription->status !== 'pending') {
            return redirect()->route('subscriptions.index')
                ->with('error', 'Only pending subscriptions can be cancelled.');
        }
        
        $subscription->update(['status' => 'cancelled']);
        
        return redirect()->route('subscriptions.plans')
            ->with('success', 'Your subscription process has been cancelled.');
    }
} 