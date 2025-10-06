import useMobile from '@Hooks/useMobile'
import { Table } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, Pagination, Select } from 'semantic-ui-react'

interface DataTablePaginationProps {
    table: Table<unknown>
    dataLength: number
    defaultPageSize: 14 | 20 | 30 | 45 | 5
    additionalCountPrefix?: string
}

const DataTablePagination: React.FC<DataTablePaginationProps> = ({ table, additionalCountPrefix, dataLength, defaultPageSize }) => {
    const { t } = useTranslation()

    const { isTablet } = useMobile()

    const pageSizes = [
        { key: '14', value: 14, text: '14' },
        { key: '20', value: 20, text: '20' },
        { key: '30', value: 30, text: '30' },
        { key: '45', value: 45, text: '45' },
    ]

    return dataLength > defaultPageSize ? <React.Fragment>
        <div className={`flex ${isTablet ? 'flex-col' : 'flex-row'} justify-between items-center w-full p-2`}>
            <Select
                className={`ml-2 ${isTablet ? '!hidden' : ''}`}
                placeholder='Set Page Size'
                value={table.getState().pagination.pageSize}
                onChange={(_, data) => {
                    table.setPageSize(Number(data.value))
                }}
                options={pageSizes}
            />
            <div className="pagination">
                <Pagination
                    className='row-pagination'
                    activePage={table.getState().pagination.pageIndex + 1}
                    boundaryRange={0}
                    onPageChange={(_, { activePage }) => {
                        table.setPageIndex(Number(activePage) - 1)
                    }}
                    siblingRange={1}
                    totalPages={table.getPageCount()}
                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                    firstItem={table.getCanPreviousPage() ? { content: <Icon name='angle double left' />, icon: true } : null}
                    lastItem={table.getCanNextPage() ? { content: <Icon name='angle double right' />, icon: true } : null}
                    prevItem={table.getCanPreviousPage() ? { content: <Icon name='angle left' />, icon: true } : null}
                    nextItem={table.getCanNextPage() ? { content: <Icon name='angle right' />, icon: true } : null}
                    pointing
                    secondary
                />
            </div>
            <div className='mr-2'>
                <p>{`${t('Components.Datatable.Label.Total')} ${dataLength}${additionalCountPrefix ? ` / ${additionalCountPrefix}` : ''} ${t('Components.Datatable.Label.Record')}`}</p>
            </div>
        </div>
    </React.Fragment> : null
}
export default DataTablePagination