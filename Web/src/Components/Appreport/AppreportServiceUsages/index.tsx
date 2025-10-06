import React from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useTranslation } from 'react-i18next'
import { useServiceUsageCountQuery } from '@Api/Log'
import validator from '@Utils/Validator'
import Pagewrapper from '@Components/Common/Pagewrapper'
import NotfoundScreen from '@Components/Common/NotfoundScreen'

interface AppreportServiceUsagesProps {
    startDate?: string
    endDate?: string
}

const AppreportServiceUsages: React.FC<AppreportServiceUsagesProps> = (props) => {

    const { startDate, endDate } = props

    const { data: rawServiceUsageCount, isFetching } = useServiceUsageCountQuery({ Startdate: startDate ?? '', Enddate: endDate ?? '' }, { skip: !validator.isISODate(startDate) || !validator.isISODate(endDate) })


    const serviceUsageCount = rawServiceUsageCount || []

    const { t } = useTranslation()

    const ServiceUsageoptions = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Appreports.Serviceusagecount.Label.Title'),
        },
        xAxis: {
            categories: [...new Set(serviceUsageCount.map(u => u.Service))],
            title: {
                text: t('Pages.Appreports.Serviceusagecount.Label.Services'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Appreports.Serviceusagecount.Label.UsageCounts'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Appreports.Serviceusagecount.Label.Unit'),
        },
        plotOptions: {
            column: {
                dataLabels: {
                    enabled: true,
                },
            },
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: -10,
            floating: true,
            borderWidth: 1,
            shadow: true,
        },
        credits: {
            enabled: false,
        },
        series: [
            {
                name: t('Pages.Appreports.Serviceusagecount.Label.Services'),
                data: [...new Set(serviceUsageCount.map(u => u.Service))].map((serviceKey) => {
                    return serviceUsageCount.filter(u => u.Service === serviceKey).reduce((total, value) => { return total + value.Count }, 0)
                }),
            },
        ],
    };

    const isHaveData = serviceUsageCount.length > 0

    return <Pagewrapper dynamicHeight isLoading={isFetching} alignTop>
        <div className='w-full'>
            {isHaveData ? <HighchartsReact highcharts={Highcharts} options={ServiceUsageoptions} /> : <NotfoundScreen />}
        </div>
    </Pagewrapper>
}
export default AppreportServiceUsages