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
    public $qrCodeUrl;

    public function __construct(Reservation $reservation, $qrCodeUrl)
    {
        $this->reservation = $reservation;
        $this->qrCodeUrl = $qrCodeUrl;
    }

    public function build()
    {
        return $this->subject('Training Session Reservation Confirmation')
                    ->view('emails.reservation-confirmation')
                    ->with([
                        'reservation' => $this->reservation,
                        'qrCodeUrl' => $this->qrCodeUrl,
                    ]);
    }
} 