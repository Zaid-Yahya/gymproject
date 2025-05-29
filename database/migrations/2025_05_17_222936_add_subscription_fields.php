<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('period')->default('monthly')->after('plan_name');
            $table->integer('tier')->default(1)->after('period');
            $table->boolean('is_upgrade')->default(false)->after('status');
            $table->unsignedBigInteger('upgraded_to')->nullable()->after('is_upgrade');
            $table->timestamp('cancelled_at')->nullable()->after('updated_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('period');
            $table->dropColumn('tier');
            $table->dropColumn('is_upgrade');
            $table->dropColumn('upgraded_to');
            $table->dropColumn('cancelled_at');
        });
    }
};
