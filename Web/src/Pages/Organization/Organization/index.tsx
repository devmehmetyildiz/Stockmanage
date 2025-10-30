import { ReportRequest } from '@Api/Report/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import OrganizationDailySalesChart from '@Components/Organization/Organization/OrganizationDailySalesChart'
import OrganizationFilter from '@Components/Organization/Organization/OrganizationFilter'
import OrganizationKpi from '@Components/Organization/Organization/OrganizationKpi'
import OrganizationMonthlyBalanceChart from '@Components/Organization/Organization/OrganizationMonthlyBalanceChart'
import OrganizationTopDoctorsCharts from '@Components/Organization/Organization/OrganizationTopDoctorsCharts'
import OrganizationTopLocationsCharts from '@Components/Organization/Organization/OrganizationTopLocationsCharts'
import Paths from '@Constant/path'
import { SuppressDate } from '@Utils/FormatDate'
import validator from '@Utils/Validator'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const Organization: React.FC = () => {
    const { t } = useTranslation()

    const getDefaultValues = (): ReportRequest => {
        const startDate = new Date()
        startDate.setMonth(startDate.getMonth() - 1)
        const endDate = new Date()
        return {
            Startdate: SuppressDate(startDate, true),
            Enddate: SuppressDate(endDate, true)
        }
    }

    const [reqBody, setReqBody] = useState<ReportRequest | null>(getDefaultValues())

    const methods = useForm<ReportRequest>({
        mode: 'onChange',
        defaultValues: getDefaultValues()
    })

    const isDateSetted = validator.isISODate(reqBody?.Startdate) || validator.isISODate(reqBody?.Enddate)

    return <Pagewrapper isLoading={false} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Organisation.Page.Header')}
            PageUrl={Paths.Organisation}
            excelExportName={t('Pages.Organisation.Page.Header')}
        />
        <FormProvider<ReportRequest> {...methods}>
            <OrganizationFilter
                reqBody={reqBody}
                setReqBody={setReqBody}
            />
            {isDateSetted && reqBody ?
                <div className='w-full'>
                    <OrganizationKpi filters={reqBody} />
                    <Pagewrapper dynamicHeight gap={4} direction='vertical' alignTop padding={0}>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
                            <OrganizationDailySalesChart filters={reqBody} />
                            <OrganizationMonthlyBalanceChart filters={reqBody} />
                        </div>
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6 w-full">
                            <OrganizationTopDoctorsCharts filters={reqBody} />
                            <OrganizationTopLocationsCharts filters={reqBody} />
                        </div>
                    </Pagewrapper>
                </div> : null
            }
        </FormProvider>
    </Pagewrapper>
}
export default Organization