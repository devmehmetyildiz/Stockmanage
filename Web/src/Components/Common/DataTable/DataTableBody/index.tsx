import { flexRender, Table } from '@tanstack/react-table'
import React from 'react'
import { ColumnType } from '..'
import { Icon } from 'semantic-ui-react'
import { getCommonPinningStyles } from '../DataTableHead'

interface DataTableBodyProps {
    table: Table<unknown>
}

const DataTableBody: React.FC<DataTableBodyProps> = (props) => {

    const { table } = props

    return <tbody>
        {table.getRowModel().rows.map((row) => {

            const isGroupedRow = row.getIsGrouped();
            const canExpand = row.getCanExpand();
            const isExpanded = row.getIsExpanded();

            return <tr key={Math.random()}>
                {row.getVisibleCells().map((cell) => {
                    const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                    const columnDef = cell.column.columnDef as ColumnType<unknown>;
                    const isIcon = columnDef.isIcon;
                    const pinned = columnDef.pinned ?? false;

                    return (!isIcon ?
                        <td
                            style={{ ...getCommonPinningStyles(cell.column, false, true, table) }}
                            key={Math.random()}
                            className={`border p-2`}
                        >
                            {isGroupedRow && cell.column.id === row.groupingColumnId ? (
                                <div className="flex items-center gap-1">
                                    {canExpand && (
                                        <span
                                            onClick={row.getToggleExpandedHandler()}
                                            className="cursor-pointer"
                                        >
                                            <Icon
                                                className='text-info text-primary'
                                                name={isExpanded ? 'minus' : 'plus'}
                                            />
                                        </span>
                                    )}
                                    {row.getValue(cell.column.id)?.toString()}
                                    <span className="text-xs text-secondary ml-2">
                                        ({row.subRows.length})
                                    </span>
                                </div>
                            ) : (
                                cellContent
                            )}
                        </td>
                        : <td
                            style={{ ...getCommonPinningStyles(cell.column, pinned, true, table) }}
                            key={cell.id}
                        >
                            <div className='flex justify-center items-center'>
                                {!isGroupedRow ? cellContent : null}
                            </div>
                        </td>
                    );
                })}
            </tr>

        })}
    </tbody>
}
export default DataTableBody