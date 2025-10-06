import FormButton from '@Components/Common/FormButton';
import { flexRender, Row, Table } from '@tanstack/react-table';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Divider, Modal } from 'semantic-ui-react';
import { ColumnType } from '..';

interface DataTableMobileProps {
    table: Table<unknown>
}

const DataTableMobile: React.FC<DataTableMobileProps> = (props) => {

    const { table } = props
    const { t } = useTranslation()
    const [openedRecord, setOpenedRecord] = useState<string | null>(null)

    const getTrigger = (row: Row<unknown>, id: string) => {

        return <div key={id} className='w-full flex justify-center items-center'>
            <div className='bg-white cursor-pointer w-full flex flex-col items-start gap-4 justify-between shadow-md m-2 p-2 rounded-lg shadow-[#DDDD] border-[#DDDD] hover:border-primary border-[1px]  transition-all ease-in-out duration-300  border-b-[#2355a0] border-b-4 hover:border-b-4'>
                <div className='flex w-full flex-col justify-start items-start'>
                    {row.getVisibleCells().map((cell) => {
                        const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                        const foundedColumnDef = cell.getContext().column?.columnDef as ColumnType<unknown>
                        const isMobile = foundedColumnDef?.isMobile

                        return isMobile ? <div key={cell.id} className="mb-2" >
                            <strong>{cell.column.columnDef.header as any}:</strong>{' '}
                            {cellContent}
                        </div> : null
                    })}
                </div>
            </div>
        </div>
    }

    return <div className="flex flex-col gap-2">
        {table.getRowModel().rows.map((row) => {
            const rowData = row.original as any
            const Uuid = rowData?.Uuid ? String(rowData?.Uuid) : String(row.index)
            return <Modal
                key={Uuid}
                open={openedRecord === Uuid}
                onOpen={() => setOpenedRecord(Uuid)}
                onClose={() => setOpenedRecord(null)}
                trigger={getTrigger(row, Uuid)}
            >
                <Modal.Header>{t('Components.Datatable.Label.RowDetails')}</Modal.Header>
                <Modal.Content scrolling>
                    <Modal.Description className='flex flex-col gap-2'>
                        {row.getVisibleCells().map((cell, index) => {
                            const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                            return <React.Fragment key={`${cell.id}-${index}-fragment`}>
                                <div key={`${cell.id}-${index}-div`} className="mb-2 w-full flex flex-row justify-between items-center" >
                                    <strong>{cell.column.columnDef.header as any}:</strong>{' '}
                                    {cellContent}
                                </div>
                                <Divider key={`${cell.id}-${index}-divider`} />
                            </React.Fragment>
                        })}
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions className='!mb-8'>
                    <FormButton
                        secondary
                        text={t('Common.Button.Close')}
                        onClick={() => {
                            setOpenedRecord(null)
                        }}
                    />
                </Modal.Actions>
            </Modal>
        })}
    </div >
}
export default DataTableMobile