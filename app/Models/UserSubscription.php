<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserSubscription extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'phone_number',
        'name',
        'subscription_id',
        'start_date',
        'end_date',
        'status',
        'is_active'
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_active' => 'boolean',
    ];

    public function subscription()
    {
        return $this->belongsTo(Subscription::class);
    }
}
