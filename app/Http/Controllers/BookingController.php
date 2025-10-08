<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Room;
use App\Models\User;


use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $bookings = Booking::with(['room', 'user'])
            ->select('bookings.*')
            ->latest() // show latest first
            ->get()
            ->map(function ($booking) {
                return [
                    'id' => $booking->id,
                    'room_number' => $booking->room->room_number ?? 'N/A',
                    'guest_name' => $booking->is_walk_in
                        ? "{$booking->first_name} {$booking->last_name}"
                        : ($booking->user ? "{$booking->user->first_name} {$booking->user->last_name}" : 'N/A'),
                    'email' => $booking->is_walk_in
                        ? $booking->email
                        : ($booking->user->email ?? 'N/A'),
                    'contact_number' => $booking->is_walk_in
                        ? $booking->contact_number
                        : ($booking->user->contact_number ?? 'N/A'),
                    'check_in' => $booking->check_in,
                    'check_out' => $booking->check_out,
                    'payment_status' => ucfirst($booking->payment_status),
                    'booking_status' => ucfirst($booking->booking_status),
                    'total_amount' => number_format($booking->total_amount, 2),
                    'is_walk_in' => $booking->is_walk_in,
                    'created_at' => $booking->created_at ? $booking->created_at->format('Y-m-d H:i') : null,
                ];
            });

        //dd($bookings);

        return inertia('admin/bookings/index', [
            'bookings' => $bookings,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Fetch available rooms and users for selection
        $rooms = Room::select('id', 'room_number', 'price')->get();
        $users = User::select('id', 'first_name', 'last_name', 'email')->get();

        return inertia('admin/bookings/create', [
            'rooms' => $rooms,
            'users' => $users,
        ]);
    }
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'room_id' => 'required|exists:rooms,id',
            'user_id' => 'nullable|exists:users,id',

            // Walk-in guest details
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'contact_number' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',

            // Dates
            'check_in' => 'nullable|date',
            'check_out' => 'nullable|date|after_or_equal:check_in',
            'booking_date_from' => 'nullable|date',
            'booking_date_to' => 'nullable|date|after_or_equal:booking_date_from',

            'is_walk_in' => 'required|boolean',
            'payment_status' => 'required|in:unpaid,partial,paid',
            'booking_status' => 'required|in:pending,reserved,confirmed,checked in,checked out,canceled,expired,declined',
            'total_amount' => 'required|numeric|min:0',
        ]);

        $booking = Booking::create($data);

        return redirect()->route('bookings.index')->with('success', 'Booking created successfully.');
    }


    /**
     * Display the specified resource.
     */
    public function show(Booking $booking)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Booking $booking)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Booking $booking)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Booking $booking)
    {
        //
    }
}
