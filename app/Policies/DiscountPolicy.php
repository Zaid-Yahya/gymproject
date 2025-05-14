<?php

namespace App\Policies;

use App\Models\Discount;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class DiscountPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        // For now, let's assume only admins can manage discounts
        // In a real app, you would implement proper role-based permissions
        return $user->id === 1; // Only user with ID 1 (first user) can manage discounts
    }

    public function view(User $user, Discount $discount)
    {
        return $this->viewAny($user);
    }

    public function create(User $user)
    {
        return $this->viewAny($user);
    }

    public function update(User $user, Discount $discount)
    {
        return $this->viewAny($user);
    }

    public function delete(User $user, Discount $discount)
    {
        return $this->viewAny($user);
    }
} 