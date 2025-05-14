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
        'original_price',
        'price',
        'start_date',
        'end_date',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
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

    public function isActive()
    {
        return $this->status === 'active' && $this->end_date->isFuture();
    }

    public function calculateRemainingDays()
    {
        if (!$this->isActive()) {
            return 0;
        }

        return now()->diffInDays($this->end_date, false);
    }

    public function getSavingsAttribute()
    {
        if (!$this->discount_id) {
            return 0;
        }

        return $this->original_price - $this->price;
    }
} 