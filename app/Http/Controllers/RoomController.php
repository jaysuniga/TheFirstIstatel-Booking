<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;

use App\Models\RoomType;
use App\Models\FileAttachment;

use Illuminate\Support\Str;

use App\Http\Requests\StoreRoomRequest;
use App\Http\Requests\UpdateRoomRequest;

class RoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::with(['roomType', 'fileAttachments'])
            ->select('rooms.*')
            ->get()
            ->map(function ($room) {
                // Get first non-360 image if available
                $normalImage = $room->fileAttachments
                    ->where('is_360', false)
                    ->first();

                return [
                    'id' => $room->id,
                    'room_number' => $room->room_number,
                    'room_type_name' => $room->roomType->name ?? 'N/A',
                    'status' => $room->status,
                    'price' => $room->price,
                    'capacity' => $room->capacity,
                    'image' => $normalImage ? asset('storage/' . $normalImage->file_path) : null,
                ];
            });

        return inertia('admin/rooms/index', [
            'rooms' => $rooms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // room type list for dropdown
        $room_types = RoomType::all(['id', 'name']);

        return inertia('admin/rooms/create', [
            'room_types' => $room_types
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomRequest $request)
    {
        $validated = $request->validated();

        // Create the Room
        $room = Room::create($validated);

        // Handle normal images
        if ($request->hasFile('images')) {
            $this->handleFileAttachments($room, $request->file('images'), false);
        }

        // Handle 360° image
        if ($request->hasFile('image_360')) {
            $this->handleFileAttachments($room, [$request->file('image_360')], true);
        }

        return redirect()->route('rooms.index')->with('success', 'Room created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Room $room)
    {
        $room->load(['roomType', 'fileAttachments']);

        // Separate normal and 360 images for convenience
        $normalImages = $room->fileAttachments
            ->where('is_360', false)
            ->pluck('file_path')
            ->map(fn($path) => asset('storage/' . $path))
            ->values();

        $image360 = $room->fileAttachments
            ->where('is_360', true)
            ->pluck('file_path')
            ->map(fn($path) => asset('storage/' . $path))
            ->values();

        //dd($normalImages, $image360);

        return inertia('admin/rooms/show', [
            'room' => [
                'id' => $room->id,
                'room_number' => $room->room_number,
                'status' => $room->status,
                'price' => $room->price,
                'capacity' => $room->capacity,
                'room_type' => $room->roomType->name ?? 'N/A',
                'images' => $normalImages,
                'image_360' => $image360->first(),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Room $room)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Room $room)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Room $room)
    {
        //
    }

    private function handleFileAttachments(Room $room, array $files, bool $is360 = false): void
    {
        foreach ($files as $file) {
            $randomString = Str::random(8);
            $extension = $file->getClientOriginalExtension();

            // Make room number filename-safe
            $safeRoomNumber = Str::slug($room->room_number);

            // Folder based on image type
            $folder = $is360 ? '360' : 'normal';

            // Build unique file name
            $generatedName = "room_{$safeRoomNumber}_id{$room->id}_{$folder}_{$randomString}.{$extension}";
            $filePath = "attachments/rooms/{$folder}/{$generatedName}";

            // Store file in its respective folder
            $file->storeAs("attachments/rooms/{$folder}", $generatedName, 'public');

            // Save record in DB
            $attachment = FileAttachment::create([
                'file_name' => $generatedName,
                'file_path' => $filePath,
                'file_type' => $file->getClientMimeType(),
                'is_360' => $is360,
            ]);

            // Attach to room
            $room->fileAttachments()->attach($attachment->id);
        }
    }

}
