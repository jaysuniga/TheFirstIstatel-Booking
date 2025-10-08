import AppLayout from '@/layouts/app-layout';
import { ImagePlus, Layers, List, PencilLine, PhilippinePeso, Rotate3D, Users } from 'lucide-react';
import * as React from "react"
import { useState, useEffect } from "react";
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { Separator } from '@/components/ui/separator';
import { Room } from '@/types/room';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import PanoramaViewer from '@/components/panorama-viewer';
import { Head} from '@inertiajs/react';
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Rooms',
    href: '/rooms',
  },
  {
    title: 'Show',
    href: '/rooms/show',
  },
];

type Props = {
  room: Room;
}

const RoomShow = ({ room }: Props) => {

  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="mx-auto w-full max-w-8xl p-4 sm:px-6 lg:px-8">
      <Head title="Room Types" />
      <Toaster position='top-center' />

      <Heading title="Show Room" description="Create new rooms, view details, and update existing records with ease." />

      <Separator className='my-4' />

      <div className='w-full space-y-8 px-2'>
        <div className='flex flex-col gap-2 p-2'>
          <div className='flex items-center gap-2 mb-2'>
            <List className='text-muted-foreground' size={14} />
            <div className='text-sm font-bold'>Room Details:</div>
          </div>
          <div className='px-2'>
            <div className="grid grid-cols-4 gap-4 px-2">
              {/*room_number*/}
              <div className="grid gap-2">
                <div className='flex items-center text-neutral-600 gap-2'>
                  <PencilLine size={16} />
                  <Label htmlFor="room_number" className='font-semibold'>Room Name</Label>
                </div>
                <div className='px-4'>
                  <Input
                    id="room_number"
                    type="text"
                    value={room.room_number}
                    readOnly
                    placeholder='Enter room number here'
                    className='border border-neutral-400'
                  />
                </div>
              </div>
              {/*room_number*/}
              <div className="grid gap-2">
                <div className='flex items-center text-neutral-600 gap-2'>
                  <Layers size={16} />
                  <Label className='font-semibold'>Room Type</Label>
                </div>
                <div className='px-4'>
                  <Input
                    id="room_number"
                    type="text"
                    value={room.room_type}
                    readOnly
                    placeholder='Enter room number here'
                    className='border border-neutral-400'
                  />
                </div>
              </div>
              
              {/*capacity*/}
              <div className="grid gap-2">
                <div className='flex items-center text-neutral-600 gap-2'>
                  <Users size={16} />
                  <Label htmlFor="capacity" className='font-semibold'>Capacity</Label>
                </div>
                <div className='px-4'>
                  <Input
                    id="capacity"
                    type="number"
                    value={room.capacity}
                    readOnly
                    className='border border-neutral-400'
                  />
                </div>
              </div>
              {/*price*/}
              <div className="grid gap-2">
                <div className='flex items-center text-neutral-600 gap-2'>
                  <PhilippinePeso size={16} />
                  <Label htmlFor="price" className='font-semibold'>Price</Label>
                </div>
                <div className='px-4'>
                  <Input
                    id='price'
                    className='border border-neutral-400'
                    type="text"
                    value={room.price}
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className='my-4' />

        <div className='flex divide-x'>
          
          <div className="w-full flex flex-col gap-2 p-2">
            <div className="flex items-center gap-2 mb-2">
              <Rotate3D className="text-muted-foreground" size={14} />
              <div className="text-sm font-bold">Room 360° Image:</div>
            </div>

            <div className="h-100 w-full px-2 flex gap-6">
                <div className="flex justify-center items-center mx-auto relative w-150 h-full rounded-lg overflow-hidden border">
                  <PanoramaViewer imageUrl={room.image_360} />
                </div>
            </div>
          </div>

          <div className='w-full flex flex-col gap-2 p-2'>
            <div className='flex items-center gap-2 mb-2'>
              <ImagePlus className='text-muted-foreground' size={14} />
              <div className='text-sm font-bold'>Room Images:</div>
            </div>
            <div className='h-full'>
              <Carousel setApi={setApi} className="w-full max-w-md mx-auto">
                <CarouselContent className='h-100'>
                  {room.images && room.images.length > 0 ? (
                    room.images.map((image, index) => (
                      <CarouselItem key={index}>
                              <img
                                src={image}
                                alt={`Room image ${index + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                      </CarouselItem>
                    ))
                  ) : (
                    <CarouselItem>
                      <Card>
                        <CardContent className="flex aspect-square items-center justify-center p-6 text-gray-400">
                          No images available
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
              <div className="text-muted-foreground py-2 text-center text-sm">
                Slide {current} of {count}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className='my-4' />
      
    </div>
  );
};

RoomShow.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default RoomShow;

