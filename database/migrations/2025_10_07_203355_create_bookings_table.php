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
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();

            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');

            // Walk-in guest details
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('address')->nullable();

            $table->date('check_in')->nullable();
            $table->date('check_out')->nullable();
            $table->date('booking_date_from')->nullable();
            $table->date('booking_date_to')->nullable();            
            $table->boolean('is_walk_in')->default(false);

            $table->text('cancellation_reason')->nullable();
            $table->text('other_reasons')->nullable();
            $table->text('decline_reason')->nullable();
            $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->enum('booking_status', [
                'pending', 'reserved', 'confirmed', 'checked in', 'checked out', 'canceled', 'expired', 'declined'
            ])->default('pending');
            $table->decimal('total_amount', 10, 2)->default(0.00);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
