<?php

namespace App\Http\Controllers;

use App\Models\Discount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DiscountController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', Discount::class);

        return Inertia::render('Discounts/Index', [
            'discounts' => Discount::latest()->get(),
        ]);
    }

    public function create()
    {
        $this->authorize('create', Discount::class);

        return Inertia::render('Discounts/Create');
    }

    public function store(Request $request)
    {
        $this->authorize('create', Discount::class);

        $validated = $request->validate([
            'code' => 'required|string|unique:discounts',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed',
            'value' => 'required|numeric|min:0',
            'valid_from' => 'required|date',
            'valid_until' => 'nullable|date|after:valid_from',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
        ]);

        Discount::create($validated);

        return redirect()->route('discounts.index')
            ->with('success', 'Discount created successfully.');
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

        $discount->delete();

        return redirect()->route('discounts.index')
            ->with('success', 'Discount deleted successfully.');
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