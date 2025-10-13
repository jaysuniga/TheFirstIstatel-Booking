import * as React from "react"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { CalendarDay, DateRange } from "react-day-picker"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"
import { Calendar1, CalendarArrowUp, CalendarDays } from "lucide-react"
import { Label } from '@/components/ui/label';


interface BookingDatePickerProps {
  defaultFrom?: string | null
  defaultTo?: string | null
  onChange?: (from: string, to: string) => void
}

export default function BookingDatePicker({
  defaultFrom,
  defaultTo,
  onChange,
}: BookingDatePickerProps) {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: defaultFrom ? parseISO(defaultFrom) : undefined,
    to: defaultTo ? parseISO(defaultTo) : undefined,
  })
  const [open, setOpen] = React.useState(false)


  const formatDate = (date: Date | undefined) => 
    date ? format(date, "d MMMM") : "";  // Formats to "13 October"

  const parseToDate = (date: string | null | undefined): Date | undefined => {
    if (date) {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate; // Return undefined if it's an invalid date
    }
    return undefined;
  };


  return (
    <div className="flex gap-4">
      <div 
        className=" w-full flex items-center justify-between gap-6 px-4 bg-white rounded-md cursor-pointer border hover:border-main-accent-secondary hover:ring-1 hover:ring-main-accent-secondary/20"
        onClick={() => setOpen(true)}
      >
        <div className=''>          
          <div className='text-muted-foreground text-xs '>Check-in and Check-out</div>
          <div className="text-md">
            {formatDate(parseToDate(defaultFrom))} — {formatDate(parseToDate(defaultTo))}
          </div>
        </div>
        <CalendarDays className="text-main-accent-secondary" />
      </div>

      

      <Dialog open={open} onOpenChange={setOpen} modal={true}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hidden">
            Select Dates
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[600px] lg:max-w-[900px]" 
          showCloseButton={false}
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >        
          <DialogHeader>
            <DialogTitle className="bg-white rounded-lg p-4">Select Check-in & Check-out Dates</DialogTitle>            
          </DialogHeader>
          <Calendar
            mode="range"
            numberOfMonths={2}
            defaultMonth={range?.from}
            selected={range}
            onSelect={(range) => {
              setRange(range)

              if (range?.from && range?.to && onChange) {
                const formattedFrom = format(range.from, "yyyy-MM-dd")
                const formattedTo = format(range.to, "yyyy-MM-dd")
                onChange(formattedFrom, formattedTo)
              }

              console.log(range);

              if (range?.from && range?.to && range.from.getTime() !== range.to.getTime()) {
                setOpen(false);
              }
            }}

            className="rounded-lg border w-full shadow-sm [--cell-size:--spacing(11)] md:[--cell-size:--spacing(8)]"
            components={{
              DayButton: ({ children, modifiers, day, ...props }) => {
                const isWeekend =
                  day.date.getDay() === 0 || day.date.getDay() === 6

                return (
                  <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                    <div className="flex flex-col items-center">
                      <span>{children}</span>
                      {!modifiers.outside && (
                        <span className="text-[10px] text-gray-500">
                          {isWeekend ? "$220" : "$100"}
                        </span>
                      )}
                    </div>
                  </CalendarDayButton>
                )
              },
            }}
          />
        </DialogContent>        
      </Dialog>
    </div>
  )
}
