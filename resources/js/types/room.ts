export interface Room {
  id: number;
  name: string;
  price : number;
  capacity : number;
  image: string;
  images: string[];
  image_360:string;
}

export interface RoomVariant {
  id: number;
  room_number: string;
  status: 'occupied' | 'available' | 'maintenance';
  is_active: boolean;
  room_id: number;
  room_name?: string;
}
