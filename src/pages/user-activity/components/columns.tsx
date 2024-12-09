import {ColumnDef} from '@tanstack/react-table'
import {DataTableColumnHeader} from './data-table-column-header'
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
        accessorKey: 'type',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Type'/>
        ),
        cell: ({row}) => {
            return (
                <div className='flex space-x-2'>
                    <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {row.original.type}
          </span>
                </div>
            )
        },
    },
    {
        accessorKey: 'userAgent',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Agent'/>
        ),
        cell: ({row}) => <div
            className='min-w-[300px] max-w-[500px]'>{row.getValue('userAgent')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'os',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Operting System'/>
        ),
        cell: ({row}) => <div
            className='w-[50px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{row.getValue('os')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'createdAt',
        header: ({column}) => (
            <DataTableColumnHeader column={column} title='Created At'/>
        ),
        cell: ({row}) => <div
            className='w-[140px] whitespace-nowrap overflow-hidden overflow-ellipsis'>{formatCreatedDate(row.getValue('createdAt'))}</div>,
        enableSorting: false,
        enableHiding: false,
    },
]
