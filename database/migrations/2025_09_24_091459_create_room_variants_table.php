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
        Schema::create('room_variants', function (Blueprint $table) {
            $table->id();
            $table->timestamps();

            $table->string('room_number')->unique();
            $table->enum('status', ['occupied', 'available', 'maintenance'])->default('available');
            $table->boolean('is_active')->default(true);

            $table->unsignedBigInteger('room_id'); // foreign key to rooms table
            $table->foreign('room_id')->references('id')->on('rooms')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_variants');
    }
};
