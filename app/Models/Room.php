<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'name',
        'price',
        'capacity',
    ];   

    public function fileAttachments()
    {
        return $this->belongsToMany(FileAttachment::class, 'room_file_attachments');
    }

    public function roomVariants()
    {
        return $this->hasMany(RoomVariant::class);
    }

}