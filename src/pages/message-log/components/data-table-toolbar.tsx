import {CalendarIcon, Cross2Icon} from '@radix-ui/react-icons'
import {Table} from '@tanstack/react-table'

import {Button} from '@/components/custom/button'
import {Input} from '@/components/ui/input'
import {Popover, PopoverContent} from '@/components/ui/popover'
import {PopoverTrigger} from "@/components/ui/popover.tsx";
import {cn} from "@/lib/utils.ts";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import {DateRange} from "react-day-picker";
import {useState} from "react";
import {SearchIcon} from "lucide-react";

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    setColumnFilters: any
}

export function DataTableToolbar<TData>({
                                            table,
                                            setColumnFilters = () => {}
                                        }: DataTableToolbarProps<TData>) {
    const [date, setDate] = useState<DateRange | undefined>(undefined)
    const [username, setUsername] = useState<string>('')
    const isFiltered = username || date

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                <Input
                    placeholder='Tài khoản...'
                    value={username}
                    onChange={(event) =>
                        setUsername(event.target.value)
                    }
                    className='h-8 w-[150px] lg:w-[250px]'
                />
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[300px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon/>
                            {date?.from ? (
                                date.to ? (
                                    <>
                                        {format(date.from, "LLL dd, y")} -{" "}
                                        {format(date.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(date.from, "LLL dd, y")
                                )
                            ) : (
                                <span className={'ml-1'}>Chọn ngày</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                        />
                    </PopoverContent>
                </Popover>
                {isFiltered && (
                    <>
                        <Button
                            variant='default'
                            size={'icon'}
                            onClick={() => {
                                console.log('search')
                                setColumnFilters([
                                    {
                                        id: 'createdBy',
                                        value: username,
                                    }
                                ])
                            }}
                        >
                            <SearchIcon className='h-4 w-4'/>
                        </Button>
                        <Button
                            variant='ghost'
                            onClick={() => {
                                table.resetColumnFilters()
                                setUsername('')
                                setDate(undefined)
                                setColumnFilters([])
                            }}
                            className='h-8 px-2 lg:px-3'
                        >
                            Reset
                            <Cross2Icon className='ml-2 h-4 w-4'/>
                        </Button>
                    </>
                )}
            </div>
            {/* <DataTableViewOptions table={table} /> */}
        </div>
    )
}
