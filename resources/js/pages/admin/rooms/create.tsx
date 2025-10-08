import AppLayout from '@/layouts/app-layout';
import { ArrowUpDown, ImagePlus, ImageUp, Layers, List, MoreHorizontal, PencilLine, PhilippinePeso, Rotate3D, Trash, Trash2, Users, X } from 'lucide-react';
import * as React from "react"
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
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
import roomRoutes from '@/routes/rooms';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Rooms',
    href: '/rooms',
  },
  {
    title: 'Create',
    href: '/rooms/create',
  },
];

type RoomFormData = {
  room_number: string;
  room_type_id: number;
  capacity: number;
  price: number;
  status: string;
  images: File[];
  image_360: File;
};

type Props = {
  rooms: Room[];
  room_types: RoomType[];
}

const RoomCreate = ({ rooms,room_types }: Props) => {

  const getDefaultRoomFormData = (): RoomFormData => ({
    room_number: '',
    room_type_id: 0,
    capacity: 1,
    price: 0,
    status: 'available',
    images: [],
    image_360: new File([], ''),
  });

  const { data, setData, post, processing, errors, reset } = useForm<RoomFormData>(
    getDefaultRoomFormData()
  );

  const [priceInput, setPriceInput] = React.useState(String(data.price ?? ''));

  React.useEffect(() => {
    setPriceInput(String(data.price ?? ''));
  }, [data.price]);


  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const fileArray = Array.from(files);

    const invalidFiles = fileArray.filter(file =>
      !validImageTypes.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      alert('Only image files (JPEG, PNG, GIF, WebP) under 5MB are allowed.');
      e.target.value = ''; // Clear the input
      return;
    }

    const uniqueNewFiles = fileArray.filter(
      (newFile) =>
        newFile.size <= MAX_FILE_SIZE &&
        !data.images.some(
          (existingFile) =>
            existingFile.name === newFile.name && existingFile.size === newFile.size
        )
    );

    setData('images', [...data.images, ...uniqueNewFiles]);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files);
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    const invalidFiles = files.filter(
      (file) =>
        !validImageTypes.includes(file.type) || file.size > MAX_FILE_SIZE
    );

    if (invalidFiles.length > 0) {
      alert('Only image files (JPEG, PNG, GIF, WebP) under 5MB are allowed.');
      return;
    }

    const uniqueNewFiles = files.filter(
      (newFile) =>
        newFile.size <= MAX_FILE_SIZE &&
        !data.images.some(
          (existingFile) =>
            existingFile.name === newFile.name && existingFile.size === newFile.size
        )
    );

    setData('images', [...data.images, ...uniqueNewFiles]);
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...data.images];
    updatedFiles.splice(index, 1);
    setData('images', updatedFiles);
  };


  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");

  const handle360FileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUrlInput("");
      setData("image_360", file);
    }
  };

  const handle360FileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setUrlInput("");
      setData("image_360", file);
    }
  };

  const handleUseUrl = () => {
    if (urlInput.trim()) {
      setPreviewUrl(urlInput.trim());
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setUrlInput("");
    setData("image_360", new File([], ""));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting room data:', data);

    post(roomRoutes.store.url(), {
      forceFormData: true,
      onSuccess: () => {
        toast.success('Room created!');
      },
    });
  };

  console.log(roomRoutes.store.url())

  return (
    <div className="mx-auto w-full max-w-8xl p-4 sm:px-6 lg:px-8">
      <Head title="Room Types" />
      <Toaster position='top-center' />

      <Heading title="Create Room" description="Create new rooms, view details, and update existing records with ease." />

      <Separator className='my-4' />

      <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
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
                      value={data.room_number}
                      onChange={(e) => setData('room_number', e.target.value)}
                      placeholder='Enter room number here'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.room_number && <p className="text-sm text-red-600">{errors.room_number}</p>}
                </div>
                {/*room type*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <Layers size={16} />
                    <Label className='font-semibold'>Room Type</Label>
                  </div>
                  <div className='px-4'>
                    <Select
                      value={data.room_type_id === 0 ? '' : data.room_type_id.toString()}
                      onValueChange={(value) => setData('room_type_id', Number(value))}
                    >
                      <SelectTrigger className='border border-dashed border-neutral-400 w-full'>
                        <SelectValue placeholder="Room Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Room Types</SelectLabel>
                          {room_types.map((type) => (
                            <SelectItem key={type.id} value={type.id.toString()}>{type.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.room_type_id && <p className="text-sm text-red-600">{errors.room_type_id}</p>}
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
                      value={data.capacity}
                      onChange={(e) => setData('capacity', Number(e.target.value))}
                      min={1}
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                  {errors.capacity && <p className="text-sm text-red-600">{errors.capacity}</p>}
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
                      className='border border-dashed border-neutral-400'
                      type="text"
                      inputMode="decimal"
                      value={priceInput}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Allow digits and optional one dot
                        if (/^\d*\.?\d*$/.test(value)) {
                          setPriceInput(value);
                        }
                      }}
                      onBlur={() => {
                        // Convert to float when focus leaves
                        const numericValue = parseFloat(priceInput);
                        setData('price', isNaN(numericValue) ? 0 : numericValue);
                      }}
                    />
                  </div>
                  {errors.price && <p className="text-sm text-red-600">{errors.price}</p>}
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
                {previewUrl ? (
                  // ✅ Show 360° preview
                  <div className="flex justify-center items-center mx-auto relative w-150 h-full rounded-lg overflow-hidden border">
                    <PanoramaViewer imageUrl={previewUrl} />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={handleRemove}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                ) : (
                  // ✅ Show upload UI + URL input
                  <div className="flex flex-col items-center gap-4 w-full">
                    <div
                      className="relative w-150 h-80 rounded-lg border border-dashed border-neutral-400 flex flex-col justify-center items-center text-muted-foreground"
                      onDrop={handle360FileDrop}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      <input
                        id="attachments"
                        type="file"
                        accept="image/*"
                        onChange={handle360FileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      />
                      <button
                        type="button"
                        className="w-50 h-full flex flex-col items-center justify-center"
                        onClick={() => document.getElementById("attachments")?.click()}
                      >
                        <Rotate3D />
                        <div className="px-4 text-center text-sm">
                          <span className="text-blue-800">Upload a 360 image</span> or drag and drop
                        </div>
                      </button>
                    </div>

                    <div className="flex w-150 gap-2 items-center">
                      <Input
                        type="text"
                        placeholder="Or enter a 360 image URL..."
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                      />
                      <Button type="button" onClick={handleUseUrl} disabled={!urlInput.trim()}>
                        Use URL
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='w-full flex flex-col gap-2 p-2'>
              <div className='flex items-center gap-2 mb-2'>
                <ImagePlus className='text-muted-foreground' size={14} />
                <div className='text-sm font-bold'>Room Images:</div>
              </div>
              <div className='h-100 w-full px-2 flex flex-col items-center justify-center gap-6'>
                <div className="relative w-150 h-full rounded-lg border border-dashed border-neutral-400 flex flex-col justify-center items-center text-muted-foreground"
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()} // Important: allows drop
                >
                  <input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  <button
                    type="button"
                    className="w-50 h-full flex flex-col items-center justify-center"
                    onClick={() => document.getElementById('attachments')?.click()}
                  >
                    <ImagePlus />
                    <div className="px-4 text-center text-sm">
                      <span className="text-blue-800">Upload a file</span> or drag and drop <br /> PNG, JPG, GIF up to 5MB
                    </div>
                  </button>
                </div>

                <div className="h-50 w-150 overflow-x-auto bg-neutral-100 rounded-lg dark:bg-neutral-900">
                  <div className="flex h-full space-x-4 pr-4">
                    {data.images.length > 0 ? (
                      data.images.map((file, index) => (
                        <div
                          key={index}
                          className="relative h-full aspect-square bg-neutral-200 shrink-0 rounded-lg shadow shadow-neutral-500"
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index}`}
                            className="w-full h-full rounded-md object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center text-gray-400 w-full h-full col-span-3">
                        No image attached yet
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className='my-4' />

          <div className='flex items-center justify-end'>
            <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>Create Room</Button>
          </div>
        </div>
      </form>

    </div>
  );
};

RoomCreate.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default RoomCreate;

