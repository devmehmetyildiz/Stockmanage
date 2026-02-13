import React, { useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import privileges from '@Constant/privileges'
import { FormatDate, SuppressDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { CashflowItem, CashflowListRequest } from '@Api/Cashflow/type'
import { useGetCashflowsQuery } from '@Api/Cashflow'
import {
    FLOW_TYPE_MANUEL, FLOW_TYPE_VISIT, PAYMENT_TRANSACTION_TYPE_INCOME, PAYMENT_TRANSACTION_TYPE_OUTCOME, PAYMENT_TRANSACTION_TYPE_PASSIVE, PAYMENTTYPE_TYPE_BANKTRANSFER,
    PAYMENTTYPE_TYPE_CASH, PAYMENTTYPE_TYPE_CREDITCARD, PAYMENTTYPE_TYPE_INVOICE
} from '@Constant/index'
import { TransposeCurreny } from '@Utils/Transposer'
import CashflowListFilter from '@Components/Cashflow/CashflowListFilter'
import { FormProvider, useForm } from 'react-hook-form'
import { CellContext } from '@tanstack/react-table'

const Cashflow: React.FC = () => {

    const { t } = useTranslation()

    const getDefaultValues = (): CashflowListRequest => {
        const startDate = new Date()
        startDate.setDate(1)
        startDate.setMonth(startDate.getMonth() - 3)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date()

        return {
            isActive: true,
            startDate: SuppressDate(startDate),
            endDate: SuppressDate(endDate)
        }
    }

    const [reqBody, setReqBody] = useState<CashflowListRequest>(getDefaultValues())

    const methods = useForm<CashflowListRequest>({
        mode: 'onChange',
        defaultValues: getDefaultValues()
    })

    const { data, isFetching } = useGetCashflowsQuery(reqBody)

    const TableQuery = useGetTableMetaQuery({ Key: 'cashflow' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatDate(value)
    }

    const typeCellhandler = (value: number) => {
        const transactionTypeOption = [
            { text: t('Option.Movementoption.Income'), value: PAYMENT_TRANSACTION_TYPE_INCOME },
            { text: t('Option.Movementoption.Outcome'), value: PAYMENT_TRANSACTION_TYPE_OUTCOME },
            { text: t('Option.Movementoption.Passive'), value: PAYMENT_TRANSACTION_TYPE_PASSIVE },
        ]
        return transactionTypeOption.find(u => u.value === value)?.text ?? value
    }

    const statusCellhandler = (value: any) => {
        const status = [
            { name: t('Option.Cashflowtype.Visit'), value: FLOW_TYPE_VISIT },
            { name: t('Option.Cashflowtype.Manuel'), value: FLOW_TYPE_MANUEL }
        ]
        return (status || []).find(u => u.value === value)?.name ?? value
    }

    const paymenttypeCellhandler = (value: number) => {
        const status = [
            { text: t('Option.Paymenttype.Cash'), value: PAYMENTTYPE_TYPE_CASH },
            { text: t('Option.Paymenttype.CreditCard'), value: PAYMENTTYPE_TYPE_CREDITCARD },
            { text: t('Option.Paymenttype.BankTransfer'), value: PAYMENTTYPE_TYPE_BANKTRANSFER },
            { text: t('Option.Paymenttype.Invoice'), value: PAYMENTTYPE_TYPE_INVOICE },
        ]
        return (status || []).find(u => u.value === value)?.text ?? value
    }


    const currencyCellhandler = (wrapper: CellContext<any, unknown>,) => {
        const data = wrapper.row.original as CashflowItem
        const netValueExp = data.Type ?? 0
        const netValue = data.Amount * netValueExp
        if (netValue === 0) {
            return wrapper.renderValue()
        } else if (netValue > 0) {
            return <p className='text-emerald-600'>{wrapper.renderValue() as any}</p>
        } else {
            return <p className='text-red-600'>{wrapper.renderValue() as any}</p>
        }
    }

    const rawCurrencyCellhandler = (value: number) => {
        return TransposeCurreny(value)
    }

    const columns: ColumnType<CashflowItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Cashflows.Columns.Type'), accessorKey: 'Type', accessorFn: row => typeCellhandler(row.Type), isMobile: true },
        { header: t('Pages.Cashflows.Columns.Parenttype'), accessorKey: 'Parenttype', accessorFn: row => statusCellhandler(row.Parenttype), },
        { header: t('Pages.Cashflows.Columns.Paymenttype'), accessorKey: 'Paymenttype', accessorFn: row => paymenttypeCellhandler(row.Paymenttype), },
        { header: t('Pages.Cashflows.Columns.Processdate'), accessorKey: 'Processdate', accessorFn: row => dateCellhandler(row.Processdate), sortingFn: 'datetime' },
        { header: t('Pages.Cashflows.Columns.Amount'), accessorKey: 'Amount', accessorFn: row => rawCurrencyCellhandler(row.Amount), cell: wrapper => currencyCellhandler(wrapper) },
        { header: t('Pages.Cashflows.Columns.Info'), accessorKey: 'Info', },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime), sortingFn: 'datetime' },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime), sortingFn: 'datetime' },
    ]

    return (
        <FormProvider<CashflowListRequest> {...methods}>
            <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
                <ExcelProvider>
                    <Title
                        PageName={t('Pages.Cashflows.Page.Header')}
                        PageUrl={Paths.Cashflows}
                        excelExportName={t('Pages.Cashflows.Page.Header')}
                        create={{
                            Pagecreateheader: t('Pages.Cashflows.Page.CreateHeader'),
                            Pagecreatelink: Paths.CashflowsCreate,
                            role: privileges.cashflowadd
                        }}
                    />
                    <CashflowListFilter
                        reqBody={reqBody}
                        setReqBody={setReqBody}
                    />
                    <DataTable
                        columns={columns}
                        data={data}
                        config={initialConfig}
                    />
                </ExcelProvider>
            </Pagewrapper>
        </FormProvider>
    )
}

export default Cashflow
