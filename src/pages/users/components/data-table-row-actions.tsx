import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from "react-router-dom";
import { useUser } from '@/lib/store/userStore';

interface DataTableRowActionsProps<TData> {
    row: Row<TData>
}

export function DataTableRowActions<TData>({ row }: DataTableRowActionsProps<TData>) {
    const { setUpdateDeleteTimeData, setChangePlanData } = useUser()

    const d = row.original;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant='ghost'
                    className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
                >
                    <DotsHorizontalIcon className='h-4 w-4' />
                    <span className='sr-only'>Open menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-[260px]'>
                <DropdownMenuItem onClick={() => setChangePlanData(row.original)}>Change user plan</DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link to={`/user/${row.getValue('id')}`}>
                        Show activity
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {
                    setUpdateDeleteTimeData(d)
                }}>Change Number Days Delete Video</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Lock
                    <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
