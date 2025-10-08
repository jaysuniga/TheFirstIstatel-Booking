<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FileAttachment extends Model
{
    //

    protected $fillable = [
        'file_name',
        'file_path',
        'file_type',
        'is_360',
    ];

    public function rooms()
    {
        return $this->belongsToMany(Room::class, 'room_file_attachments');
    }
}
