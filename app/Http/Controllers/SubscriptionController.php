<?php

namespace App\Http\Controllers;

use App\Models\Subscription;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionController extends Controller
{
    public function index()
    {
        return Inertia::render('Subscriptions/Index', [
            'subscriptions' => auth()->user()->subscriptions()->with('payments')->latest()->get(),
        ]);
    }

    public function plans()
    {
        $plans = [
            [
                'name' => 'Basic',
                'price' => 299,
                'duration' => '1 month',
                'features' => [
                    'Access to gym equipment',
                    'Basic fitness assessment',
                    'Locker room access',
                ],
            ],
            [
                'name' => 'Premium',
                'price' => 499,
                'duration' => '1 month',
                'features' => [
                    'All Basic features',
                    'Group classes included',
                    'Personal trainer (2 sessions)',
                    'Nutrition consultation',
                ],
            ],
            [
                'name' => 'Elite',
                'price' => 799,
                'duration' => '1 month',
                'features' => [
                    'All Premium features',
                    'Unlimited personal training',
                    'Premium locker',
                    'Spa access',
                    'Nutrition plan',
                ],
            ],
        ];

        return Inertia::render('Subscriptions/Plans', [
            'plans' => $plans,
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_name' => 'required|string',
            'price' => 'required|numeric',
        ]);

        $subscription = auth()->user()->subscriptions()->create([
            'plan_name' => $request->plan_name,
            'price' => $request->price,
            'start_date' => now(),
            'end_date' => now()->addMonth(),
            'status' => 'pending',
        ]);

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
} 