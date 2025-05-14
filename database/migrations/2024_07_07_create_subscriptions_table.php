<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('discount_id')->nullable()->constrained()->nullOnDelete();
            $table->string('plan_name');
            $table->decimal('original_price', 10, 2);
            $table->decimal('price', 10, 2); // Final price after discount
            $table->date('start_date');
            $table->date('end_date');
            $table->string('status'); // pending, active, cancelled, expired
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
}; 