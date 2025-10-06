import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import privileges from '@Constant/privileges'
import { CellContext } from '@tanstack/react-table'
import { FormatFullDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { PaymenttypeItem } from '@Api/Paymenttype/type'
import { useGetPaymenttypesQuery } from '@Api/Paymenttype'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, EditCellHandler } from '@Components/Common/CellHandler'
import PaymenttypeDeleteModal from '@Components/Paymenttype/PaymenttypeDeleteModal'
import { PAYMENTTYPE_TYPE_BANKTRANSFER, PAYMENTTYPE_TYPE_CASH, PAYMENTTYPE_TYPE_CREDITCARD, PAYMENTTYPE_TYPE_INSTALLMENT, PAYMENTTYPE_TYPE_INVOICE } from '@Constant/index'

const Paymenttype: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<PaymenttypeItem | null>(null)

    const { data, isFetching } = useGetPaymenttypesQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'paymenttype' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as PaymenttypeItem
        return <EditCellHandler url={`/${RouteKeys.Paymenttypes}/${data.Uuid}/edit`} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as PaymenttypeItem
        return (
            <DeleteCellHandler
                onClick={() => {
                    setRecord(data)
                    setDeleteOpen(true)
                }}
            />
        )
    }

    const typeCellhandler = (value: number) => {
        const options = [
            { key: 0, text: t('Option.Paymenttype.Invoice'), value: PAYMENTTYPE_TYPE_INVOICE, },
            { key: 1, text: t('Option.Paymenttype.Installment'), value: PAYMENTTYPE_TYPE_INSTALLMENT, },
            { key: 2, text: t('Option.Paymenttype.CreditCard'), value: PAYMENTTYPE_TYPE_CREDITCARD, },
            { key: 3, text: t('Option.Paymenttype.BankTransfer'), value: PAYMENTTYPE_TYPE_BANKTRANSFER, },
            { key: 4, text: t('Option.Paymenttype.Cash'), value: PAYMENTTYPE_TYPE_CASH, },
        ]

        return options.find(u => u.value === value)?.text || t('Common.NoDataFound')
    }

    const columns: ColumnType<PaymenttypeItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Paymenttypes.Columns.Name'), accessorKey: 'Name', isMobile: true },
        { header: t('Pages.Paymenttypes.Columns.Description'), accessorKey: 'Description' },
        { header: t('Pages.Paymenttypes.Columns.Type'), accessorKey: 'Type', accessorFn: row => typeCellhandler(row.Type) },
        { header: t('Pages.Paymenttypes.Columns.Installmentcount'), accessorKey: 'Installmentcount' },
        { header: t('Pages.Paymenttypes.Columns.Installmentinterval'), accessorKey: 'Installmentinterval' },
        { header: t('Pages.Paymenttypes.Columns.Duedays'), accessorKey: 'Duedays' },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.paymenttypeupdate, cell: (wrapper) => editCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.paymenttypedelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 },
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    return (
        <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
            <ExcelProvider>
                <Title
                    PageName={t('Pages.Paymenttypes.Page.Header')}
                    PageUrl={Paths.Paymenttypes}
                    excelExportName={t('Pages.Paymenttypes.Page.Header')}
                    create={{
                        Pagecreateheader: t('Pages.Paymenttypes.Page.CreateHeader'),
                        Pagecreatelink: Paths.PaymenttypesCreate
                    }}
                />
                <DataTable
                    columns={columns}
                    data={data}
                    config={initialConfig}
                />
            </ExcelProvider>
            <PaymenttypeDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                data={record}
                setData={setRecord}
            />
        </Pagewrapper>
    )
}

export default Paymenttype
