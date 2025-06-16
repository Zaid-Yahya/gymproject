<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class AdminReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with('user')
            ->latest('date')
            ->paginate(10);

        return Inertia::render('Admin/Reservations/Index', [
            'reservations' => $reservations
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        try {
            \Log::info('Status update request', [
                'reservation_id' => $id,
                'request_data' => $request->all(),
                'request_method' => $request->method(),
                'request_url' => $request->url()
            ]);

            // Validate the status
            $validated = $request->validate([
                'status' => 'required|in:confirmed,cancelled'
            ]);

            \Log::info('Validation passed', [
                'validated_data' => $validated
            ]);

            // Get the current status before update
            $beforeUpdate = DB::table('reservations')
                ->where('id', $id)
                ->first();
            
            if (!$beforeUpdate) {
                \Log::error('Reservation not found', ['id' => $id]);
                return back()->with('error', 'Reservation not found');
            }

            \Log::info('Status before update', [
                'reservation_id' => $id,
                'status' => $beforeUpdate->status
            ]);

            // Use direct update instead of raw SQL
            $updated = DB::table('reservations')
                ->where('id', $id)
                ->update([
                    'status' => $validated['status'],
                    'updated_at' => now()
                ]);

            \Log::info('Update result', [
                'reservation_id' => $id,
                'updated' => $updated,
                'new_status' => $validated['status']
            ]);

            // Verify the update
            $afterUpdate = DB::table('reservations')
                ->where('id', $id)
                ->first();

            \Log::info('Status after update', [
                'reservation_id' => $id,
                'status' => $afterUpdate->status,
                'updated_at' => $afterUpdate->updated_at
            ]);

            if ($updated) {
                return back()->with('success', 'Reservation status updated successfully');
            }

            return back()->with('error', 'Failed to update reservation status');

        } catch (\Exception $e) {
            \Log::error('Failed to update reservation status', [
                'reservation_id' => $id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'Failed to update reservation status: ' . $e->getMessage());
        }
    }
}