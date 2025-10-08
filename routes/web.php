<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::resource('room-types', App\Http\Controllers\RoomTypeController::class)->names('room-types');

    Route::resource('rooms', App\Http\Controllers\RoomController::class)->names('rooms');

    Route::resource('users', App\Http\Controllers\UserController::class)->names('users');

    Route::resource('bookings', App\Http\Controllers\BookingController::class)->names('bookings');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
