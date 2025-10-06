import { useUsageCountByUserMontlyQuery } from '@Api/Log'
import Pagewrapper from '@Components/Common/Pagewrapper'
import validator from '@Utils/Validator'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import NotfoundScreen from '@Components/Common/NotfoundScreen'


interface AppreportUserUsagesProps {
    startDate?: string
    endDate?: string
}

const AppreportUserUsages: React.FC<AppreportUserUsagesProps> = (props) => {

    const { endDate, startDate } = props
    const { t } = useTranslation()

    const { data: rawUsagecountbyUserMontly, isFetching } = useUsageCountByUserMontlyQuery({ Startdate: startDate ?? '', Enddate: endDate ?? '' }, { skip: !validator.isISODate(startDate) || !validator.isISODate(endDate) })

    const usagecountbyUserMontly = rawUsagecountbyUserMontly || []

    const UserUsageoptions = {
        chart: {
            type: 'column',
        },
        title: {
            text: t('Pages.Appreports.Userusagecount.Label.Title'),
        },
        xAxis: {
            categories: [...new Set(usagecountbyUserMontly.map(u => u.UserID))],
            title: {
                text: t('Pages.Appreports.Userusagecount.Label.Services'),
            },
        },
        yAxis: {
            min: 0,
            title: {
                text: t('Pages.Appreports.Userusagecount.Label.UsageCounts'),
                align: 'high',
            },
            labels: {
                overflow: 'justify',
            },
        },
        tooltip: {
            valueSuffix: t('Pages.Appreports.Userusagecount.Label.Unit'),
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
                name: t('Pages.Appreports.Userusagecount.Label.Services'),
                data: [...new Set(usagecountbyUserMontly.map(u => u.UserID))].map((userKey) => {
                    return usagecountbyUserMontly.filter(u => u.UserID === userKey).reduce((total, value) => { return total + value.UsageCount }, 0)
                }),
            },
        ],
    };

    const isHaveData = usagecountbyUserMontly.length > 0

    return <Pagewrapper dynamicHeight isLoading={isFetching} alignTop >
        <div className='w-full'>
            {isHaveData ? <HighchartsReact highcharts={Highcharts} options={UserUsageoptions} /> : <NotfoundScreen />}
        </div>
    </Pagewrapper>
}
export default AppreportUserUsages