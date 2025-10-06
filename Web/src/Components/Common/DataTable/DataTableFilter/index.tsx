import { Column, ColumnFilter } from '@tanstack/react-table'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from 'semantic-ui-react'

interface DataTableFilterProps {
    columns: Column<any, unknown>[]
    columnFilters: ColumnFilter[]
    setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFilter[]>>
}

const DataTableFilter: React.FC<DataTableFilterProps> = (props) => {

    const { columnFilters: filters, setColumnFilters, columns } = props

    const { t } = useTranslation()

    return filters.length > 0 ?
        <div className='flex items-center flex-wrap px-4 py-2'>
            <span className='font-bold text-tableFilterText ml-1 p-1 mb-1'><Icon name='filter' />{t('Components.Datatable.Label.Filters')}</span>
            <React.Fragment>
                {filters.map(filter => {
                    const foundedColumn = columns.find(u => u.id === filter.id)
                    const columnHeader = foundedColumn?.columnDef.header?.toString() ?? ''

                    return Array.isArray(filter.value) && filter.value.length > 0 ?
                        filter.value.map((subItem, index) => (
                            <div key={index} className='text-primary font-bold bg-gray-200 rounded-2xl px-2 py-1 gap-2 '>
                                <span>{foundedColumn ? columnHeader : filter.id}:</span>
                                {subItem}
                                <Icon
                                    name='times circle'
                                    onClick={() => { setColumnFilters(prev => prev.filter(u => u.id !== filter.id)) }}
                                    className='cursor-pointer'
                                />
                            </div>))
                        :
                        <span className='text-primary font-bold bg-gray-200 rounded-2xl px-2 py-1 gap-2 '>
                            <span className='px-2'>{foundedColumn ? columnHeader : filter.id}:</span>
                            {String(filter.value)}
                            <Icon
                                name='times circle'
                                onClick={() => { setColumnFilters(prev => prev.filter(u => u.id !== filter.id)) }}
                                className='cursor-pointer'
                            />
                        </span>

                })}
                <span
                    onClick={() => setColumnFilters([])}
                    className='text-warning px-2 font-bold cursor-pointer'
                >
                    {t('Common.Button.Clear')}
                </span>
            </React.Fragment>
        </div>
        : null
}
export default DataTableFilter