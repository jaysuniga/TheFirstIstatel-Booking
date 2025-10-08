<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'room_type_id',
        'status',
        'price',
        'capacity',
    ];   


    public function roomType()
    {
        return $this->belongsTo(RoomType::class);
    }


    public function fileAttachments()
    {
        return $this->belongsToMany(FileAttachment::class, 'room_file_attachments');
    }

}