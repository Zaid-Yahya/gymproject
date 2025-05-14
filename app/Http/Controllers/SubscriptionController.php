<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        return Inertia::render('Subscriptions/Index', [
            'subscriptions' => auth()->user()->subscriptions()->with(['payments', 'discount'])->latest()->get(),
            'hasActiveSubscription' => auth()->user()->subscriptions()->where('status', 'active')->exists(),
        ]);
    }

    public function plans()
    {
        $plans = [
            [
                'name' => 'Basic',
                'price' => 49,
                'period' => 'monthly',
                'features' => [
                    'Access during off-peak hours',
                    'Basic fitness assessment',
                    'Standard locker access',
                    'Online workout resources',
                ],
                'popular' => false,
            ],
            [
                'name' => 'Premium',
                'price' => 89,
                'period' => 'monthly',
                'features' => [
                    '24/7 unlimited access',
                    'All group classes included',
                    'Monthly fitness assessment',
                    'One personal training session/month',
                    'Premium locker with amenities',
                ],
                'popular' => true,
            ],
            [
                'name' => 'Elite',
                'price' => 149,
                'period' => 'monthly',
                'features' => [
                    'All Premium features',
                    'Weekly personal training',
                    'Customized nutrition plan',
                    'Priority class booking',
                    'Exclusive member events',
                    'Partner gym access',
                ],
                'popular' => false,
            ],
        ];

        // Check if the user already has an active subscription
        $hasActiveSubscription = auth()->user()->subscriptions()->where('status', 'active')->exists();

        return Inertia::render('Subscriptions/Plans', [
            'plans' => $plans,
            'hasActiveSubscription' => $hasActiveSubscription,
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_name' => 'required|string',
            'original_price' => 'required|numeric',
            'price' => 'required|numeric',
            'discount_id' => 'nullable|exists:discounts,id',
        ]);

        // Create the subscription
        $subscription = auth()->user()->subscriptions()->create([
            'plan_name' => $request->plan_name,
            'original_price' => $request->original_price,
            'price' => $request->price,
            'discount_id' => $request->discount_id,
            'start_date' => now(),
            'end_date' => now()->addMonth(),
            'status' => 'pending',
        ]);

        // If we have a discount, increment its used count
        if ($request->discount_id) {
            $discount = Discount::find($request->discount_id);
            if ($discount) {
                $discount->increment('used_count');
            }
        }

        return redirect()->route('payment.process', $subscription->id);
    }

    public function cancel(Subscription $subscription)
    {
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }

        $subscription->update([
            'status' => 'cancelled',
        ]);

        return redirect()->back()->with('success', 'Subscription cancelled successfully.');
    }

    public function renew(Subscription $subscription)
    {
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }

        if ($subscription->status !== 'active') {
            return redirect()->back()->with('error', 'Only active subscriptions can be renewed.');
        }

        // Create a new pending subscription
        $newSubscription = auth()->user()->subscriptions()->create([
            'plan_name' => $subscription->plan_name,
            'original_price' => $subscription->original_price,
            'price' => $subscription->original_price, // No discount for renewal by default
            'start_date' => $subscription->end_date,
            'end_date' => $subscription->end_date->copy()->addMonth(),
            'status' => 'pending',
        ]);

        return redirect()->route('payment.process', $newSubscription->id);
    }
} 