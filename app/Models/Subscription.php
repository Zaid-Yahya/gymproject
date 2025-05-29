<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'discount_id',
        'plan_name',
        'period',
        'tier',
        'original_price',
        'price',
        'start_date',
        'end_date',
        'status',
        'is_upgrade',
        'upgraded_to',
        'cancelled_at',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_upgrade' => 'boolean',
        'cancelled_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function discount()
    {
        return $this->belongsTo(Discount::class);
    }

    /**
     * Get the subscription this one was upgraded to
     */
    public function upgradedToSubscription()
    {
        return $this->belongsTo(Subscription::class, 'upgraded_to');
    }

    /**
     * Get the previous subscription this one upgraded from
     */
    public function upgradedFromSubscription()
    {
        return $this->hasOne(Subscription::class, 'upgraded_to', 'id');
    }

    public function isActive()
    {
        return $this->status === 'active' && $this->end_date->isFuture();
    }

    public function isPending()
    {
        return $this->status === 'pending';
    }

    public function isUpgraded()
    {
        return $this->status === 'upgraded';
    }

    public function isCancelled()
    {
        return $this->status === 'cancelled';
    }

    public function calculateRemainingDays()
    {
        if (!$this->isActive()) {
            return 0;
        }

        return now()->diffInDays($this->end_date, false);
    }

    public function getTotalDaysAttribute()
    {
        return $this->start_date->diffInDays($this->end_date);
    }

    public function getUsedDaysAttribute()
    {
        return $this->start_date->diffInDays(now());
    }

    public function getRemainingDaysAttribute()
    {
        return $this->calculateRemainingDays();
    }

    public function getDailyRateAttribute()
    {
        return $this->total_days > 0 ? $this->price / $this->total_days : 0;
    }

    public function getSavingsAttribute()
    {
        if (!$this->discount_id) {
            return 0;
        }

        return $this->original_price - $this->price;
    }

    /**
     * Check if this subscription can be upgraded to a higher tier
     */
    public function canUpgrade()
    {
        // Can only upgrade if subscription is active and not already at highest tier
        return $this->isActive() && $this->tier < 3;
    }

    /**
     * Get the available upgrade options for this subscription
     */
    public function getUpgradeOptions()
    {
        if (!$this->canUpgrade()) {
            return [];
        }

        // Get plans with higher tier but same period
        $plans = app(SubscriptionController::class)->getAllPlans();
        return array_filter($plans, function($plan) {
            return $plan['tier'] > $this->tier && $plan['period'] === $this->period;
        });
    }
} 