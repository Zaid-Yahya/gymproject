<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\UserSubscription;
use Illuminate\Http\Request;

class AdminSubscriptionController extends Controller
{
    public function index()
    {
        $userSubscriptions = UserSubscription::with('subscription')->latest()->paginate(10);
        return view('admin.subscriptions.index', compact('userSubscriptions'));
    }

    public function create()
    {
        $subscriptions = Subscription::all();
        return view('admin.subscriptions.create', compact('subscriptions'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone_number' => 'nullable|string|max:20',
            'subscription_id' => 'required|exists:subscriptions,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $subscription = Subscription::findOrFail($request->subscription_id);

        // Create payment record
        $payment = Payment::create([
            'user_id' => null,
            'subscription_id' => $subscription->id,
            'amount' => $subscription->price,
            'payment_method' => 'admin_created',
            'transaction_id' => 'ADMIN_' . uniqid(),
            'status' => 'completed',
            'details' => [
                'created_by_admin' => true,
                'admin_id' => auth()->id()
            ]
        ]);

        // Create user subscription
        UserSubscription::create([
            'name' => $request->name,
            'email' => $request->email,
            'phone_number' => $request->phone_number,
            'subscription_id' => $subscription->id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'status' => 'active',
            'is_active' => true
        ]);

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription created successfully.');
    }
} 