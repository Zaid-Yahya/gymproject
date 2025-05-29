<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use App\Models\Subscription;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;

class SubscriptionController extends Controller
{
    public function index()
    {
        return Inertia::render('Subscriptions/Index', [
            'subscriptions' => auth()->user()->subscriptions()->with(['payments', 'discount'])->latest()->get(),
            'activeSubscription' => $this->getActiveSubscription(),
            'hasActiveSubscription' => $this->userHasActiveSubscription(),
        ]);
    }

    public function plans()
    {
        $plans = $this->getPlans();
        $activeSubscription = $this->getActiveSubscription();
        $hasActiveSubscription = !is_null($activeSubscription);
        $canUpgrade = false;
        $upgradablePlans = [];
        
        // If user has an active subscription, check if they can upgrade
        if ($hasActiveSubscription) {
            // Only allow upgrade if not already on Elite plan
            if ($activeSubscription->plan_name !== 'Elite') {
                $canUpgrade = true;
                
                // Calculate days remaining in current subscription
                $endDate = Carbon::parse($activeSubscription->end_date);
                $daysRemaining = now()->diffInDays($endDate);
                
                // Add the remaining days info to the active subscription
                $activeSubscription->remaining_days = $daysRemaining;
                
                // Find upgradable plans (higher tier than current)
                $upgradablePlans = $this->calculateUpgradePlans($activeSubscription);
            }
        }
        
        return Inertia::render('Subscriptions/Plans', [
            'plans' => $plans,
            'hasActiveSubscription' => $hasActiveSubscription,
            'activeSubscription' => $activeSubscription,
            'canUpgrade' => $canUpgrade,
            'upgradablePlans' => $upgradablePlans,
        ]);
    }
    
    /**
     * Create a pending subscription that will be activated after payment
     */
    public function createPendingSubscription(Request $request)
    {
        $request->validate([
            'plan_name' => 'required|string',
            'period' => 'required|string|in:monthly,quarterly,yearly',
            'original_price' => 'required|numeric',
            'price' => 'required|numeric',
            'discount_id' => 'nullable|exists:discounts,id',
            'is_upgrade' => 'required|boolean',
        ]);

        // Check if user already has an active subscription and is not upgrading
        if (!$request->is_upgrade && $this->userHasActiveSubscription()) {
            // If user is trying to create a new subscription while having an active one
            return response()->json([
                'success' => false,
                'message' => 'You already have an active subscription. Please upgrade your existing subscription instead.',
            ], 400);
        }
        
        // For upgrades, validate that the user has an active subscription
        if ($request->is_upgrade) {
            $activeSubscription = $this->getActiveSubscription();
            
            if (!$activeSubscription) {
                return response()->json([
                    'success' => false,
                    'message' => 'No active subscription found to upgrade.',
                ], 400);
            }
            
            // Get the tier level to ensure it's an upgrade
            $currentTier = $this->getPlanTier($activeSubscription->plan_name);
            $newTier = $this->getPlanTier($request->plan_name);
            
            if ($newTier <= $currentTier) {
                return response()->json([
                    'success' => false,
                    'message' => 'The selected plan is not an upgrade from your current plan.',
                ], 400);
            }
        }
        
        try {
            // Get duration in months based on period
            $duration = $this->getPeriodDuration($request->period);
            
            // Create a pending subscription
            $subscription = auth()->user()->subscriptions()->create([
                'plan_name' => $request->plan_name,
                'period' => $request->period,
                'tier' => $this->getPlanTier($request->plan_name),
                'original_price' => $request->original_price,
                'price' => $request->price,
                'discount_id' => $request->discount_id,
                'start_date' => now(),
                'end_date' => now()->addMonths($duration),
                'status' => 'pending',
                'is_upgrade' => $request->is_upgrade,
            ]);
            
            // If this is an upgrade, link it to the current active subscription
            if ($request->is_upgrade) {
                $activeSubscription = $this->getActiveSubscription();
                $activeSubscription->upgraded_to = $subscription->id;
                $activeSubscription->save();
            }
            
            // Generate the payment process URL
            $redirectUrl = route('payment.process', $subscription->id);
            
            return response()->json([
                'success' => true,
                'subscription_id' => $subscription->id,
                'redirect_url' => $redirectUrl,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create subscription: ' . $e->getMessage(),
            ], 500);
        }
    }
    
    /**
     * Complete a subscription after successful payment
     */
    public function completeSubscription(Subscription $subscription, Request $request)
    {
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }
        
        if ($subscription->status !== 'pending') {
            return redirect()->route('subscriptions.index')
                ->with('error', 'This subscription is already processed.');
        }
        
        // Validate payment was successful
        $request->validate([
            'payment_success' => 'required|boolean',
            'payment_id' => 'required|string',
        ]);
        
        if (!$request->payment_success) {
            $subscription->update(['status' => 'failed']);
            return redirect()->route('subscriptions.plans')
                ->with('error', 'Payment was not successful. Please try again.');
        }
        
        // Start a transaction to ensure all operations are completed successfully
        \DB::beginTransaction();
        
        try {
            // Create payment record
            $payment = $subscription->payments()->create([
                'user_id' => auth()->id(),
                'amount' => $subscription->price,
                'payment_method' => $request->input('payment_method', 'credit_card'),
                'transaction_id' => $request->payment_id,
                'status' => 'completed',
            ]);
            
            // If this is an upgrade, handle the previous subscription
            if ($subscription->is_upgrade) {
                // Find the previous subscription that is being upgraded
                $previousSubscription = auth()->user()
                    ->subscriptions()
                    ->where('upgraded_to', $subscription->id)
                    ->where('status', 'active')
                    ->first();
                
                if ($previousSubscription) {
                    // Cancel the previous subscription
                    $previousSubscription->update([
                        'status' => 'cancelled',
                        'cancelled_at' => now(),
                    ]);
                }
            }
            
            // Activate the new subscription
            $subscription->update(['status' => 'active']);
            
            \DB::commit();
            
            return redirect()->route('subscriptions.index')
                ->with('success', 'Your subscription has been activated successfully!');
        } catch (\Exception $e) {
            \DB::rollBack();
            
            // Log the error
            \Log::error('Subscription completion failed: ' . $e->getMessage());
            
            return redirect()->route('subscriptions.plans')
                ->with('error', 'An error occurred while activating your subscription. Please try again or contact support.');
        }
    }
    
    /**
     * Calculate upgrade prices for available plans
     */
    private function calculateUpgradePlans($currentSubscription)
    {
        $allPlans = $this->getPlans();
        $upgradablePlans = [];
        
        // Current plan details
        $currentTier = $this->getPlanTier($currentSubscription->plan_name);
        $currentEndDate = Carbon::parse($currentSubscription->end_date);
        $daysRemaining = now()->diffInDays($currentEndDate);
        $totalDays = Carbon::parse($currentSubscription->start_date)->diffInDays($currentEndDate);
        $remainingRatio = $daysRemaining / max(1, $totalDays);
        
        // Current value of remaining subscription
        $remainingValue = $currentSubscription->price * $remainingRatio;
        
        // Filter plans with higher tier than current plan
        foreach ($allPlans as $plan) {
            $planTier = $this->getPlanTier($plan['name']);
            
            // Only include higher tier plans with same period
            if ($planTier > $currentTier && $plan['period'] === $currentSubscription->period) {
                // Calculate upgrade cost: full new plan price minus the prorated value of the remaining current subscription
                $upgradeCost = round($plan['price'] - $remainingValue, 2);
                
                // Ensure upgrade cost is at least 50% of the price difference
                $minUpgradeCost = ($plan['price'] - $currentSubscription->original_price) * 0.5;
                $upgradeCost = max($minUpgradeCost, $upgradeCost);
                
                // Copy the plan and add upgrade cost
                $upgradePlan = $plan;
                $upgradePlan['upgrade_cost'] = max(0, round($upgradeCost, 2));
                $upgradablePlans[] = $upgradePlan;
            }
        }
        
        return $upgradablePlans;
    }

    /**
     * Cancel a pending subscription
     */
    public function cancel(Subscription $subscription)
    {
        if ($subscription->user_id !== auth()->id()) {
            abort(403);
        }
        
        if ($subscription->status === 'pending') {
            $subscription->update(['status' => 'cancelled']);
            return redirect()->route('subscriptions.plans')
                ->with('success', 'Subscription has been cancelled.');
        } elseif ($subscription->status === 'active') {
            $subscription->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
            ]);
            return redirect()->route('subscriptions.index')
                ->with('success', 'Your subscription has been cancelled and will end on the scheduled end date.');
        }
        
        return redirect()->route('subscriptions.index')
            ->with('error', 'This subscription cannot be cancelled.');
    }
    
    /**
     * Check if user has an active subscription
     */
    private function userHasActiveSubscription()
    {
        return auth()->user()->subscriptions()->where('status', 'active')->exists();
    }
    
    /**
     * Get the user's active subscription
     */
    private function getActiveSubscription()
    {
        return auth()->user()->subscriptions()->where('status', 'active')->latest()->first();
    }
    
    /**
     * Get the tier level for a plan
     */
    private function getPlanTier($planName)
    {
        $tiers = [
            'Basic' => 1,
            'Premium' => 2,
            'Elite' => 3
        ];
        
        return $tiers[$planName] ?? 1;
    }
    
    /**
     * Get duration in months based on period
     */
    private function getPeriodDuration($period)
    {
        switch ($period) {
            case 'monthly':
                return 1;
            case 'quarterly':
                return 3;
            case 'yearly':
                return 12;
            default:
                return 1;
        }
    }
    
    /**
     * Get all available plans
     */
    private function getPlans()
    {
        $plans = [
            // Monthly plans
            [
                'name' => 'Basic',
                'price' => 49,
                'period' => 'monthly',
                'duration' => 1, // months
                'features' => [
                    'Access during off-peak hours',
                    'Basic fitness assessment',
                    'Standard locker access',
                    'Online workout resources',
                ],
                'popular' => false,
                'tier' => 1,
            ],
            [
                'name' => 'Premium',
                'price' => 89,
                'period' => 'monthly',
                'duration' => 1, // months
                'features' => [
                    'Unlimited 24/7 access',
                    'Comprehensive fitness assessment',
                    'Premium locker with towel service',
                    'Group fitness classes',
                    'One-on-one trainer session monthly',
                ],
                'popular' => true,
                'tier' => 2,
            ],
            [
                'name' => 'Elite',
                'price' => 129,
                'period' => 'monthly',
                'duration' => 1, // months
                'features' => [
                    'All Premium features',
                    'Four personal training sessions monthly',
                    'Nutrition consultation',
                    'Recovery amenities access (sauna, spa)',
                    'Monthly InBody scan',
                    'Discounts on merchandise',
                ],
                'popular' => false,
                'tier' => 3,
            ],
            
            // Quarterly plans (3 months)
            [
                'name' => 'Basic',
                'price' => 132,
                'period' => 'quarterly',
                'duration' => 3, // months
                'features' => [
                    'Access during off-peak hours',
                    'Basic fitness assessment',
                    'Standard locker access',
                    'Online workout resources',
                ],
                'popular' => false,
                'tier' => 1,
                'savings' => 'Save 10% vs monthly',
            ],
            [
                'name' => 'Premium',
                'price' => 240,
                'period' => 'quarterly',
                'duration' => 3, // months
                'features' => [
                    'Unlimited 24/7 access',
                    'Comprehensive fitness assessment',
                    'Premium locker with towel service',
                    'Group fitness classes',
                    'One-on-one trainer session monthly',
                ],
                'popular' => true,
                'tier' => 2,
                'savings' => 'Save 10% vs monthly',
            ],
            [
                'name' => 'Elite',
                'price' => 348,
                'period' => 'quarterly',
                'duration' => 3, // months
                'features' => [
                    'All Premium features',
                    'Four personal training sessions monthly',
                    'Nutrition consultation',
                    'Recovery amenities access (sauna, spa)',
                    'Monthly InBody scan',
                    'Discounts on merchandise',
                ],
                'popular' => false,
                'tier' => 3,
                'savings' => 'Save 10% vs monthly',
            ],
            
            // Yearly plans (12 months)
            [
                'name' => 'Basic',
                'price' => 470,
                'period' => 'yearly',
                'duration' => 12, // months
                'features' => [
                    'Access during off-peak hours',
                    'Basic fitness assessment',
                    'Standard locker access',
                    'Online workout resources',
                ],
                'popular' => false,
                'tier' => 1,
                'savings' => 'Save 20% vs monthly',
            ],
            [
                'name' => 'Premium',
                'price' => 853,
                'period' => 'yearly',
                'duration' => 12, // months
                'features' => [
                    'Unlimited 24/7 access',
                    'Comprehensive fitness assessment',
                    'Premium locker with towel service',
                    'Group fitness classes',
                    'One-on-one trainer session monthly',
                ],
                'popular' => true,
                'tier' => 2,
                'savings' => 'Save 20% vs monthly',
            ],
            [
                'name' => 'Elite',
                'price' => 1238,
                'period' => 'yearly',
                'duration' => 12, // months
                'features' => [
                    'All Premium features',
                    'Four personal training sessions monthly',
                    'Nutrition consultation',
                    'Recovery amenities access (sauna, spa)',
                    'Monthly InBody scan',
                    'Discounts on merchandise',
                ],
                'popular' => false,
                'tier' => 3,
                'savings' => 'Save 20% vs monthly',
            ],
        ];
        
        return $plans;
    }
} 