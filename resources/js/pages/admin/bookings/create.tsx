import AppLayout from '@/layouts/app-layout';
import { ArrowUpDown, Bed, Calendar, ImagePlus, ImageUp, Layers, List, Mail, MapPin, MoreHorizontal, PencilLine, PhilippinePeso, Phone, Rotate3D, Trash, Trash2, Users, X } from 'lucide-react';
import * as React from "react"
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import Heading from '@/components/heading';
import { User, type BreadcrumbItem } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';
import { Room, RoomType } from '@/types/room';
import CustomTable from '@/components/table/custom-table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PanoramaViewer from '@/components/panorama-viewer';
import { useState } from 'react';
import { toast } from 'sonner';
import { Head, router, usePage,useForm} from '@inertiajs/react';
import bookingRoutes from '@/routes/bookings';
import { BookingFormData } from '@/types/booking';
import BookingDatePicker from '@/components/calendar-in-out';
import { Textarea } from '@/components/ui/textarea';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Bookings',
    href: '/bookings',
  },
  {
    title: 'Create',
    href: 'bookingRoutes.create()',
  },
];

type Props = {
  rooms: Room[];
  users: User[];
}

const BookingCreate = ({ rooms,users }: Props) => {

  const getDefaultFormData = (): BookingFormData => {
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(today.getDate() + 1)

    return {
      id: 0,
      room_id: 0,
      user_id: null,

      // Walk-in guest details
      first_name: '',
      last_name: '',
      email: '',
      contact_number: '',
      address: '',

      // Dates
      check_in: today.toISOString().split('T')[0], // YYYY-MM-DD
      check_out: tomorrow.toISOString().split('T')[0],
      booking_date_from: today.toISOString().split('T')[0],
      booking_date_to: tomorrow.toISOString().split('T')[0],

      // Booking info
      is_walk_in: false,
      payment_status: 'unpaid',
      booking_status: 'pending',
      total_amount: 0,
    }
  }


  const { data, setData, post, processing, errors, reset } = useForm<BookingFormData>(
    getDefaultFormData()
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting room data:', data);

    post(bookingRoutes.store.url(), {
      onSuccess: () => {
        toast.success('Room created!');
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-8xl p-4 sm:px-6 lg:px-8">
      <Head title="Booking" />
      <Toaster position='top-center' />

      <Heading title="Create Booking" description="Create new bookings, view details, and update existing records with ease." />

      <Separator className='my-4' />

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className='w-full space-y-8 px-2'>
          <div className='flex flex-col gap-2 p-2'>
            <div className='flex items-center gap-2 mb-2'>
              <List className='text-muted-foreground' size={14} />
              <div className='text-sm font-bold'>Fill Booking Information:</div>
            </div>
            <div className='px-2'>
              <div className="grid grid-cols-4 gap-4 px-2">
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <Calendar size={16} />
                    <Label htmlFor="room_number" className='font-semibold'>Check In - Check Out</Label>
                  </div>
                  <div className='px-4'>
                    <BookingDatePicker
                      defaultFrom={data.booking_date_from}
                      defaultTo={data.booking_date_to}
                      onChange={(from, to) => {
                        // Update your form state here
                        console.log("Selected dates:", from, to)
                      }}
                    />
                  </div>
                </div>

                {/*room*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <Bed size={16} />
                    <Label className='font-semibold'>Room</Label>
                  </div>
                  <div className='px-4'>
                    <Select
                      value={data.room_id === 0 ? '' : data.room_id.toString()}
                      onValueChange={(value) => setData('room_id', Number(value))}
                    >
                      <SelectTrigger className='border border-dashed border-neutral-400 w-full'>
                        <SelectValue placeholder="Select Room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Rooms</SelectLabel>
                          {rooms.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>{type.room_number}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.room_id && <p className="text-sm text-red-600">{errors.room_id}</p>}
                </div>

                {/*user*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <Bed size={16} />
                    <Label className='font-semibold'>User</Label>
                  </div>
                  <div className='px-4'>
                    <Select
                      value={(data.user_id ?? 0) === 0 ? '' : (data.user_id as number).toString()}
                      onValueChange={(value) => setData('user_id', Number(value))}
                    >
                      <SelectTrigger className='border border-dashed border-neutral-400 w-full'>
                        <SelectValue placeholder="Select Client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Clients</SelectLabel>
                          {users.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>{type.last_name},{type.first_name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.user_id && <p className="text-sm text-red-600">{errors.user_id}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col gap-2 p-2'>
            <div className='flex items-center gap-2 mb-2'>
              <List className='text-muted-foreground' size={14} />
              <div className='text-sm font-bold'>Fill Customer Information:</div>
            </div>
            <div className='px-2'>
              <div className="grid grid-cols-4 gap-4 px-2">
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16} />
                    <Label htmlFor="room_number" className='font-semibold'>First Name</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="room_number"
                      type="text"
                      value={data.first_name ?? ''}
                      onChange={(e) => setData('first_name', e.target.value)}
                      placeholder='First Name'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.first_name && <p className="text-sm text-red-600">{errors.first_name}</p>}
                </div>

                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16} />
                    <Label htmlFor="room_number" className='font-semibold'>Last Name</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="room_number"
                      type="text"
                      value={data.last_name ?? ''}
                      onChange={(e) => setData('last_name', e.target.value)}
                      placeholder='Last Name'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.last_name && <p className="text-sm text-red-600">{errors.last_name}</p>}
                </div>

                {/*email*/}
                <div className="grid gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <Mail size={16}/>
                      <Label htmlFor="email" className='font-semibold'>Email</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="email"
                        type="email"
                        value={data.email ?? ''}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder='Email here'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="grid gap-2">
                    <div className='flex items-center text-neutral-600 gap-2'>
                      <Phone size={16}/>
                      <Label htmlFor="contact_number" className='font-semibold'>Contact Number</Label>
                    </div>
                    <div className='px-4'>
                      <Input
                        id="contact_number"
                        type="text"
                        value={data.contact_number ?? ''}
                        onChange={(e) => setData('contact_number', e.target.value)}
                        placeholder='Format (09xxxxxxxxx or +639xxxxxxxxx)'
                        className='border border-dashed border-neutral-400'
                      />
                    </div>
                    {errors.contact_number && <p className="text-sm text-red-600">{errors.contact_number}</p>}
                </div>

                <div className="grid col-span-2 gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <MapPin size={16}/>
                    <Label htmlFor="address" className='font-semibold'>Address</Label>
                  </div>
                  <div className='px-4'>
                    <Textarea
                      id="address"
                      value={data.address ?? ''}
                      onChange={(e) => setData('address', e.target.value)}
                      placeholder='Address here'
                      className='resize-y max-h-50 border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                  </div>
              </div>
            </div>
          </div>

          <Separator className='my-4' />

          <div className='flex items-center justify-end'>
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>Create Bookings</Button>
          </div>
        </div>
      </form>

    </div>
  );
};

BookingCreate.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default BookingCreate;

