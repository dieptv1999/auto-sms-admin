import {ColumnDef} from '@tanstack/react-table'

import {Badge} from '@/components/ui/badge'
import {DataTableColumnHeader} from './data-table-column-header'
import {DataTableRowActions} from './data-table-row-actions'
import {formatCreatedDate} from "@/lib/utils.ts";

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
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.firstName}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'license',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='License Key'/>
        ),
        cell: ({row}) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.license}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'expireLicense',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Ngày hết hạn license'/>
        ),
        cell: ({row}) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {formatCreatedDate(row.original.expireLicense)}
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
