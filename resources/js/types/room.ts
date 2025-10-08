export interface RoomType {
  id: number;
  name: string;
  rooms_count?: number;
  room_available_count?: number;
}

export interface Room {
  id: number;
  room_number: string;
  room_type: number;
  room_type_name?: string;
  status : 'available' | 'occupied' | 'maintenance';
  price : number;
  capacity : number;
  image: string;
  images: string[];
  image_360:string;
}