<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'type',
        'value',
        'max_uses',
        'expires_at',
        'uses',
        'status',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'max_uses' => 'integer',
        'uses' => 'integer',
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function isValid()
    {
        // Check if discount is active
        if ($this->status === 'cancelled') {
            return false;
        }

        // Check if within date range
        $now = now();
        if ($this->expires_at && $now->greaterThan($this->expires_at)) {
            return false;
        }

        // Check if usage limit reached
        if ($this->max_uses !== null && $this->uses >= $this->max_uses) {
            return false;
        }

        return true;
    }

    public function calculateDiscountedPrice($originalPrice)
    {
        if (!$this->isValid()) {
            return $originalPrice;
        }

        if ($this->type === 'percentage') {
            return $originalPrice - ($originalPrice * ($this->value / 100));
        }

        if ($this->type === 'fixed') {
            return max(0, $originalPrice - $this->value);
        }

        return $originalPrice;
    }
} 