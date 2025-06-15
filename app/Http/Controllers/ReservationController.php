<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\ReservationConfirmation;
// use SimpleSoftwareIO\QrCode\Facades\QrCode; // Removed QrCode facade
// use Illuminate\Support\Facades\Storage; // Removed Storage facade

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

        // Generate QR code URL using a public API (e.g., goqr.me)
        $qrCodeData = $reservation->id; // Data to encode in QR code
        $qrCodeUrl = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" . urlencode($qrCodeData);

        // Send confirmation email with QR code URL
        Mail::to(Auth::user()->email)->send(new ReservationConfirmation($reservation, $qrCodeUrl));

        return redirect()->back()->with('success', 'Session reserved successfully!');
    }
} 