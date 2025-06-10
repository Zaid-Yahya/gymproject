<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DiscountController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        // $this->authorize('viewAny', Discount::class); // Temporarily disabled for testing

        $filters = $request->only(['search', 'status']);

        $discounts = Discount::query()
            ->when($filters['search'] ?? null, function ($query, $search) {
                $query->where('code', 'like', '%' . $search . '%')
                      ->orWhere('type', 'like', '%' . $search . '%');
            })
            ->when($filters['status'] ?? null, function ($query, $status) {
                if ($status === 'active') {
                    $query->where('expires_at', '>', now())
                          ->where(function ($q) {
                              $q->whereNull('max_uses')
                                ->orWhereColumn('uses', '<', 'max_uses');
                          })
                          ->where('status', '!=', 'cancelled');
                } elseif ($status === 'expired') {
                    $query->where('expires_at', '<=', now());
                } elseif ($status === 'cancelled') {
                    $query->where('status', 'cancelled');
                }
            })
            ->latest()
            ->get();

        return Inertia::render('Admin/PromoCodes', [
            'discounts' => $discounts,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        $this->authorize('create', Discount::class);

        return Inertia::render('Discounts/Create');
    }

    public function store(Request $request)
    {
        // $this->authorize('create', Discount::class); // Temporarily disabled for testing

        $validated = $request->validate([
            'code' => 'required|string|unique:discounts,code',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'max_uses' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after_or_equal:today',
        ]);

         // Debug: Check validated data

        try {
            Discount::create($validated);
            return redirect()->route('discounts.index')
                ->with('success', 'Promo code created successfully.');
        } catch (\Exception $e) {
            // Log the error for debugging
            // Log::error('Error creating promo code: ' . $e->getMessage());
            
            return redirect()->back()
                ->withErrors(['general' => 'Failed to create promo code. Error: ' . $e->getMessage()]);
        }
    }

    public function edit(Discount $discount)
    {
        $this->authorize('update', $discount);

        return Inertia::render('Discounts/Edit', [
            'discount' => $discount,
        ]);
    }

    public function update(Request $request, Discount $discount)
    {
        $this->authorize('update', $discount);

        $validated = $request->validate([
            'code' => 'required|string|unique:discounts,code,' . $discount->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        $discount->update($validated);

        return redirect()->route('discounts.index')
            ->with('success', 'Discount updated successfully.');
    }

    public function destroy(Discount $discount)
    {
        $this->authorize('delete', $discount);

        $discount->update(['status' => 'cancelled']);

        return redirect()->route('discounts.index')
            ->with('success', 'Promo code cancelled successfully.');
    }

    public function validateCode(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'plan_price' => 'required|numeric',
        ]);

        $discount = Discount::where('code', $request->code)->first();

        if (!$discount) {
            return response()->json([
                'valid' => false,
                'message' => 'Invalid discount code.',
            ]);
        }

        if (!$discount->isValid()) {
            return response()->json([
                'valid' => false,
                'message' => 'This discount code is no longer valid.',
            ]);
        }

        $originalPrice = $request->plan_price;
        $discountedPrice = $discount->calculateDiscountedPrice($originalPrice);
        $savings = $originalPrice - $discountedPrice;

        return response()->json([
            'valid' => true,
            'discount' => [
                'id' => $discount->id,
                'name' => $discount->name,
                'code' => $discount->code,
                'description' => $discount->description,
                'type' => $discount->type,
                'value' => $discount->value,
            ],
            'pricing' => [
                'original' => $originalPrice,
                'discounted' => $discountedPrice,
                'savings' => $savings,
                'savings_formatted' => number_format($savings, 2),
                'savings_percentage' => round(($savings / $originalPrice) * 100),
            ],
            'message' => 'Discount applied successfully!',
        ]);
    }
} 