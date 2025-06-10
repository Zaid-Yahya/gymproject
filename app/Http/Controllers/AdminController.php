<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Payment;
use App\Models\Subscription;
use App\Models\Discount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Get all users
        $users = User::all();
        
        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }
    
    /**
     * Display all users.
     */
    public function users()
    {
        $users = User::all();
        
        return Inertia::render('Admin/Users', [
            'users' => $users
        ]);
    }

    /**
     * Display all subscriptions.
     */
    public function subscriptions()
    {
        $subscriptions = Subscription::with(['user', 'payments', 'discount'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($subscription) {
                // Calculate additional helpful metrics
                $endDate = Carbon::parse($subscription->end_date);
                $startDate = Carbon::parse($subscription->start_date);
                $now = Carbon::now();
                
                $totalDays = $startDate->diffInDays($endDate);
                $daysRemaining = $now->diffInDays($endDate, false);
                $daysUsed = $totalDays - max(0, $daysRemaining);
                $percentUsed = $totalDays > 0 ? min(100, max(0, round(($daysUsed / $totalDays) * 100))) : 0;
                
                $subscription->total_days = $totalDays;
                $subscription->days_remaining = max(0, $daysRemaining);
                $subscription->days_used = $daysUsed;
                $subscription->percent_used = $percentUsed;
                $subscription->is_expired = $daysRemaining <= 0;
                
                return $subscription;
            });
        
        return Inertia::render('Admin/Subscriptions', [
            'subscriptions' => $subscriptions
        ]);
    }
    
    /**
     * Display all promo codes/discounts.
     */
    public function discounts()
    {
        $discounts = Discount::orderBy('created_at', 'desc')
            ->get()
            ->map(function ($discount) {
                // Add additional helpful properties
                $now = Carbon::now();
                $discount->is_expired = $discount->valid_until && $now > $discount->valid_until;
                $discount->is_future = $now < $discount->valid_from;
                $discount->is_usage_limited = $discount->usage_limit > 0;
                $discount->is_fully_used = $discount->usage_limit && $discount->used_count >= $discount->usage_limit;
                $discount->status = $this->getDiscountStatus($discount);
                
                return $discount;
            });
        
        return Inertia::render('Admin/PromoCodes', [
            'discounts' => $discounts
        ]);
    }
    
    /**
     * Store a new promo code/discount.
     */
    public function storeDiscount(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:discounts,code',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'usage_limit' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);
        
        // Generate a code if not provided
        if (empty($validated['code'])) {
            $validated['code'] = strtoupper(Str::random(8));
        }
        
        // Set default values
        $validated['used_count'] = 0;
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        Discount::create($validated);
        
        return redirect()->route('admin.discounts');
    }
    
    /**
     * Update an existing promo code/discount.
     */
    public function updateDiscount(Request $request, Discount $discount)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:discounts,code,' . $discount->id,
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'usage_limit' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);
        
        $discount->update($validated);
        
        return redirect()->route('admin.discounts');
    }
    
    /**
     * Delete a promo code/discount.
     */
    public function destroyDiscount(Discount $discount)
    {
        // Check if the discount is used by any subscriptions
        if ($discount->subscriptions()->count() > 0) {
            return redirect()->route('admin.discounts')
                ->with('error', 'Cannot delete promo code that is used by subscriptions.');
        }
        
        $discount->delete();
        
        return redirect()->route('admin.discounts')
            ->with('success', 'Promo code deleted successfully.');
    }
    
    /**
     * Get the status of a discount.
     */
    private function getDiscountStatus($discount)
    {
        $now = Carbon::now();
        
        if (!$discount->is_active) {
            return 'inactive';
        }
        
        if ($now < $discount->valid_from) {
            return 'scheduled';
        }
        
        if ($discount->valid_until && $now > $discount->valid_until) {
            return 'expired';
        }
        
        if ($discount->usage_limit && $discount->used_count >= $discount->usage_limit) {
            return 'depleted';
        }
        
        return 'active';
    }

    /**
     * Show the form for creating a new subscription.
     */
    public function createSubscriptionForm()
    {
        $users = User::all();
        $discounts = Discount::all();

        return Inertia::render('Admin/CreateSubscription', [
            'users' => $users,
            'discounts' => $discounts,
        ]);
    }

    /**
     * Create a new subscription for a user.
     */
    public function createSubscription(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_name' => 'required|string|in:Basic,Premium,Elite',
            'period' => 'required|string|in:monthly,quarterly,yearly',
            'original_price' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:0',
            'discount_id' => 'nullable|exists:discounts,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        // Get the tier level for the plan
        $tier = $this->getPlanTier($validated['plan_name']);

        // Create the subscription
        $subscription = Subscription::create([
            'user_id' => $validated['user_id'],
            'plan_name' => $validated['plan_name'],
            'period' => $validated['period'],
            'tier' => $tier,
            'original_price' => $validated['original_price'],
            'price' => $validated['price'],
            'discount_id' => $validated['discount_id'],
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'status' => 'active',
            'is_upgrade' => false,
        ]);

        // Create a payment record for the subscription
        $payment = Payment::create([
            'user_id' => $validated['user_id'],
            'subscription_id' => $subscription->id,
            'amount' => $validated['price'],
            'payment_method' => 'admin_created',
            'transaction_id' => 'ADMIN_' . uniqid(),
            'status' => 'completed',
            'details' => [
                'created_by_admin' => true,
                'admin_id' => auth()->id(),
            ],
        ]);

        return redirect()->route('admin.subscriptions')
            ->with('success', 'Subscription created successfully.');
    }

    /**
     * Get the tier level for a plan.
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

    public function storeSubscription(Request $request)
    {
        $request->validate([
            'user_id' => 'required_without:new_user',
            'new_user' => 'required_without:user_id|array',
            'new_user.name' => 'required_with:new_user|string|max:255',
            'new_user.email' => 'required_with:new_user|email|max:255|unique:users,email',
            'new_user.phone' => 'required_with:new_user|string|max:20',
            'plan_name' => 'required|string|in:Basic,Premium,Elite',
            'period' => 'required|string|in:monthly,quarterly,yearly',
            'price' => 'required|numeric|min:0',
            'original_price' => 'required|numeric|min:0',
            'discount_id' => 'nullable|exists:discounts,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        DB::beginTransaction();
        try {
            // Handle new user creation if needed
            $userId = $request->user_id;
            if ($request->has('new_user')) {
                $user = User::create([
                    'name' => $request->new_user['name'],
                    'email' => $request->new_user['email'],
                    'phone' => $request->new_user['phone'],
                    'password' => Hash::make(Str::random(12)), // Generate random password
                    'role' => 'user',
                ]);
                $userId = $user->id;
            }

            // Create the subscription
            $subscription = Subscription::create([
                'user_id' => $userId,
                'plan_name' => $request->plan_name,
                'period' => $request->period,
                'price' => $request->price,
                'original_price' => $request->original_price,
                'discount_id' => $request->discount_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => 'active',
            ]);

            DB::commit();
            return redirect()->route('admin.subscriptions.index')
                ->with('success', 'Subscription created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create subscription: ' . $e->getMessage()]);
        }
    }
}
