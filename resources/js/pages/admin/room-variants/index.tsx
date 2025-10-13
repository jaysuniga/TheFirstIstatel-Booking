import AppLayout from '@/layouts/app-layout';
import { Head, router,useForm} from '@inertiajs/react';

import { ArrowUpDown, Bed, MoreHorizontal, PencilLine, SquareCheck } from 'lucide-react';
import * as React from "react"
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import Heading from '@/components/heading';
import { type BreadcrumbItem } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator';
import { Room, RoomVariant } from '@/types/room';
import CustomTable from '@/components/table/custom-table';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner';
import roomVariants from '@/routes/room-variants';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Room Types',
    href: '/roomtypes',
  },
];


type RoomVariantFormData = {
  room_id: number;
  room_number: string;
  status: 'occupied' | 'available' | 'maintenance';
};


type Props = {
  rooms: Room[];
  room_variants: RoomVariant[];
}

export const columns: ColumnDef<RoomVariant>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "room_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room Number
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="">{row.getValue("room_number")}</div>,
  },
  {
    accessorKey: "room_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Room Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="">{row.getValue("room_name")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const RoomIndex = ({rooms, room_variants }: Props) => {

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 100, // default 100
  })
  const table = useReactTable({
    data: room_variants ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      globalFilter,
    },
  })


  const [open, setOpen] = React.useState(false);

  const handleAddRoom = () => {
    setOpen(true);
  }

  const getDefaultFormData = (): RoomVariantFormData => ({
    room_id: 0,
    room_number:'',
    status: 'available',
  });

  const { data, setData, post, processing, errors, reset } = useForm<RoomVariantFormData>(
    getDefaultFormData()
  );
    
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting room data:', data);

    post(roomVariants.store.url(), {
      onSuccess: () => {
        toast.success('Room created!');
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <div className="mx-auto w-full max-w-8xl p-4 sm:px-6 lg:px-8">
      <Head title="Room Variants" />
      <Toaster position='top-center' />

      <Heading title="Room Variants Management" description="Create new room variants, view details, and update existing records with ease." />

      <Separator className='my-4' />

      <CustomTable
        table={table}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
        addButtonText="Add Room Variants"
        addButtonOnClick={handleAddRoom}
      />

      <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <form onSubmit={handleSubmit} className='space-y-2' >
              <DialogHeader>
                <DialogTitle>Create Room Variant</DialogTitle>
                <DialogDescription>
                  Fill the form below to create a new room variant.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
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
                        <SelectValue placeholder="Select a Room" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Rooms</SelectLabel>
                          {rooms.map((room) => (
                            <SelectItem key={room.id} value={room.id.toString()}>{room.name}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.room_id && <p className="text-sm text-red-600">{errors.room_id}</p>}
                </div>

                {/*room_number*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <PencilLine size={16} />
                    <Label htmlFor="room_number" className='font-semibold'>Room Number</Label>
                  </div>
                  <div className='px-4'>
                    <Input
                      id="room_number"
                      type="text"
                      value={data.room_number}
                      onChange={(e) => setData('room_number', e.target.value)}
                      placeholder='e.g., 101'
                      className='border border-dashed border-neutral-400'
                    />
                  </div>
                </div>
                {errors.room_number && <p className="text-sm text-red-600">{errors.room_number}</p>}

                {/*status*/}
                <div className="grid gap-2">
                  <div className='flex items-center text-neutral-600 gap-2'>
                    <SquareCheck size={16} />
                    <Label className='font-semibold'>Status</Label>
                  </div>
                  <div className='px-4'>
                    <Select
                      value={data.status}
                      onValueChange={(value) => setData('status', value as RoomVariantFormData['status'])}
                    >
                      <SelectTrigger className='border border-dashed border-neutral-400 w-full'>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Room Types</SelectLabel>
                          <SelectItem value='available'>Available</SelectItem>
                          <SelectItem value='maintenance'>Maintenance</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.status && <p className="text-sm text-red-600">{errors.status}</p>}
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={processing} >Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
      </Dialog>

    </div>
  );
};

RoomIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default RoomIndex;