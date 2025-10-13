<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomVariant extends Model
{
    protected $fillable = [
        'room_id',

        'room_number',
        'status',
        'is_active',

    ];

    public function room()
    {
        return $this->belongsTo(Room::class); // Explicit foreign key
    }
}
