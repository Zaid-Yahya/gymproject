<?php

namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function index()
    {
        $members = [
            ['name' => 'John Smith', 'email' => 'john@example.com', 'type' => 'Premium', 'status' => 'Active'],
            ['name' => 'Sarah Johnson', 'email' => 'sarah@example.com', 'type' => 'Basic', 'status' => 'Active'],
            ['name' => 'Mike Wilson', 'email' => 'mike@example.com', 'type' => 'Premium', 'status' => 'Inactive'],
        ];

        $workouts = [
            ['member' => 'John Smith', 'type' => 'Strength Training', 'duration' => '60 min', 'date' => '2024-01-15'],
            ['member' => 'Sarah Johnson', 'type' => 'Cardio', 'duration' => '45 min', 'date' => '2024-01-15'],
            ['member' => 'Mike Wilson', 'type' => 'CrossFit', 'duration' => '50 min', 'date' => '2024-01-14'],
        ];

        $payments = [
            ['member' => 'John Smith', 'amount' => 99.99, 'date' => '2024-01-15', 'status' => 'Paid'],
            ['member' => 'Sarah Johnson', 'amount' => 49.99, 'date' => '2024-01-14', 'status' => 'Paid'],
            ['member' => 'Mike Wilson', 'amount' => 99.99, 'date' => '2024-01-13', 'status' => 'Pending'],
        ];

        $report = [
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jul'],
            'data' => [4000, 3000, 5000, 4500, 6000, 8000],
        ];

        $totalRevenue = 12845;
        $revenueChange = 12.5;
        $activeMembers = 245;
        $newMembers = 8;

        return Inertia::render('Admin/Index', [
            'members' => $members,
            'workouts' => $workouts,
            'payments' => $payments,
            'report' => $report,
            'totalRevenue' => $totalRevenue,
            'revenueChange' => $revenueChange,
            'activeMembers' => $activeMembers,
            'newMembers' => $newMembers,
        ]);
    }
}
