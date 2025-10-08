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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->foreignId('room_type_id')->constrained()->cascadeOnDelete();

            $table->string('room_number')->unique();
            $table->string('image')->nullable();
            $table->string('image_360')->nullable();
            $table->unsignedInteger('capacity')->default(1);
            $table->decimal('price', 10, 2);
            $table->enum('status', ['available', 'occupied', 'maintenance'])->default('available');
            $table->boolean('is_active')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
