import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
    ColumnDef,
    ColumnFilter,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
    VisibilityState,
    getGroupedRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getExpandedRowModel,
} from '@tanstack/react-table';
import DataTableGlobalFilter from './DataTableGlobalFilter';
import DataTableHead from './DataTableHead';
import DataTableBody from './DataTableBody';
import DataTableFilter from './DataTableFilter';
import './index.css'
import { TableMetaType } from '@Utils/FormatTableMeta';
import useExcel from '@Hooks/useExcel';
import DataTablePagination from './DataTablePagination';
import DataTableMobile from './DataTableMobile';
import { useGetPrivilegesQuery } from '@Api/Profile';
import NotfoundScreen from '../NotfoundScreen';
import useMobile from '@Hooks/useMobile';

export type ColumnType<T> = ColumnDef<T> & {
    isIcon?: boolean
    role?: string
    pinned?: boolean
    hidden?: boolean
    isMobile?: boolean
    order?: number
};

interface DataTableProps {
    columns: ColumnType<any>[]
    data: any
    config?: TableMetaType
    additionalCountPrefix?: string
}

const DataTable: React.FC<DataTableProps> = ({ columns: rawColumns, data: rawData, config, additionalCountPrefix }) => {
    const excel = useExcel()
    const setExcelData = excel?.setExcelData
    const [globalFilter, setGlobalFilter] = useState<string>('');
    const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);
    const defaultPageSize = 14
    const mobilePageSize = 5
    const { isTablet } = useMobile()

    const { data: privileges } = useGetPrivilegesQuery()

    const data = useMemo(() => {
        if (rawData && rawData.length > 0) {
            return rawData
        } else {
            return []
        }
    }, [rawData])

    const getColumns = () => {
        const filterColumns = (cols: ColumnType<any>[]) => {
            return cols.filter(column => {
                if (column.hidden) {
                    return !column.hidden
                }
                if (column.role) {
                    const userPrivileges = privileges || [] as string[]
                    return userPrivileges.includes(column.role) || userPrivileges.includes('admin')
                }
                return true
            })
        }

        if (rawColumns && rawColumns.length > 0) {
            return filterColumns(rawColumns)
        } else {
            return []
        }
    }

    const columns = getColumns()

    const hiddenColumns = useMemo(() => {
        let decoratedConfigs: VisibilityState = {}

        config?.hiddenColumns.forEach(item => {
            decoratedConfigs[item] = false
        })

        return decoratedConfigs
    }, [config])

    const tableColumns = useMemo(() => {
        const defaultColumnDef = {
            enableSorting: true,
            enableColumnFilter: true,
            enableGlobalFilter: true,
            enableGrouping: true,
            enablePinning: true,
        }

        return columns.map(col => ({
            ...defaultColumnDef,
            ...col,

        }))
    }, [columns])

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            globalFilter,
            columnFilters,
            columnVisibility: hiddenColumns,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getExpandedRowModel: getExpandedRowModel(),
        globalFilterFn: (row, columnId, filterValue) => {
            const value = String(row.getValue(columnId) ?? '');
            return value.toLowerCase().includes(filterValue.toLowerCase());
        },
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: defaultPageSize,
            },
        }
    });

    const handleMobilePagination = useCallback((isMobile: boolean) => {
        if (isMobile) {
            if (mobilePageSize !== table.getState().pagination.pageSize) {
                table.setPageSize(mobilePageSize)
            }
        } else {
            if (mobilePageSize === table.getState().pagination.pageSize) {
                table.setPageSize(defaultPageSize)
            }
        }
    }, [table, mobilePageSize, defaultPageSize])

    useEffect(() => {
        const rows = table.getCoreRowModel().rows.map(row => {
            const cells = row.getAllCells()
            let res = {} as any
            cells.forEach(cell => {
                const context = cell.getContext()
                const def = context.column.columnDef as ColumnType<any>
                const isVisible = context.column.getIsVisible()
                if (isVisible && !def.isIcon) {
                    const header = def.header as string
                    const value = context.getValue()
                    res[header] = value
                }
            })
            return res
        })
        if (setExcelData) {
            setExcelData(rows)
        }
    }, [setExcelData, data, table])

    useEffect(() => {
        handleMobilePagination(isTablet)
    }, [isTablet, handleMobilePagination])


    if (data.length <= 0) {
        return <NotfoundScreen />
    }

    return (
        <React.Fragment>
            <DataTableGlobalFilter
                globalFilter={globalFilter}
                setGlobalFilter={setGlobalFilter}
            />
            {isTablet ?
                <div className='w-full '>
                    <DataTableMobile
                        table={table}
                    />
                    <DataTablePagination
                        table={table}
                        dataLength={data.length}
                        additionalCountPrefix={additionalCountPrefix}
                        defaultPageSize={mobilePageSize}
                    />
                </div>
                :
                <div className='w-full'>
                    <div className=' transition-all ease-in-out duration-500 bg-white rounded-md shadow-xl w-full mb-12 '>
                        <DataTableFilter
                            columns={table.getAllColumns()}
                            columnFilters={columnFilters}
                            setColumnFilters={setColumnFilters}
                        />
                        <div className='w-full overflow-auto border-b-[1px] border-b-[rgba(34,36,38,.15)] border-b-solid'>
                            <table className='react-table overflow-auto   '>
                                <DataTableHead
                                    table={table}
                                />
                                <DataTableBody
                                    table={table}
                                />
                            </table>
                        </div>
                        <DataTablePagination
                            table={table}
                            dataLength={data.length}
                            additionalCountPrefix={additionalCountPrefix}
                            defaultPageSize={defaultPageSize}
                        />
                    </div>
                </div>
            }
        </React.Fragment >
    );
}
export default DataTable