<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use App\Models\FileAttachment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class RoomSeeder extends Seeder
{
    /**
     * Seed the rooms in the database.
     */
    public function run(): void
    {
        $rooms = [
            [
                'price' => 1000,
                'capacity' => 2,
                'image_url' => 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
                'image_360_url' => 'https://i0.wp.com/www.samrohn.com/wp-content/uploads/le-meridien-bedroom-panorama.jpg?w=1200&ssl=1',
            ],
            [
                'price' => 1500,
                'capacity' => 3,
                'image_url' => 'https://images.unsplash.com/photo-1675409145919-277c0fc2aa7d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074',
                'image_360_url' => 'https://i0.wp.com/www.samrohn.com/wp-content/uploads/standard-hotel-new-york-virtual-tour-002.jpg?w=1200&ssl=1',
            ],
            [
                'price' => 2000,
                'capacity' => 4,
                'image_url' => 'https://images.unsplash.com/photo-1639563976893-d0f79b62cd5d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1171',
                'image_360_url' => 'https://i0.wp.com/www.samrohn.com/wp-content/uploads/milk-studio-panorama.jpg?w=1200&ssl=1',
            ],
        ];

        foreach ($rooms as $roomData) {
            $name = '';
            if ($roomData['capacity'] == 2) {
                $name = 'Deluxe King';
            } elseif ($roomData['capacity'] == 3) {
                $name = 'Deluxe Double';
            } else {
                $name = 'Standard';
            }

            // Create or get the room
            $roomInstance = Room::firstOrCreate([
                'price' => $roomData['price'],
                'capacity' => $roomData['capacity'],
            ], [
                'name' => $name,
            ]);

            // Handle normal image
            if (!empty($roomData['image_url'])) {
                $this->handleRoomImage($roomInstance, $roomData['image_url'], false);
            }

            // Handle 360 image
            if (!empty($roomData['image_360_url'])) {
                $this->handleRoomImage($roomInstance, $roomData['image_360_url'], true);
            }
        }
    }

    /**
     * Handle image upload or URL download and attachment to the room.
     */
    private function handleRoomImage(Room $room, string $imageUrl, bool $is360 = false): void
    {
        if (filter_var($imageUrl, FILTER_VALIDATE_URL)) {
            $slug = Str::slug($room->name);
            $suffix = $is360 ? '360' : 'image';
            $imageName = "room_{$slug}_{$suffix}.jpg";
            $imagePath = $imageUrl;

            $imageData = @getimagesize($imageUrl);
            $mimeType = $imageData['mime'] ?? 'image/jpeg';

            $attachment = FileAttachment::create([
                'file_name' => $imageName,
                'file_path' => $imagePath,
                'file_type' => $mimeType,
                'is_360' => $is360,
            ]);

            $room->fileAttachments()->attach($attachment->id);
        }
    }


}
