import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Briefcase, Calendar, DollarSign, PieChart } from 'lucide-react';

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Bar, BarChart, LabelList, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--main-accent)",
  },
} satisfies ChartConfig

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4 h-50">
                    <div className="bg-blue-500 min-h-20 flex flex-col items-center justify-center gap-2 text-white rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className='flex items-center lg:flex-row gap-4'>
                            <Calendar className='size-5 md:size-8 lg:size-10' />
                            <h1 className="font-black text-2xl lg:text-4xl">120</h1>
                        </div>
                        <h3 className="text-sm font-medium text-center">Total Bookings</h3>
                    </div>

                    <div className="bg-violet-500 min-h-20 flex flex-col items-center justify-center gap-2 text-white rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className='flex items-center lg:flex-row gap-4'>
                            <PieChart className='size-5 md:size-8 lg:size-10' />
                            <h1 className="font-black text-2xl lg:text-4xl">80%</h1>
                        </div>
                        <h3 className="text-sm font-medium text-center">Occupancy Rate</h3>
                    </div>

                    <div className="bg-emerald-500 min-h-20 flex flex-col items-center justify-center gap-2 text-white rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className='flex items-center lg:flex-row gap-4'>
                            <DollarSign className='size-5 md:size-8 lg:size-10' />
                            <h1 className="font-black text-2xl lg:text-4xl">8,750</h1>
                        </div>
                        <h3 className="text-sm font-medium text-center">Revenue</h3>
                    </div>

                    <div className="bg-orange-300 min-h-20 flex flex-col items-center justify-center gap-2 text-white rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className='flex items-center lg:flex-row gap-4'>
                            <Briefcase className='size-5 md:size-8 lg:size-10' />
                            <h1 className="font-black text-2xl lg:text-4xl">12</h1>
                        </div>
                        <h3 className="text-sm font-medium text-center">Upcoming Check Ins</h3>
                    </div>
                </div>

                <div className='grid gap-4 grid-cols-3'>
                    <div className='col-span-2'>
                        <Card>
                            <CardHeader>
                                    <CardTitle>Area Chart</CardTitle>
                                    <CardDescription>
                                    Showing total visitors for the last 6 months
                                    </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ChartContainer config={chartConfig} className='aspect-auto h-[300px] w-full'>
                                        <AreaChart
                                            accessibilityLayer
                                            data={chartData}
                                            margin={{
                                            left: 12,
                                            right: 12,
                                            }}
                                        >
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                            dataKey="month"
                                            tickLine={false}
                                            axisLine={false}
                                            tickMargin={8}
                                            tickFormatter={(value) => value.slice(0, 3)}
                                            />
                                            <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="line" />}
                                            />
                                            <Area
                                            dataKey="desktop"
                                            type="natural"
                                            fill="var(--color-desktop)"
                                            fillOpacity={0.5}
                                            stroke="var(--color-desktop)"
                                            />
                                        </AreaChart>
                                </ChartContainer>
                            </CardContent>
                            <CardFooter>
                                <div className="flex w-full items-start gap-2 text-sm">
                                <div className="grid gap-2">
                                    <div className="flex items-center gap-2 leading-none font-medium">
                                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2 leading-none">
                                    January - June 2024
                                    </div>
                                </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className=''>
                        <Card>
                        <CardHeader>
                            <CardTitle>Bar Chart - Custom Label</CardTitle>
                            <CardDescription>January - June 2024</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ChartContainer config={chartConfig} className='aspect-auto h-[300px] w-full'>
                            <BarChart
                                accessibilityLayer
                                data={chartData}
                                layout="vertical"
                                margin={{
                                right: 16,
                                }}
                            >
                                <CartesianGrid horizontal={false} />
                                <YAxis
                                dataKey="month"
                                type="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                tickFormatter={(value) => value.slice(0, 3)}
                                hide
                                />
                                <XAxis dataKey="desktop" type="number" hide />
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                                />
                                <Bar
                                dataKey="desktop"
                                layout="vertical"
                                fill="var(--color-desktop)"
                                radius={4}
                                >
                                <LabelList
                                    dataKey="month"
                                    position="insideLeft"
                                    offset={8}
                                    className="fill-(--color-label)"
                                    fontSize={12}
                                />
                                <LabelList
                                    dataKey="desktop"
                                    position="right"
                                    offset={8}
                                    className="fill-foreground"
                                    fontSize={12}
                                />
                                </Bar>
                            </BarChart>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col items-start gap-2 text-sm">
                            <div className="flex gap-2 leading-none font-medium">
                            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="text-muted-foreground leading-none">
                            Showing total visitors for the last 6 months
                            </div>
                        </CardFooter>
                        </Card>
                    </div>
                </div>

            </div>
        </AppLayout>
    );
}
