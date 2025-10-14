import AppLayout from '@/layouts/app-layout';
import { Bed, Car, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, Fullscreen, List, Mail, MapPin, Maximize, Maximize2, PencilLine, PhilippinePeso, Phone, SquareArrowOutUpRight, Users } from 'lucide-react';
import * as React from "react"
import Heading from '@/components/heading';
import { User, type BreadcrumbItem } from '@/types';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from '@/components/ui/separator';
import { Room } from '@/types/room';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Head, Link, useForm} from '@inertiajs/react';
import bookingRoutes from '@/routes/bookings';
import { BookingFormData } from '@/types/booking';
import BookingDatePicker from '@/components/calendar-in-out';
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from '@/components/ui/textarea';
import { format, parseISO } from "date-fns"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

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

const BookingCreate = ({ rooms }: Props) => {

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
  const { data, setData, post, processing, errors} = useForm<BookingFormData>(
    getDefaultFormData()
  );

  const [daysDifference, setDaysDifference] = React.useState(1);

  const calculateDaysBetweenDates = (startDate?: string | null, endDate?: string | null): number => {
    if (!startDate || !endDate) return 1;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 1;

    const timeDiff = end.getTime() - start.getTime();
    return Math.max(1, timeDiff / (1000 * 60 * 60 * 24));
  };


  React.useEffect(() => {
    const days = calculateDaysBetweenDates(data.booking_date_from, data.booking_date_to);
    setDaysDifference(days);
  }, [data.booking_date_from, data.booking_date_to]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log('Submitting room data:', data);

    post(bookingRoutes.store.url(), {
      onSuccess: () => {
        toast.success('Room created!');
      },
    });
  };


  const [currentPage, setCurrentPage] = React.useState(1);
  const handleBackPage = () => {
    setSelectedRoom(null);
    setCurrentPage(1);
  };

  const [selectedRoom, setSelectedRoom] = React.useState<number | null>(null);
  const selectedRoomObj = rooms.find(room => room.id === selectedRoom);

  const handleRoomSelect = (roomId: number) => {
    setData({ ...data, room_id: roomId });
    setSelectedRoom(roomId);
    setCurrentPage(2);
  };

  const [progress, setProgress] = React.useState(0)
  
  React.useEffect(() => {
    switch (currentPage) {
      case 1:
        setProgress(50);
        break;
      case 2:
        setProgress(100);
        break;
      default:
        setProgress(0);
    }
  }, [currentPage]);

  const timeSlots = [
    { value: "00:00", label: "Early check in" },
    { value: "00:30", label: "Early check in" },
    { value: "01:00", label: "Early check in" },
    // ...
    { value: "14:00", label: "free of charge" },
    { value: "14:30", label: "free of charge" },
    // ...
  ];


  const parseToDate = (date: string | null | undefined): Date | undefined => {
    if (date) {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate; // Return undefined if it's an invalid date
    }
    return undefined;
  };
  const formatMonth = (date: Date | undefined) => 
    date ? format(date, "MMMM") : "";  // Formats to "13 October"

  const formatDayNumber = (date: Date | undefined): string =>
    date ? format(date, "d") : "";

  const formatDayText = (date: Date | undefined): string =>
    date ? format(date, "EEEE") : ""; // Formats to full day name like "Monday"
  
  return (
    <div className="mx-auto w-full max-w-8xl p-4 sm:px-6 lg:px-8">
      <Head title="Booking" />
      <Toaster position='top-center' />

      <div>
        <h1 className='text-5xl text-main-accent-secondary font-serif'>Reservations</h1>
      </div>

      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="bg-main-accent-secondary/10 border border-main-accent-secondary/20 overflow-hidden my-4">
          <div className='bg-main-accent-secondary/40 p-4 grid grid-cols-3 gap-4'>
            <BookingDatePicker
              defaultFrom={data.booking_date_from}
              defaultTo={data.booking_date_to}
              onChange={(from, to) =>
                setData((prev) => ({
                  ...prev,
                  booking_date_from: from,
                  booking_date_to: to,
                }))
              }
            />
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <div className='w-full flex items-center justify-between gap-6 px-4 py-1 bg-white rounded-md cursor-pointer border hover:border-main-accent-secondary hover:ring-1 hover:ring-main-accent-secondary/20'>
                    <div className=''>          
                      <div className='text-muted-foreground text-xs'>Guest</div>
                      <div className="text-md">
                        1 Adult
                      </div>
                    </div>
                    <ChevronDown className="text-main-accent-secondary" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className='w-100' align='start'>
                  <div className='grid grid-cols-2 gap-4'>          
                    <div>
                      <div className='text-muted-foreground text-xs'>Adult</div>
                      <div className="text-xl bg-main-accent-secondary/10 flex justify-between items-center font-bold text-main-accent-secondary">
                        <div className='p-1 px-2 bg-main-accent-secondary/20'>-</div>
                        <div>1</div>
                        <div className='p-1 px-2 bg-main-accent-secondary/20'>+</div>
                      </div>
                    </div>

                    <div>
                      <div className='text-muted-foreground text-xs'>Children under 13 years old</div>
                      <div className="text-xl bg-main-accent-secondary/10 flex justify-between items-center font-bold text-main-accent-secondary">
                        <div className='p-1 px-2 bg-main-accent-secondary/20'>-</div>
                        <div>1</div>
                        <div className='p-1 px-2 bg-main-accent-secondary/20'>+</div>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="w-full">
            <div className='grid grid-cols-3 items-center p-4'>
              <div>
                {currentPage === 1 ? (
                  <Link href={bookingRoutes.index()}>
                    <Button type="button" className='bg-transparent py-5 px-2 text-main-accent-secondary text-md uppercase hover:bg-main-accent-secondary/10 hover:text-main-accent-secondary font-light'>
                      <ChevronLeft className="mr-2" size={16} />
                      Back to Records
                    </Button>
                  </Link>
                ) : ( 
                  <Button type="button" onClick={handleBackPage} className='bg-transparent py-5 px-2 text-main-accent-secondary text-md uppercase hover:bg-main-accent-secondary/10 hover:text-main-accent-secondary font-light'>
                    <ChevronLeft size={16} />
                    Back to Rooms
                  </Button>
                )}
              </div>

              <div className='text-center font-semibold text-main-accent-secondary uppercase text-lg'>
                {currentPage === 1 ? 'Select A Room' : 'Details of your stay'}
              </div>

              <div className='ml-auto'>
                {currentPage === 2 && (
                    <Button type="submit" disabled={processing} className="py-5 text-sm font-bold uppercase bg-green-700 hover:bg-green-800">
                      Submit Booking
                      <Check size={16} />
                    </Button>
                )}
              </div>
            </div>
            <Progress value={progress} className="w-full bg-main-accent-secondary/20 h-1" classNameChildren='bg-main-accent-secondary'/>
            {currentPage === 1 && (
                <div className="flex flex-col gap-6 p-6">

                  <div className="flex items-center p-4 border rounded-md gap-2 bg-white">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className='border-main-accent-secondary text-main-accent-secondary rounded-full text-xs hover:bg-main-accent-secondary/10 hover:text-main-accent-secondary font-light'>Bed Preference <ChevronDown /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-48" align='start'>
                      <div>
                        <div className="text-sm font-semibold text-muted-foreground">Bed Types</div>

                        <Label className="hover:bg-accent/50 flex items-start gap-2 rounded-md border p-2 has-[[aria-checked=true]]:border-main-accent-secondary has-[[aria-checked=true]]:bg-main-accent-secondary/20 dark:has-[[aria-checked=true]]:border-main-accent-secondary dark:has-[[aria-checked=true]]:bg-main-accent-secondary/20">
                          <Checkbox
                            id="toggle-2"
                            defaultChecked
                            className="data-[state=checked]:border-main-accent-secondary data-[state=checked]:bg-main-accent-secondary data-[state=checked]:text-white dark:data-[state=checked]:border-main-accent-secondary dark:data-[state=checked]:bg-main-accent-secondary"
                          />
                          <div className="grid gap-1.5 font-normal">
                            Double Bed
                          </div>
                        </Label>
                      </div>
                    </PopoverContent>
                  </Popover>
                  </div>

                  <div className="px-2 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {/* Map through rooms and display them as cards */}
                    {rooms.map((room) => ( 
                      <Card
                        key={room.id}
                        className="cursor-pointer p-0 overflow-hidden gap-0 rounded-md"                      
                      >
                        <CardHeader className='p-0'>
                          <div>
                            <img
                              src={room.image?.startsWith('http') ? room.image : `/storage/${room.image}`}
                              alt="Room"
                              className="w-full aspect-video object-cover"
                            />
                          </div>
                        </CardHeader>
                        <CardContent className='mt-2'>
                            <h1 className='font-black text-main-accent-secondary text-2xl py-2'>{room.name}</h1>

                            <p className="text-xs flex items-center"><Users size={12} className='mr-2'/>up to {room.capacity} guests</p>
                            <p className="text-xs flex items-center"><Maximize2 size={12} className='mr-2'/>45 m<sup>2</sup></p>

                            <p className="text-green-700 font-black mt-2 text-xl flex">
                              <span className='font-medium'>₱</span>
                              {new Intl.NumberFormat().format(room.price)}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">{daysDifference} {daysDifference > 1 ? 'nights' : 'night'}/ 2 guests</p>
                        </CardContent>
                        <CardFooter className='p-4'>
                            <Button type='button' variant="outline" onClick={() => handleRoomSelect(room.id)} className='w-full bg-main-accent-secondary font-black text-white hover:bg-main-accent-secondary/80 hover:text-white'>Select Room</Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
            )}

            {/* Page 2: Customer Details */}
            {currentPage === 2 && (
              <div className="grid grid-cols-3 gap-6 p-6">
                <div className='flex flex-col col-span-2 gap-6'>
                  <Card className='p-0 gap-0 m-0'>
                    <CardHeader className='py-4'>
                      <CardTitle className='text-xl font-medium text-main-accent-secondary'>Customer</CardTitle>
                    </CardHeader>
                  <Separator className='bg-main-accent-secondary/50' />

                    <CardContent className='p-4 space-y-6'>
                      <div className='flex items-center gap-4'>
                        <p>I&apos;m booking for</p>
                        <ToggleGroup variant="outline" type="single">
                          <ToggleGroupItem value="bold" aria-label="Toggle bold" className='border-main-accent-secondary text-main-accent-secondary data-[state=on]:text-main-accent-secondary data-[state=on]:bg-main-accent-secondary/20'>
                            Myself
                          </ToggleGroupItem>
                          <ToggleGroupItem value="italic" aria-label="Toggle italic" className='border-main-accent-secondary text-main-accent-secondary data-[state=on]:text-main-accent-secondary data-[state=on]:bg-main-accent-secondary/20'>
                            Someone else
                          </ToggleGroupItem>
                        </ToggleGroup>
                      </div>
                  <Separator className='bg-main-accent-secondary/50' />
                      <div className="grid grid-cols-2 gap-6">
                        {/* First Name */}
                          <div>
                            <Input
                              id="first_name"
                              type="text"
                              value={data.first_name ?? ''}
                              onChange={(e) => setData('first_name', e.target.value)}
                              placeholder="First Name"
                              className="border border-dashed border-neutral-400"
                            />
                            {errors.first_name && <p className="text-sm text-red-600">{errors.first_name}</p>}
                          </div>

                        {/* Last Name */}
                          <div>
                            <Input
                              id="last_name"
                              type="text"
                              value={data.last_name ?? ''}
                              onChange={(e) => setData('last_name', e.target.value)}
                              placeholder="Last Name"
                              className="border border-dashed border-neutral-400"
                            />
                            {errors.last_name && <p className="text-sm text-red-600">{errors.last_name}</p>}
                          </div>

                        {/* Contact */}
                          <div>
                            <Input
                              id="contact_number"
                              type="text"
                              value={data.contact_number ?? ''}
                              onChange={(e) => setData('contact_number', e.target.value)}
                              placeholder="Contact Number"
                              className="border border-dashed border-neutral-400"
                            />
                            {errors.contact_number && <p className="text-sm text-red-600">{errors.contact_number}</p>}
                          </div>

                        {/* Email */}
                          <div>
                            <Input
                              id="email"
                              type="email"
                              value={data.email ?? ''}
                              onChange={(e) => setData('email', e.target.value)}
                              placeholder="Email Address"
                              className="border border-dashed border-neutral-400"
                            />
                            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                          </div>

                      </div>
                      <div className="flex items-center gap-3">
                        <Checkbox id="terms" className='' />
                        <Label htmlFor="terms">I give my Consent to receive news and information about special offers</Label>
                      </div>
                    </CardContent>                  
                  </Card>

                  <Card className='p-0 gap-0 m-0'>
                    <CardHeader className='py-4'>
                      <CardTitle className='text-xl font-medium text-main-accent-secondary'>Additional Information</CardTitle>
                    </CardHeader>
                  <Separator className='bg-main-accent-secondary/50' />
                    <CardContent className='p-4 space-y-6'>
                      <div className='grid grid-cols-2 gap-6'>
                        <div>
                          <Label htmlFor="check-in">Check-in Time</Label>
                          <div>
                            <Select >
                              <SelectTrigger className="w-full" id='check-in'>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                              <SelectContent className='max-h-60' >
                                <SelectGroup>
                                  <SelectLabel>Time Slots</SelectLabel>
                                  {timeSlots.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                      {value} - {label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="check-out">Check-in Time</Label>
                          <div>
                            <Select>
                              <SelectTrigger className="w-full" id='check-out'>
                                <SelectValue placeholder="Select a time" />
                              </SelectTrigger>
                              <SelectContent className='max-h-60'>
                                <SelectGroup>
                                  <SelectLabel>Time Slots</SelectLabel>
                                  {timeSlots.map(({ value, label }) => (
                                    <SelectItem key={value} value={value}>
                                      {value} - {label}
                                    </SelectItem>
                                  ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                  <Separator className='bg-main-accent-secondary/50' />
                      <div className="grid w-full gap-4">
                        <Label htmlFor="message-2">Personal Request</Label>
                        <Textarea placeholder="If you have any special needs, please feel free to share them with us. We&apos;ll do our best to help you" id="message-2" />
                        <p className="text-muted-foreground text-sm">
                          Your message will be copied to the support team.
                        </p>
                      </div>
                    </CardContent>                  
                  </Card>
                </div>

                <Card className='p-0 gap-0 m-0 overflow-hidden'>
                  <CardHeader className='py-4'>
                    <CardTitle className='text-xl font-medium text-main-accent-secondary'>Booking Summary</CardTitle>
                  </CardHeader>
                  <Separator className='bg-main-accent-secondary/50' />
                  <CardContent className='p-0'>
                    <div className='bg-main-accent-secondary/10 px-6 py-2 font-extrabold text-sm'>
                      {daysDifference} {daysDifference > 1 ? 'nights' : 'night'}
                    </div>
                    <div className='flex gap-2 justify-between p-6'>
                      <div className='text-md'>
                        <p><span className='font-black text-xl'>{formatDayNumber(parseToDate(data.booking_date_from))}</span> {formatMonth(parseToDate(data.booking_date_from))}</p>
                        <p className='text-sm text-muted-foreground'>{formatDayText(parseToDate(data.booking_date_from))}</p>
                      </div>
                       — 
                      <div className='text-md'>
                        <p><span className='font-black text-xl'>{formatDayNumber(parseToDate(data.booking_date_to))}</span> {formatMonth(parseToDate(data.booking_date_to))}</p>
                        <p className='text-sm text-muted-foreground'>{formatDayText(parseToDate(data.booking_date_to))}</p>
                      </div>
                    </div>
                  </CardContent>
                  <Separator className='bg-main-accent-secondary/50' />
                  <CardContent className='p-0'>
                    <div className='bg-main-accent-secondary/10 px-6 py-2 font-extrabold text-sm'>
                      <div className='flex justify-between'>
                        <p>Room: </p>{selectedRoomObj && (<p><span className='font-medium'>₱</span> {new Intl.NumberFormat().format(selectedRoomObj.price)}</p>)}
                      </div>                      
                    </div>
                    <div className='px-6'>
                      <Accordion type="single" collapsible>
                        <AccordionItem value="item-1">
                          <AccordionTrigger className='font-black text-md text-main-accent-secondary'>{selectedRoomObj?.name}</AccordionTrigger>
                          <AccordionContent>
                            <div className='text-sm font-semibold'>3 adults with main occupancy</div>
                            <div>Ber Online Super Savings	₱30,000</div>
                            <Separator className='my-2' />
                            <div className='flex justify-between font-black text-md text-green-600'>
                              <p>Discount</p>
                              <p>−₱16,150</p>
                            </div> 
                            <Separator className='my-2' />
                            <div className='flex flex-col gap-1'>
                              <div className='font-black'>Services</div>
                              <div>
                                <div className='flex justify-between'>
                                  <p>Breakfast</p>
                                  <p>Included</p>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </CardContent>
                  <Separator className='bg-main-accent-secondary/50' />
                  <CardContent className='p-0'>
                    <div className='text-3xl text-right p-6 font-black text-main-accent-secondary'><span className='font-medium'>₱</span> 13,850</div>
                  </CardContent>

                  <CardFooter className='mt-auto flex flex-col p-0'>
                    <Separator className='bg-main-accent-secondary/50' />
                    <div className='text-center bg-main-accent-secondary/20 w-full p-2 text-sm text-main-accent-secondary flex items-center justify-center gap-2'>Booking Summary<SquareArrowOutUpRight size={14} /></div>
                  </CardFooter>
                </Card>
              </div>
            )}
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

