import { Column, Table } from '@tanstack/react-table'
import React, { CSSProperties } from 'react'
import {
    flexRender,
} from '@tanstack/react-table';
import { Icon } from 'semantic-ui-react';
import DataTableDefaultColumnFilter from '../DataTableDefaultColumnFilter';
import { ColumnType } from '..';

interface DataTableHeadProps {
    table: Table<unknown>
}

export const getCommonPinningStyles = (column: Column<unknown, unknown>, pinned: boolean, isRow: boolean, table: Table<unknown>): CSSProperties => {

    const isGrouped = table?.getAllColumns().some(item => item.getIsGrouped());
    const isRowExpanded = table?.getRowModel().rows.some(row => row.getIsExpanded());

    const getBackground = () => {
        if (isRow) {
            return 'white'
        } {
            return '#ECF0F1'
        }
    }

    return {
        borderLeft: '1px solid rgba(34, 36, 38, 0.1)',
        right: (!isGrouped && pinned) || (isGrouped && isRowExpanded && pinned) ? `${column.getAfter()}px` : undefined,
        opacity: pinned ? 0.95 : 1,
        backgroundColor: getBackground(),
        position: pinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: pinned ? 1 : 0,
    }
}

const DataTableHead: React.FC<DataTableHeadProps> = (props) => {

    const { table } = props

    const columns = table.getAllColumns()

    return <>
        <thead>
            {table.getHeaderGroups().map((headerGroup) => {

                return <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {

                        const foundedColumnDef = columns.find(u => u.id === header.id)?.columnDef as ColumnType<unknown>

                        const isIcon = foundedColumnDef.isIcon

                        const pinned = foundedColumnDef.pinned ?? false

                        const columnCanSortable = header.column.columnDef.enableSorting ?? false
                        const columnCanFilter = header.column.columnDef.enableColumnFilter ?? false

                        const columnCanGrouped = header.column.columnDef.enableGrouping ?? false

                        const isSorted = header.column.getIsSorted()
                        const isGrouped = header.column.getIsGrouped()

                        const columnContent = flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                        )

                        const filterIconColor = isSorted ? 'text-primary' : 'text-tableHeaderIcon'

                        return !isIcon ? <th
                            key={header.id}
                            style={{ ...getCommonPinningStyles(header.column, false, false, table) }}
                            className=" p-2"
                        >
                            <div className='flex flex-row justify-center items-center'>
                                {
                                    columnCanSortable ?
                                        <div className='curspor-pointer' onClick={header.column.getToggleSortingHandler()} title={isSorted ? isSorted === 'desc' ? "Azalan" : "Artan" : "Sırala"}>
                                            {columnContent}
                                            {isSorted
                                                ? isSorted === 'desc'
                                                    ? <Icon className={`${filterIconColor} cursor-pointer`} name='sort down' />
                                                    : <Icon className={`${filterIconColor} cursor-pointer`} name='sort up' />
                                                : <Icon className={`${filterIconColor} cursor-pointer`} name='sort' />}
                                        </div>
                                        : columnContent
                                }
                                {columnCanGrouped ? <div className='cursor-pointer  ml-auto'>
                                    <span onClick={header.column.getToggleGroupingHandler()}>
                                        {!isGrouped ? <Icon name='thumbtack' className='text-tableHeaderIcon' /> : <Icon className='text-primary' name='thumbtack' />}
                                    </span>
                                </div> : null}
                                {columnCanFilter && (
                                    <DataTableDefaultColumnFilter dataLength={table.getRowCount()} column={header.column} />
                                )}
                            </div>
                        </th>
                            : <th
                                key={header.id}
                                style={{ ...getCommonPinningStyles(header.column, pinned, false, table) }}
                            >
                                <div className='flex flex-row justify-center items-center'>
                                    {columnContent}
                                </div>
                            </th>
                    })}
                </tr>
            })}
        </thead>
    </>
}
export default DataTableHead