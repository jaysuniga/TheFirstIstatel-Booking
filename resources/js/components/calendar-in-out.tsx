"use client"

import * as React from "react"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { format, parseISO } from "date-fns"

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
  const [clickCount, setClickCount] = React.useState(0)

  const formatDate = (date: Date | undefined) =>
    date ? format(date, "yyyy-MM-dd") : ""

  const handleSelectDate = (selected: DateRange | undefined) => {
    if (!selected?.from) return

    // First click → reset
    if (clickCount === 0) {
      setRange({ from: undefined, to: undefined })
      setClickCount(1)
    } else if (clickCount === 1) {
      setRange({ from: selected.from, to: undefined })
      setClickCount(2)
    } else if (clickCount === 2) {
      if (selected.from > selected.to!) {
        // Swap if user clicked before "from"
        setRange({ from: selected.to, to: selected.from })
        onChange?.(
          formatDate(selected.to),
          formatDate(selected.from)
        )
      } else {
        setRange({ from: selected.from, to: selected.to })
        onChange?.(
          formatDate(selected.from),
          formatDate(selected.to)
        )
      }
      setClickCount(0)
      setOpen(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <Input
          readOnly
          value={formatDate(range?.from)}
          placeholder="Check-in"
          onClick={() => setOpen(true)}
        />
        <Input
          readOnly
          value={formatDate(range?.to)}
          placeholder="Check-out"
          onClick={() => setOpen(true)}
        />
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="hidden">
            Select Dates
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] lg:max-w-[900px]">
          <DialogHeader>
            <DialogTitle>Select Check-in & Check-out Dates</DialogTitle>
          </DialogHeader>
          <Calendar
            mode="range"
            numberOfMonths={2}
            defaultMonth={range?.from}
            selected={range}
            onSelect={handleSelectDate}
            className="rounded-lg border shadow-sm [--cell-size:--spacing(11)] md:[--cell-size:--spacing(13)] mx-auto"
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
