<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f97316;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .qr-code {
            text-align: center;
            margin: 20px 0;
        }
        .details {
            margin: 20px 0;
            padding: 15px;
            background-color: white;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Training Session Confirmation</h1>
        </div>
        <div class="content">
            <p>Dear {{ $reservation->user->name }},</p>
            
            <p>Your training session has been successfully reserved. Here are your session details:</p>
            
            <div class="details">
                <p><strong>Date:</strong> {{ $reservation->date->format('F j, Y') }}</p>
                <p><strong>Time:</strong> {{ $reservation->date->format('g:i A') }}</p>
                <p><strong>Reservation ID:</strong> {{ $reservation->id }}</p>
            </div>

            <div class="qr-code">
                <p><strong>Your Session QR Code:</strong></p>
                <img src="data:image/png;base64,{{ base64_encode($qrCode) }}" alt="Reservation QR Code">
            </div>

            <p>Please present this QR code when you arrive for your session. Our staff will scan it to confirm your reservation.</p>

            <p>If you need to make any changes to your reservation, please contact us as soon as possible.</p>

            <p>We look forward to seeing you!</p>

            <p>Best regards,<br>Your Fitness Team</p>
        </div>
    </div>
</body>
</html> 