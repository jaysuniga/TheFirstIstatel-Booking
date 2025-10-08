<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'room_id',
        'user_id',

        // Walk-in guest details
        'first_name',
        'last_name',
        'email',
        'contact_number',
        'address',

        'check_in',
        'check_out',
        'booking_date_from',
        'booking_date_to',
        'is_walk_in',

        'payment_status',
        'booking_status',
        'total_amount',
    ];

    // Relationships
    public function room()
    {
        return $this->belongsTo(Room::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
