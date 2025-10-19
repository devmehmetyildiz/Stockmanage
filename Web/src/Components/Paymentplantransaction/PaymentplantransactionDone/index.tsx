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
import { PAYMENT_TRANSACTION_TYPE_CLOSE_TRANSACTION, PAYMENT_TRANSACTION_TYPE_FULLPAYMENT, PAYMENT_TRANSACTION_TYPE_PREPAYMENT, PAYMENT_TRANSACTION_TYPE_TRANSACTION, PAYMENTTYPE_TYPE_BANKTRANSFER, PAYMENTTYPE_TYPE_CASH, PAYMENTTYPE_TYPE_CREDITCARD, PAYMENTTYPE_TYPE_INVOICE } from '@Constant/index'

const PaymentplantransactionDone: React.FC = () => {

    const { t } = useTranslation()

    const { data, isFetching } = useGetPaymentplantransactionsQuery({ isActive: 1, Status: 1 })

    const { data: paymentplans, isFetching: isPaymentplansFetching } = useGetPaymentplansQuery({ isActive: 1 })
    const { data: doctors, isFetching: isDoctorsFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: visits, isFetching: isVisitsFetching } = useGetVisitsQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'paymentplantransactiondone' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatDate(value)
    }

    const paymentplanCellhandler = (value: string) => {
        const paymentplan = (paymentplans || []).find(u => u.Uuid === value)
        const visit = (visits || []).find(u => u.Uuid === paymentplan?.VisitID)
        return visit ? `${visit.Visitcode} ${t('Pages.Paymentplantransactions.Label.VisitPrefix')}` : t('Common.NoDataFound')
    }

    const paymentTypeCellhandler = (value: number) => {
        const paymentTypeOption = [
            { text: t('Option.Paymenttype.Cash'), value: PAYMENTTYPE_TYPE_CASH },
            { text: t('Option.Paymenttype.CreditCard'), value: PAYMENTTYPE_TYPE_CREDITCARD },
            { text: t('Option.Paymenttype.BankTransfer'), value: PAYMENTTYPE_TYPE_BANKTRANSFER },
            { text: t('Option.Paymenttype.Invoice'), value: PAYMENTTYPE_TYPE_INVOICE },
        ]

        return paymentTypeOption.find(u => u.value === value)?.text || t('Common.NoDataFound')
    }

    const paymentTransactionCellhandler = (value: number) => {
        const paymentTransactionTypeOption = [
            { text: t('Option.Paymenttransactiontype.Prepayment'), value: PAYMENT_TRANSACTION_TYPE_PREPAYMENT },
            { text: t('Option.Paymenttransactiontype.FullPayment'), value: PAYMENT_TRANSACTION_TYPE_FULLPAYMENT },
            { text: t('Option.Paymenttransactiontype.Transaction'), value: PAYMENT_TRANSACTION_TYPE_TRANSACTION },
            { text: t('Option.Paymenttransactiontype.CloseTransaction'), value: PAYMENT_TRANSACTION_TYPE_CLOSE_TRANSACTION },
        ]

        return paymentTransactionTypeOption.find(u => u.value === Number(value))?.text || t('Common.NoDataFound')
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

    const columns: ColumnType<PaymentplanTransactionItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Paymentplantransactions.Columns.PaymentplanID'), accessorKey: 'PaymentplanID', accessorFn: row => paymentplanCellhandler(row.PaymentplanID), cell: wrapper => loaderCellhandler(wrapper, isVisitsFetching || isPaymentplansFetching), isMobile: true },
        { header: t('Pages.Paymentplantransactions.Columns.Doctor'), accessorKey: 'DoctorID', accessorFn: row => doctorCellhandler(row.PaymentplanID), cell: wrapper => loaderCellhandler(wrapper, isVisitsFetching || isPaymentplansFetching || isDoctorsFetching), isMobile: true },
        { header: t('Pages.Paymentplantransactions.Columns.Paymentdate'), accessorKey: 'Paymentdate', accessorFn: row => dateCellhandler(row.Paymentdate), isMobile: true },
        { header: t('Pages.Paymentplantransactions.Columns.Type'), accessorKey: 'Type', accessorFn: row => paymentTransactionCellhandler(row.Type) },
        { header: t('Pages.Paymentplantransactions.Columns.Amount'), accessorKey: 'Amount', accessorFn: row => formatCurrencyCellHandler(row.Amount) },
        { header: t('Pages.Paymentplantransactions.Columns.Paymentmethod'), accessorKey: 'Paymentmethod', accessorFn: row => paymentTypeCellhandler(row.Paymentmethod) },
        { header: t('Pages.Paymentplantransactions.Columns.Referenceno'), accessorKey: 'Referenceno', },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
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
    </Pagewrapper>
    )
}

export default PaymentplantransactionDone
