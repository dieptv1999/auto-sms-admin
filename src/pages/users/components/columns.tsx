import {ColumnDef} from '@tanstack/react-table'

import {Badge} from '@/components/ui/badge'
import {DataTableColumnHeader} from './data-table-column-header'
import {DataTableRowActions} from './data-table-row-actions'

export const columns: ColumnDef<any>[] = [
    {
        accessorKey: 'id',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='ID'/>
        ),
        cell: ({row}) => <div
            className='w-[200px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{row.getValue('id')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'username',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Username'/>
        ),
        cell: ({row}) => <div
            className='w-[150px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{row.getValue('username')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'email',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Email'/>
        ),
        cell: ({row}) => {
            return (
                <div className='flex space-x-2'>
                    <Badge variant='outline'>{row.getValue('email')}</Badge>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.firstName}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'status',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Status'/>
        ),
        cell: ({row}) => {
            return <Badge
                className={'whitespace-nowrap'}
                variant={row.getValue('status') === 'ACTIVE' ? 'default' : 'destructive'}>
                {row.getValue('status') === 'ACTIVE' ? "Hoạt động" : "Không hoạt động"}
            </Badge>
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id))
        },
    },
    {
        id: 'actions',
        cell: ({row}) => <DataTableRowActions row={row}/>,
    },
]
