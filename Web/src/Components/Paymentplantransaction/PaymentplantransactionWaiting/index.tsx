import React, { useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import { FormatDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { PaymentplanTransactionItem } from '@Api/Paymentplan/type'
import { useGetPaymentplansQuery, useGetPaymentplantransactionsQuery } from '@Api/Paymentplan'
import { loaderCellhandler } from '@Utils/CellHandler'
import { useGetVisitsQuery } from '@Api/Visit'
import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import privileges from '@Constant/privileges'
import { CellContext } from '@tanstack/react-table'
import { CompleteCellhandler, DetailCellHandler } from '@Components/Common/CellHandler'
import PaymentplantransactionApproveModal from '../PaymentplantransactionApproveModal'
import RouteKeys from '@Constant/routeKeys'

const PaymentplantransactionWaiting: React.FC = () => {

    const { t } = useTranslation()

    const [approveOpen, setApproveOpen] = useState(false)
    const [record, setRecord] = useState<PaymentplanTransactionItem | null>(null)

    const { data, isFetching } = useGetPaymentplantransactionsQuery({ isActive: 1, Status: 0 })

    const { data: paymentplans, isFetching: isPaymentplansFetching } = useGetPaymentplansQuery({ isActive: 1 })
    const { data: doctors, isFetching: isDoctorsFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: visits, isFetching: isVisitsFetching } = useGetVisitsQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'paymentplantransactionwaiting' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatDate(value)
    }

    const paymentplanCellhandler = (value: string) => {
        const paymentplan = (paymentplans || []).find(u => u.Uuid === value)
        const visit = (visits || []).find(u => u.Uuid === paymentplan?.VisitID)
        return visit ? `${visit.Visitcode} ${t('Pages.Paymentplantransactions.Label.VisitPrefix')}` : t('Common.NoDataFound')
    }

    const doctorCellhandler = (value: string) => {
        const paymentplan = (paymentplans || []).find(u => u.Uuid === value)
        const visit = (visits || []).find(u => u.Uuid === paymentplan?.VisitID)
        const doctor = (doctors || []).find(u => u.Uuid === visit?.DoctorID)
        return doctor ? `${doctor.Name} ${doctor.Surname}` : t('Common.NoDataFound')
    }

    const formatCurrencyCellHandler = (value: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(value || 0)
    }

    const approveCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as PaymentplanTransactionItem

        return <CompleteCellhandler onClick={() => {
            setRecord(data)
            setApproveOpen(true)
        }} />
    }

    const detailCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as PaymentplanTransactionItem

        return <DetailCellHandler url={`/${RouteKeys.Paymentplans}/${data.PaymentplanID}/Detail`} />
    }


    const columns: ColumnType<PaymentplanTransactionItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Paymentplantransactions.Columns.PaymentplanID'), accessorKey: 'PaymentplanID', accessorFn: row => paymentplanCellhandler(row.PaymentplanID), cell: wrapper => loaderCellhandler(wrapper, isVisitsFetching || isPaymentplansFetching), isMobile: true },
        { header: t('Pages.Paymentplantransactions.Columns.Doctor'), accessorKey: 'DoctorID', accessorFn: row => doctorCellhandler(row.PaymentplanID), cell: wrapper => loaderCellhandler(wrapper, isVisitsFetching || isPaymentplansFetching || isDoctorsFetching), isMobile: true },
        { header: t('Pages.Paymentplantransactions.Columns.Paymentdate'), accessorKey: 'Paymentdate', accessorFn: row => dateCellhandler(row.Paymentdate), isMobile: true },
        { header: t('Pages.Paymentplantransactions.Columns.Amount'), accessorKey: 'Amount', accessorFn: row => formatCurrencyCellHandler(row.Amount) },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.approve"), accessorKey: 'approve', isIcon: true, pinned: true, role: privileges.paymentplanupdate, cell: (wrapper) => approveCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.detail"), accessorKey: 'detail', isIcon: true, pinned: true, role: privileges.paymentplanview, cell: (wrapper) => detailCellhandler(wrapper), size: 45 },
    ]

    const tableKey = `${isVisitsFetching}-${isPaymentplansFetching}-${isDoctorsFetching}`

    return (<Pagewrapper padding={0} isLoading={isFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <DataTable
                key={tableKey}
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
        <PaymentplantransactionApproveModal
            open={approveOpen}
            setOpen={setApproveOpen}
            data={record}
            setData={setRecord}
        />
    </Pagewrapper>
    )
}

export default PaymentplantransactionWaiting
