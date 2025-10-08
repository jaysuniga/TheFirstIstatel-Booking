import AppLayout from '@/layouts/app-layout';
import { Head, router,Link, useForm } from '@inertiajs/react';
import { ArrowUpDown, Eye, MoreHorizontal } from 'lucide-react';
import * as React from "react"
import {useState} from "react"
import { ColumnDef, ColumnFiltersState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable, VisibilityState, } from "@tanstack/react-table"
import { BadgeCheck, CornerDownRight, KeyRound, List, Mail, MapPin, Phone, Plus, UserRound, UserRoundPen, UserRoundPlus } from 'lucide-react';
import Heading from '@/components/heading';
import { User, type BreadcrumbItem } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"
import { Separator } from '@/components/ui/separator';
import { Room, RoomType } from '@/types/room';
import CustomTable from '@/components/table/custom-table';
import { toast } from 'sonner';
import userRoutes from '@/routes/users'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';


const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Rooms',
    href: '/rooms',
  },
];

type Role = {
  id: number;
  name: string;
}

type UserFormData = {
  first_name: string;
  last_name: string;
  contact_number: string;
  address: string;
  email: string;
  password: string;
  role_id:number;
};


type Props = {
  users: User[];
  roles:Role[];
}


export const columns: ColumnDef<User>[] = [
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
    accessorKey: "first_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="">{row.getValue("first_name")}</div>,
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="">{row.getValue("last_name")}</div>,
  },
  {
    accessorKey: "contact_number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="">{row.getValue("contact_number")}</div>,
  },
  {
    accessorKey: "address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Address
          <ArrowUpDown />
        </Button>
      )
    },
    cell: ({ row }) => <div className="">{row.getValue("address")}</div>,
  },
    //roles
    {
      accessorKey: "role",
      sortingFn: (rowA, rowB, columnId) => {
        const a = rowA.getValue(columnId)?.toString().toLowerCase() || "";
        const b = rowB.getValue(columnId)?.toString().toLowerCase() || "";
        return a.localeCompare(b);
      },
      header: ({ column }) => {
        const isSorted = column.getIsSorted(); // 'asc' | 'desc' | false
        const isActive = isSorted !== false;   // if this column is sorted
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Role
            <ArrowUpDown />
          </Button>
        )
      },
      cell: ({ row }) => {
        const roleString = row.getValue("role") as string;
        let bgColor = 'bg-yellow-500';
        if (roleString === 'staff admin') {
          bgColor = 'bg-blue-500';
        } else if (roleString === 'client') {
          bgColor = 'bg-neutral-500';
        }

        return (
          <div className={`capitalize text-xs text-white text-center px-3 py-1 rounded-full ${bgColor}`}>
            {roleString}
          </div>
        );
      },
    },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
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

const UserIndex = ({users, roles}: Props) => {

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
    data: users ?? [],
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

  const getDefaultUserFormData = (): UserFormData => ({
    first_name: '',
    last_name: '',
    contact_number: '',
    address: '',
    email: '',
    password: '',
    role_id: 0,
  });

  const { data, setData, post, processing, errors, reset } = useForm<UserFormData>(
    getDefaultUserFormData()
  );

  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    post(userRoutes.store.url(), {
      onSuccess: () => {
        toast.success('User created succesfully!');        
        setOpen(false);
        setData(getDefaultUserFormData());
      },
    });
  };

  const handleAddRoom = () => {    
    setOpen(true);
  }

  return (
    <div className="mx-auto w-full max-w-8xl p-4 sm:px-6 lg:px-8">
      <Head title="Room Types" />
      <Toaster position='top-center' />

      <Heading title="User Management" description="Create new users, view details, and update existing records with ease." />

      <Separator className='my-4' />

      <CustomTable
        table={table} 
        globalFilter={globalFilter} 
        setGlobalFilter={setGlobalFilter} 
        addButtonText="Add User"
        addButtonOnClick={handleAddRoom}
      />

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (isOpen){
            setData(getDefaultUserFormData());
          };          
        }}
      >
        <DialogContent className="sm:max-w-[425px] lg:max-w-[800px] p-0">
          <form onSubmit={handleSubmit} encType="multipart/form-data" autoComplete="off">
            <DialogHeader className='gap-0 p-4'>
              <DialogTitle className='flex items-center gap-2'>
                <UserRoundPlus className='text-muted-foreground'/>
                <div className='text-2xl'>Add User</div>
              </DialogTitle>

              <DialogDescription className='flex items-center gap-2 px-2'>
                <CornerDownRight className='text-muted-foreground' size={18}/>
                <div>Fill in the user details and assign role.</div>              
              </DialogDescription>
            </DialogHeader>          

            <Separator />
            <div className='w-full grid divide-x'>
              <div className='p-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <List className='text-muted-foreground' size={14}/>
                  <div className='text-sm font-bold'>User Details:</div>
                </div>

                <div className='px-2'>
                  <div className="grid grid-cols-2 gap-4 px-2">
                    {/*firstname*/}
                    <div className="grid gap-2">
                        <div className='flex items-center text-neutral-600 gap-2'>
                          <UserRound size={16}/>
                          <Label htmlFor="first_name" className='font-semibold'>First Name</Label>
                        </div>
                        <div className='px-4'>
                          <Input
                            id="first_name"
                            type="text"
                            value={data.first_name}
                            onChange={(e) => setData('first_name', e.target.value)}
                            placeholder='First name here'
                            className='border border-dashed border-neutral-400'
                          />
                        </div>
                        {errors.first_name && <p className="text-sm text-red-600">{errors.first_name}</p>}
                    </div>

                    {/*lastname*/}
                    <div className="grid gap-2">
                        <div className='flex items-center text-neutral-600 gap-2'>
                          <UserRoundPen size={16}/>
                          <Label htmlFor="last_name" className='font-semibold'>Last Name</Label>
                        </div>
                        <div className='px-4'>
                          <Input
                            id="last_name"
                            type="text"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            placeholder='Last name here'
                            className='border border-dashed border-neutral-400'
                          />
                        </div>
                        {errors.last_name && <p className="text-sm text-red-600">{errors.last_name}</p>}
                    </div>

                    {/*contact_number*/}
                    <div className="grid gap-2">
                        <div className='flex items-center text-neutral-600 gap-2'>
                          <Phone size={16}/>
                          <Label htmlFor="contact_number" className='font-semibold'>Contact Number</Label>
                        </div>
                        <div className='px-4'>
                          <Input
                            id="contact_number"
                            type="text"
                            value={data.contact_number}
                            onChange={(e) => setData('contact_number', e.target.value)}
                            placeholder='Format (09xxxxxxxxx or +639xxxxxxxxx)'
                            className='border border-dashed border-neutral-400'
                          />
                        </div>
                        {errors.contact_number && <p className="text-sm text-red-600">{errors.contact_number}</p>}
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
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder='Email here'
                            className='border border-dashed border-neutral-400'
                          />
                        </div>
                        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                    </div>

                    {/*address*/}
                    <div className="grid col-span-full gap-2">
                        <div className='flex items-center text-neutral-600 gap-2'>
                          <MapPin size={16}/>
                          <Label htmlFor="address" className='font-semibold'>Address</Label>
                        </div>
                        <div className='px-4'>
                          <Textarea
                            id="address"
                            value={data.address}
                            onChange={(e) => setData('address', e.target.value)}
                            placeholder='Address here'
                            className='resize-y max-h-50 border border-dashed border-neutral-400'
                          />
                        </div>
                        {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
                    </div>

                    {/*password*/}
                    <div className="grid gap-2">
                        <div className='flex items-center text-neutral-600 gap-2'>
                          <KeyRound size={16}/>
                          <Label htmlFor="password" className='font-semibold'>Password</Label>
                        </div>
                        <div className='px-4'>
                          <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder='Password here'
                            className='border border-dashed border-neutral-400'
                          />
                        </div>
                        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                    </div>

                    {/*Role*/}
                    <div className="grid gap-2">
                        <div className='flex items-center text-neutral-600 gap-2'>
                          <BadgeCheck size={16}/>
                          <Label className='font-semibold'>Roles</Label>
                        </div>
                        <div className='px-4'>
                          <Select                     
                            value={data.role_id === 0 ? '' : data.role_id.toString()}
                            onValueChange={(value) => setData('role_id', Number(value))}
                          >
                            <SelectTrigger className='w-full border border-dashed border-neutral-400'>
                              <SelectValue placeholder="Assign Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Role Types</SelectLabel>
                                {roles.map((role) => (
                                  <SelectItem key={role.id} value={role.id.toString()}>{role.name}</SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>                
                        </div>
                        {errors.role_id && <p className="text-sm text-red-600">{errors.role_id}</p>}
                    </div>            
                  </div>
                </div>
              </div>
            </div>
            
            <Separator />

            <DialogFooter className='p-4'>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={processing} className='bg-emerald-600 hover:bg-emerald-800'>Create User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

UserIndex.layout = (page: React.ReactNode) => (
  <AppLayout breadcrumbs={breadcrumbs}>{page}</AppLayout>
);

export default UserIndex;