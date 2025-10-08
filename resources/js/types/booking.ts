// types/booking.ts

// 🏷️ Small reusable union types
export type PaymentStatus = 'unpaid' | 'partial' | 'paid';

export type BookingStatus =
  | 'pending'
  | 'reserved'
  | 'confirmed'
  | 'checked in'
  | 'checked out'
  | 'canceled'
  | 'expired'
  | 'declined';

// 🧱 Related model types (optional)
export interface RoomSummary {
  id: number;
  room_number: string;
  [key: string]: any;
}

export interface UserSummary {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact_number?: string;
  [key: string]: any;
}

// 🧩 Core Booking interface (used for fetched data)
export interface Booking {
  id: number;
  room_id: number;
  user_id?: number | null;

  // Walk-in guest details
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  contact_number?: string | null;
  address?: string | null;

  guest_name?:string | null;

  room_number: string;

  // Related models
  room?: RoomSummary | null;
  user?: UserSummary | null;

  // Dates
  check_in?: string | null;
  check_out?: string | null;
  booking_date_from?: string | null;
  booking_date_to?: string | null;

  // Booking info
  is_walk_in: boolean;
  payment_status: PaymentStatus;
  booking_status: BookingStatus;
  total_amount: string | number;

  created_at?: string;
  updated_at?: string;
}

// 🧾 Form data type (used for create/edit forms)
export interface BookingFormData
  extends Omit<Booking, 'room' | 'user' | 'created_at' | 'updated_at' | 'room_number'> {}
