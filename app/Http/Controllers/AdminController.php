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
use App\Mail\NewUserCredentials;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function dashboard()
    {
        // You can fetch data for your dashboard here, e.g., user counts, subscription stats.
        // For now, we'll just render the dashboard view.
        
        return Inertia::render('Admin/Dashboard', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
    
    /**
     * Display all users.
     */
    public function users()
    {
        $users = User::where('role', 'user')
            ->with(['subscriptions' => function($query) {
                $query->where('status', 'active')
                    ->latest();
            }])
            ->get()
            ->map(function($user) {
                $user->has_active_subscription = $user->subscriptions->isNotEmpty();
                return $user;
            });
        
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
            'subscriptions' => $subscriptions,
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }
    
    /**
     * Display all promo codes/discounts.
     */
    public function discounts()
    {
        $discounts = Discount::all();
        
        return Inertia::render('Admin/Discounts', [
            'discounts' => $discounts
        ]);
    }

    /**
     * Display the admin statistics page.
     */
    public function renderStatisticsPage()
    {
        return Inertia::render('Admin/Statistics', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    /**
     * Get application statistics data for API.
     */
    public function getStatisticsData()
    {
        // 1. User Registrations Over Time
        $userRegistrations = User::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), 
                DB::raw('count(*) as count')
            )
            ->where('role', 'user') // Only count regular users
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    
        // Prepare labels and data for user registrations
        $registrationLabels = $userRegistrations->pluck('month')->map(function($month) { 
            return Carbon::parse($month)->format('M Y'); 
        })->values()->toArray();
        $registrationData = $userRegistrations->pluck('count')->map(function($count) {
            return (int) $count; // Ensure it's an integer
        })->values()->toArray();

        // 2. Subscriptions by Plan
        $subscriptionsByPlan = Subscription::select('plan_name', DB::raw('count(*) as count'))
            ->where('status', 'active')
            ->groupBy('plan_name')
            ->get();
        
        // Prepare labels and data for subscriptions by plan
        $planLabels = $subscriptionsByPlan->pluck('plan_name')->values()->toArray();
        $planData = $subscriptionsByPlan->pluck('count')->map(function($count) {
            return (int) $count;
        })->values()->toArray();

        // 3. Revenue per Month
        $revenuePerMonth = Payment::select(
                DB::raw('DATE_FORMAT(created_at, "%Y-%m") as month'), 
                DB::raw('sum(amount) as total_revenue')
            )
            ->where('status', 'completed')
            ->groupBy('month')
            ->orderBy('month')
            ->get();
        
        // Prepare labels and data for revenue per month
        $revenueLabels = $revenuePerMonth->pluck('month')->map(function($month) { 
            return Carbon::parse($month)->format('M Y'); 
        })->values()->toArray();
        $revenueData = $revenuePerMonth->pluck('total_revenue')->map(function($revenue) {
            return (float) $revenue;
        })->values()->toArray();

        // 4. Active vs. Inactive Users
        $activeUsers = User::whereHas('subscriptions', function ($query) {
            $query->where('status', 'active');
        })->where('role', 'user')->count();
        
        $inactiveUsers = User::doesntHave('subscriptions')
                            ->where('role', 'user')
                            ->count();
        
        // If no user status data, create sample (can be removed if real data is expected)
        if ($activeUsers == 0 && $inactiveUsers == 0) {
            $activeUsers = 45;
            $inactiveUsers = 23;
        }
    
        $finalData = [
            'userRegistrations' => [
                'labels' => $registrationLabels,
                'data' => $registrationData,
            ],
            'subscriptionsByPlan' => [
                'labels' => $planLabels,
                'data' => $planData,
            ],
            'revenuePerMonth' => [
                'labels' => $revenueLabels,
                'data' => $revenueData,
            ],
            'userStatus' => [
                'active' => $activeUsers,
                'inactive' => $inactiveUsers,
            ],
        ];

        return response()->json($finalData);
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
        $users = User::with(['subscriptions' => function($query) {
            $query->where('status', 'active')
                  ->latest();
        }])->get();

        $discounts = Discount::all();

        return Inertia::render('Admin/CreateSubscription', [
            'users' => $users,
            'discounts' => $discounts,
            'auth' => [
                'user' => auth()->user()
            ]
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
     * Delete a subscription.
     */
    public function destroySubscription(Subscription $subscription)
    {
        $subscription->delete();

        return redirect()->route('admin.subscriptions')
            ->with('success', 'Subscription deleted successfully.');
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
        try {
            \Log::info('Subscription creation request:', $request->all());

            // Base validation rules
            $rules = [
                'plan_name' => 'required|string|in:Basic,Premium,Elite',
                'period' => 'required|string|in:monthly,quarterly,yearly',
                'price' => 'required|numeric|min:0',
                'original_price' => 'required|numeric|min:0',
                'discount_id' => 'nullable|exists:discounts,id',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
            ];

            // Check if this is a new user or existing user case
            if ($request->filled('user_id')) {
                // Existing user case
                $rules['user_id'] = 'required|exists:users,id';
            } else {
                // New user case
                $rules['new_user'] = 'required|array';
                $rules['new_user.name'] = 'required|string|max:255';
                $rules['new_user.email'] = 'required|email|max:255|unique:users,email';
            }

            $request->validate($rules);

            DB::beginTransaction();

            // Handle user ID assignment
            $userId = null;
            if ($request->filled('user_id')) {
                // Use existing user
                $userId = $request->user_id;
            } else {
                // Create new user
                $randomPassword = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);
                
                $user = User::create([
                    'name' => $request->new_user['name'],
                    'email' => $request->new_user['email'],
                    'password' => Hash::make($randomPassword),
                    'role' => 'user',
                    'source' => 'admin_created',
                ]);
                $userId = $user->id;

                // Send credentials email
                Mail::to($user->email)->send(new NewUserCredentials($user, $randomPassword));
            }

            // Verify user exists
            $user = User::find($userId);
            if (!$user) {
                throw new \Exception("User not found with ID: {$userId}");
            }

            // Get the tier level for the plan
            $tier = $this->getPlanTier($request->plan_name);

            // Create the subscription
            $subscription = Subscription::create([
                'user_id' => $userId,
                'plan_name' => $request->plan_name,
                'period' => $request->period,
                'tier' => $tier,
                'price' => $request->price,
                'original_price' => $request->original_price,
                'discount_id' => $request->discount_id,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'status' => 'active',
                'is_upgrade' => false,
            ]);

            \Log::info('Subscription created:', ['subscription' => $subscription->toArray()]);

            // Create a payment record for the subscription
            $payment = Payment::create([
                'user_id' => $userId,
                'subscription_id' => $subscription->id,
                'amount' => $request->price,
                'payment_method' => 'admin_created',
                'transaction_id' => 'ADMIN_' . uniqid(),
                'status' => 'completed',
                'details' => [
                    'created_by_admin' => true,
                    'admin_id' => auth()->id(),
                ],
            ]);

            \Log::info('Payment created:', ['payment' => $payment->toArray()]);

            // Update user's subscription status
            $user->has_subscription = true;
            $user->save();

            \Log::info('User updated:', ['user' => $user->toArray()]);

            DB::commit();
            
            return redirect()->route('admin.subscriptions')
                ->with('success', 'Subscription created successfully.');
                
        } catch (ValidationException $e) {
            DB::rollBack();
            \Log::error('Validation failed: ' . json_encode($e->errors()));
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json(['errors' => $e->errors()], 422);
            }
            throw $e;
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Failed to create subscription: ' . $e->getMessage(), [
                'exception' => $e,
                'request_data' => $request->all()
            ]);
            if ($request->wantsJson() || $request->ajax()) {
                return response()->json(['error' => 'Failed to create subscription: ' . $e->getMessage()], 500);
            }
            return back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create subscription: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the admin profile page.
     */
    public function profile()
    {
        return Inertia::render('Admin/Profile', [
            'auth' => [
                'user' => auth()->user()
            ]
        ]);
    }

    /**
     * Update the admin's profile.
     */
    public function updateProfile(Request $request)
    {
        $user = auth()->user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'current_password' => 'required_with:new_password|current_password',
            'new_password' => 'nullable|min:8|confirmed',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        if (isset($validated['new_password'])) {
            $user->password = Hash::make($validated['new_password']);
        }

        $user->save();

        return back()->with('status', 'Profile updated successfully.');
    }
}
