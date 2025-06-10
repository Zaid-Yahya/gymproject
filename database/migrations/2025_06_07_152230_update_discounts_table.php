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
        Schema::table('discounts', function (Blueprint $table) {
            // Drop old columns if they exist
            if (Schema::hasColumn('discounts', 'name')) {
                $table->dropColumn(['name', 'description', 'valid_from', 'valid_until', 'is_active']);
            }
            if (Schema::hasColumn('discounts', 'usage_limit')) {
                $table->dropColumn(['usage_limit', 'used_count']);
            }

            // Add new columns
            $table->integer('max_uses')->nullable()->after('value');
            $table->integer('uses')->default(0)->after('max_uses');
            $table->timestamp('expires_at')->nullable()->after('uses');
            $table->string('status')->default('active')->after('expires_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('discounts', function (Blueprint $table) {
            // Remove newly added columns
            $table->dropColumn(['max_uses', 'uses', 'expires_at', 'status']);

            // Re-add old columns for rollback scenario
            $table->string('name')->nullable()->after('code');
            $table->text('description')->nullable()->after('name');
            $table->timestamp('valid_from')->nullable()->after('value');
            $table->timestamp('valid_until')->nullable()->after('valid_from');
            $table->integer('usage_limit')->nullable()->after('value');
            $table->integer('used_count')->default(0)->after('usage_limit');
            $table->boolean('is_active')->default(true)->after('used_count');
        });
    }
};
