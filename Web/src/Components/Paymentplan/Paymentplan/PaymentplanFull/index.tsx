import React, { useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import { FormatDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { PaymentplanListItem } from '@Api/Paymentplan/type'
import { useGetPaymentplansQuery } from '@Api/Paymentplan'
import { VISIT_PAYMENT_STATUS_FULL, } from '@Constant/index'
import { useGetPaymenttypesQuery } from '@Api/Paymenttype'
import { loaderCellhandler } from '@Utils/CellHandler'
import { useGetVisitsQuery } from '@Api/Visit'

const PaymentplanFull: React.FC = () => {

    const { t } = useTranslation()

    const { data, isFetching } = useGetPaymentplansQuery({ isActive: 1, Status: VISIT_PAYMENT_STATUS_FULL })

    const { data: visits, isFetching: isVisitsFetching } = useGetVisitsQuery({ isActive: 1 })
    const { data: paymenttypes, isFetching: isPaymenttypesFetching } = useGetPaymenttypesQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'paymentplanfull' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatDate(value)
    }

    const visitCellhandler = (value: string) => {
        const visit = (visits || []).find(u => u.Uuid === value)
        return visit ? visit.Visitcode : t('Common.NoDataFound')
    }

    const paymenttypeCellhandler = (value: string) => {
        const paymenttype = (paymenttypes || []).find(u => u.Uuid === value)
        return paymenttype ? paymenttype.Name : t('Common.NoDataFound')
    }

    const formatCurrencyCellHandler = (value: number) => {
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
        }).format(value || 0)
    }

    const columns: ColumnType<PaymentplanListItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Paymentplans.Columns.VisitID'), accessorKey: 'VisitID', accessorFn: row => visitCellhandler(row.VisitID), cell: wrapper => loaderCellhandler(wrapper, isVisitsFetching), isMobile: true },
        { header: t('Pages.Paymentplans.Columns.PaymenttypeID'), accessorKey: 'PaymenttypeID', accessorFn: row => paymenttypeCellhandler(row.PaymenttypeID), cell: wrapper => loaderCellhandler(wrapper, isPaymenttypesFetching) },
        { header: t('Pages.Paymentplans.Columns.Totalamount'), accessorKey: 'Totalamount', accessorFn: row => formatCurrencyCellHandler(row.Totalamount) },
        { header: t('Pages.Paymentplans.Columns.Prepaymentamount'), accessorKey: 'Prepaymentamount', accessorFn: row => formatCurrencyCellHandler(row.Prepaymentamount) },
        { header: t('Pages.Paymentplans.Columns.Remainingvalue'), accessorKey: 'Remainingvalue', accessorFn: row => formatCurrencyCellHandler(row.Remainingvalue) },
        { header: t('Pages.Paymentplans.Columns.Installmentcount'), accessorKey: 'Installmentcount', },
        { header: t('Pages.Paymentplans.Columns.Installmentinterval'), accessorKey: 'Installmentinterval', },
        { header: t('Pages.Paymentplans.Columns.Duedays'), accessorKey: 'Duedays', },
        { header: t("Pages.Paymentplans.Columns.Startdate"), accessorKey: 'StartDate', accessorFn: row => dateCellhandler(row.Startdate) },
        { header: t("Pages.Paymentplans.Columns.Enddate"), accessorKey: 'EndDate', accessorFn: row => dateCellhandler(row.Enddate) },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
    ]

    const tableKey = `${isVisitsFetching}-${isPaymenttypesFetching}`

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

export default PaymentplanFull
