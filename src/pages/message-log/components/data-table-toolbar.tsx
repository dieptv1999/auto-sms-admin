import {CalendarIcon, CheckIcon, Cross2Icon} from '@radix-ui/react-icons'
import {Table} from '@tanstack/react-table'

import {Button} from '@/components/custom/button'
import {Popover, PopoverContent} from '@/components/ui/popover'
import {PopoverTrigger} from "@/components/ui/popover.tsx";
import {cn} from "@/lib/utils.ts";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar.tsx";
import {DateRange} from "react-day-picker";
import {useEffect, useState} from "react";
import {ChevronsUpDownIcon, SearchIcon} from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command.tsx";
import {debounce} from "lodash";
import {AxiosResponse, HttpStatusCode} from "axios";
import {RepositoryFactory} from "@/api/repository-factory.ts";

const UserRepository = RepositoryFactory.get('user')

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    setColumnFilters: any
}

export function DataTableToolbar<TData>({
                                            table,
                                            setColumnFilters = () => {
                                            }
                                        }: DataTableToolbarProps<TData>) {
    const [date, setDate] = useState<DateRange | undefined>(undefined)
    const [user, setUser] = useState<any>()
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const isFiltered = user || date
    const [loadingSearchUser, setLoadingSearchUser] = useState<boolean>(false)

    const search = debounce(() => {
        let s: any[] = []
        if (date) {
            if (date.from) {
                s = [...s, {
                    id: 'startTime',
                    value: date.from,
                }]
            }

            if (date.to) {
                s = [...s, {
                    id: 'endTime',
                    value: date.to,
                }]
            }
        }

        if (user) {
            s = [...s, {
                id: 'createdBy',
                value: user,
            }]
        }

        setColumnFilters(s)
    }, 400)

    const searchUser = debounce((payload?: any) => {
        if (loadingSearchUser) return;
        setLoadingSearchUser(true)
        UserRepository.search({
            page: 0,
            limit: 10,
            ...(payload ?? {}),
        }).then((resp: AxiosResponse) => {
            if (resp.status === HttpStatusCode.Ok) {
                setSuggestions(resp.data?.data?.map((e: any) => e.username))
            } else {
                setSuggestions([])
            }
        }).finally(() => {
            setLoadingSearchUser(false)
        })
    }, 400, {trailing: true})

    useEffect(() => {
        searchUser()
    }, []);

    return (
        <div className='flex items-center justify-between'>
            <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
                {/*<Input*/}
                {/*    placeholder='Tài khoản...'*/}
                {/*    value={username}*/}
                {/*    onChange={(event) =>*/}
                {/*        setUsername(event.target.value)*/}
                {/*    }*/}
                {/*    className='h-8 w-[150px] lg:w-[250px]'*/}
                {/*/>*/}
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-[200px] justify-between"
                        >
                            {user
                                ? suggestions.find((framework) => framework === user)
                                : "Chọn người dùng..."}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                        <Command>
                            <CommandInput placeholder="Chọn người dùng..."
                                          onValueChange={(v) => searchUser({username: v})}/>
                            <CommandList>
                                <CommandEmpty>Không có dữ liệu.</CommandEmpty>
                                <CommandGroup>
                                    {suggestions.map((u) => (
                                        <CommandItem
                                            key={u}
                                            value={u}
                                            onSelect={(currentValue) => {
                                                setUser(currentValue === user ? "" : currentValue)
                                                setOpen(false)
                                                setTimeout(search, 500)
                                            }}
                                        >
                                            <CheckIcon
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    user === u ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {u}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
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
                            onClick={search}
                        >
                            <SearchIcon className='h-4 w-4'/>
                        </Button>
                        <Button
                            variant='ghost'
                            onClick={() => {
                                table.resetColumnFilters()
                                setUser('')
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
