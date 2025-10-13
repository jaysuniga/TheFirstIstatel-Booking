<?php

namespace App\Http\Controllers;

use App\Models\RoomVariant;
use App\Models\Room;

use App\Http\Requests\StoreRoomVariantRequest;
use App\Http\Requests\UpdateRoomVariantRequest;

class RoomVariantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = Room::select('id', 'name')->get();

        $room_variants = RoomVariant::with(['room'])
            ->select('room_variants.*')
            ->get();


        $room_variants = $room_variants->map(function ($room_variant) {
            return [
                'id' => $room_variant->id,
                'room_number' => $room_variant->room_number,
                'status' => $room_variant->status,
                'is_active' => $room_variant->is_active,
                'room_name' => $room_variant->room->name ?? 'N/A',
            ];
        });

        return inertia('admin/room-variants/index', [
            'room_variants' => $room_variants,
            'rooms' => $rooms,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoomVariantRequest $request)
    {
        RoomVariant::create($request->validated());

        return to_route('room-variants.index')->with('success', 'Room Variant created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(RoomVariant $roomVariant)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RoomVariant $roomVariant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoomVariantRequest $request, RoomVariant $roomVariant)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(RoomVariant $roomVariant)
    {
        //
    }
}
