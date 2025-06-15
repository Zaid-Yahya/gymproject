<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ReservationConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    public $qrCode;

    public function __construct(Reservation $reservation, $qrCode)
    {
        $this->reservation = $reservation;
        $this->qrCode = $qrCode;
    }

    public function build()
    {
        return $this->subject('Training Session Reservation Confirmation')
                    ->view('emails.reservation-confirmation')
                    ->with([
                        'reservation' => $this->reservation,
                        'qrCode' => $this->qrCode,
                    ]);
    }
} 