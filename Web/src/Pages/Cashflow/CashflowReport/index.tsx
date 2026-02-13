import { useGetCashflowGraphQuery } from '@Api/Cashflow'
import { CashflowGraphRequest } from '@Api/Cashflow/type'
import CashflowDashboard from '@Components/Cashflow/CashflowDashboard'
import CashflowReportListFilter from '@Components/Cashflow/CashflowReportListFilter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import { ExcelProvider } from '@Context/ExcelContext'
import { SuppressDate } from '@Utils/FormatDate'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'


const CashflowReport: React.FC = () => {

    const { t } = useTranslation()

    const getDefaultValues = (): CashflowGraphRequest => {
        const startDate = new Date()
        startDate.setDate(1)
        startDate.setMonth(startDate.getMonth() - 3)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date()

        return {
            startDate: SuppressDate(startDate),
            endDate: SuppressDate(endDate)
        }
    }

    const [reqBody, setReqBody] = useState<CashflowGraphRequest>(getDefaultValues())

    const methods = useForm<CashflowGraphRequest>({
        mode: 'onChange',
        defaultValues: getDefaultValues()
    })

    const { data, isFetching } = useGetCashflowGraphQuery(reqBody)

    return <FormProvider<CashflowGraphRequest> {...methods}>
        <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
            <ExcelProvider>
                <Title
                    PageName={t('Pages.CashflowReport.Page.Header')}
                    PageUrl={Paths.CashflowsReport}
                />
                <CashflowReportListFilter
                    reqBody={reqBody}
                    setReqBody={setReqBody}
                />
                {data && <CashflowDashboard data={data} reqBody={reqBody} />}
            </ExcelProvider>
        </Pagewrapper>
    </FormProvider>
}
export default CashflowReport