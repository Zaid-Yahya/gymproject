<?php

return [

    /*
    |--------------------------------------------------------------------------
    | QR Code Backend
    |--------------------------------------------------------------------------
    |
    | This option controls which backend is used for QR code generation. You can
    | use 'gd' (if GD extension is enabled) or 'imagick' (if Imagick extension
    | is enabled). If both are enabled, Imagick is usually preferred by default.
    | We are explicitly setting it to 'gd' here.
    |
    */

    'driver' => env('QRCODE_DRIVER', 'gd'),

    /*
    |--------------------------------------------------------------------------
    | GD Specific Options
    |--------------------------------------------------------------------------
    |
    | These options are specific to the GD backend.
    |
    */

    'gd' => [
        'output_mode' => 'png', // Output as PNG for email embedding
        // You can add more GD specific options here if needed
    ],

    /*
    |--------------------------------------------------------------------------
    | Imagick Specific Options
    |--------------------------------------------------------------------------
    |
    | These options are specific to the Imagick backend.
    |
    */

    'imagick' => [
        // No specific options needed here if not using Imagick
    ],

    /*
    |--------------------------------------------------------------------------
    | Default QR Code Generation Options
    |--------------------------------------------------------------------------
    |
    | These options are used by default for all QR code generations.
    |
    */

    'size'          => 300,
    'encoding'      => 'UTF-8',
    'error_correction' => 'L',
    'margin'        => 1,
    'color'         => [0, 0, 0], // Black
    'background'    => [255, 255, 255], // White

]; 