<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationConfirmation;
use SimpleSoftwareIO\QrCode\Facades\QrCode;

class ReservationController extends Controller
{
    public function create()
    {
        return inertia('Reservations/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'date' => 'required|date|after:today',
        ]);

        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'date' => $request->date,
            'status' => 'pending',
        ]);

        // Generate QR code
        $qrCode = QrCode::format('png')
            ->size(300)
            ->generate($reservation->id);

        // Send confirmation email
        Mail::to(Auth::user()->email)->send(new ReservationConfirmation($reservation, $qrCode));

        return redirect()->back()->with('success', 'Session reserved successfully!');
    }
} 