import { useGetUserSaleReportQuery } from '@Api/Report'
import { ReportRequest } from '@Api/Report/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import { SuppressDate } from '@Utils/FormatDate'
import validator from '@Utils/Validator'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Divider, Form } from 'semantic-ui-react'
import ReactApexChart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'

const ReportAppForm = createAppForm<ReportRequest>()

const ReportUserSalesReports: React.FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()

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

    const { getValues, formState, trigger, watch } = methods
    const [CurrentStartDate, CurrentEndDate] = watch(['Startdate', 'Enddate'])

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const values = getValues()
                setReqBody(values)
            } else {
                CheckForm(formState, t('Pages.UserSalesReport.Page.Header'))
            }
        })
    }

    const isDateSame = reqBody?.Startdate === CurrentStartDate && reqBody?.Enddate === CurrentEndDate
    const isDateSetted = validator.isISODate(reqBody?.Startdate) || validator.isISODate(reqBody?.Enddate)

    const { data, isFetching } = useGetUserSaleReportQuery(
        { Startdate: reqBody?.Startdate ?? '', Enddate: reqBody?.Enddate ?? '' },
        { skip: !validator.isISODate(reqBody?.Startdate) || !validator.isISODate(reqBody?.Enddate) }
    )

    const report = data || []

    const chartOptions: ApexOptions = {
        chart: { type: 'bar', height: 350 },
        plotOptions: { bar: { borderRadius: 5, horizontal: false } },
        xaxis: { categories: report.map(item => item.UserID) },
        dataLabels: { enabled: false },
        tooltip: {
            y: {
                formatter: (val: number) => {
                    return new Intl.NumberFormat('tr-TR', {
                        style: 'currency',
                        currency: 'TRY',
                    }).format(val || 0)
                }
            }
        },
        colors: ['#1E90FF', '#28a745', '#FF4C61'],
        legend: { position: 'top' }
    }

    const series = [
        { name: t('Pages.UserSalesReport.Columns.TotalSales'), data: report.map(i => i.TotalSales) },
        { name: t('Pages.UserSalesReport.Columns.Paid'), data: report.map(i => i.Paid) },
        { name: t('Pages.UserSalesReport.Columns.Unpaid'), data: report.map(i => i.Unpaid) }
    ]

    return (
        <Pagewrapper isLoading={isFetching} direction='vertical' alignTop gap={4}>
            <Title
                PageName={t('Pages.UserSalesReport.Page.Header')}
                PageUrl={Paths.UserSalesReports}
                excelExportName={t('Pages.UserSalesReport.Page.Header')}
            />
            <FormProvider<ReportRequest> {...methods}>
                <Contentwrapper>
                    <Form>
                        <Form.Group widths={'equal'}>
                            <ReportAppForm.Input name='Startdate' label={t('Common.StartDate')} required={t('Common.Required')} type='datetime-local' />
                            <ReportAppForm.Input name='Enddate' label={t('Common.EndDate')} required={t('Common.Required')} type='datetime-local' />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <FormButton
                                disabled={isDateSame}
                                text={t('Pages.Appreports.Columns.FetchList')}
                                onClick={() => submit()}
                            />
                        </Form.Group>
                    </Form>
                </Contentwrapper>
                {isDateSetted ?
                    <Contentwrapper>
                        <div className='w-full'>
                            <Divider />
                            <ReactApexChart options={chartOptions} series={series} type="bar" height={400} />
                        </div>
                    </Contentwrapper>
                    : null}
            </FormProvider>
        </Pagewrapper>
    )
}
export default ReportUserSalesReports