<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'name',
        'description',
        'type',
        'value',
        'valid_from',
        'valid_until',
        'usage_limit',
        'used_count',
        'is_active',
    ];

    protected $casts = [
        'valid_from' => 'date',
        'valid_until' => 'date',
        'is_active' => 'boolean',
    ];

    public function subscriptions()
    {
        return $this->hasMany(Subscription::class);
    }

    public function isValid()
    {
        // Check if discount is active
        if (!$this->is_active) {
            return false;
        }

        // Check if within date range
        $now = now();
        if ($now < $this->valid_from) {
            return false;
        }
        
        if ($this->valid_until && $now > $this->valid_until) {
            return false;
        }

        // Check if usage limit reached
        if ($this->usage_limit && $this->used_count >= $this->usage_limit) {
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