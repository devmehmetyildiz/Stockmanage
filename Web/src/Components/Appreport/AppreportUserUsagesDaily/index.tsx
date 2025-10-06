import { useLogByUserQuery } from '@Api/Log'
import { useGetUsersListQuery } from '@Api/User'
import NotfoundScreen from '@Components/Common/NotfoundScreen'
import Pagewrapper from '@Components/Common/Pagewrapper'
import validator from '@Utils/Validator'
import HighchartsReact from 'highcharts-react-official'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Highcharts from 'highcharts/'


interface AppreportUserUsagesDailyProps {
    startDate?: string
    endDate?: string

}

const AppreportUserUsagesDaily: React.FC<AppreportUserUsagesDailyProps> = (props) => {

    const { endDate, startDate } = props

    const { t } = useTranslation()


    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 })
    const { data: rawlogByUser, isFetching } = useLogByUserQuery({ Startdate: startDate ?? '', Enddate: endDate ?? '' }, { skip: !validator.isISODate(startDate) || !validator.isISODate(endDate) })

    const logByUser = rawlogByUser || []

    const generateDateArray = (_Startdate: Date | string, _Enddate: Date | string) => {
        const start = new Date(_Startdate)
        start.setHours(0, 0, 0, 0);
        const end = new Date(_Enddate)
        end.setHours(0, 0, 0, 0);
        const now = new Date()
        now.setHours(23, 59, 59, 999)

        const days = [];

        while (start.getTime() <= end.getTime() && start.getTime() <= now.getTime()) {
            const day = new Date(start)
            days.push(day);
            start.setDate(start.getDate() + 1);
        }

        return days;
    }

    let maxData = 0
    let minData = 0

    const LogByUserData = (users || []).map((user) => {
        const dayStart = new Date(startDate ?? '')
        const dayEnd = new Date(endDate ?? '')



        const dayArray = generateDateArray(dayStart, dayEnd)
        return {
            name: `${user?.Username}`,
            data: dayArray.map(dayKey => {
                const dayData = logByUser.find(u => u.key === new Date(dayKey).toLocaleDateString('tr'))
                const value = (dayData?.value || []).find(u => u.UserID === user?.Username)?.Count ?? 0
                if (value > maxData) {
                    maxData = value
                }
                if (value < minData) {
                    minData = value
                }
                return value || 0
            })
        }
    }).filter(u => (u.data || []).some(u => u > 0))


    const LogByUserOption = {
        chart: {
            type: 'line',
        },
        title: {
            text: t('Pages.Appreports.LogByUser.Label.Title'),
        },
        xAxis: {
            categories: generateDateArray(startDate ?? '', endDate ?? '').map(u => `${new Date(u).getDate()}.${String(new Date(u).getMonth() + 1).padStart(2, '0')}`),
            title: {
                text: t('Pages.Appreports.LogByUser.Label.Days'),
            },
        },
        yAxis: {
            min: minData,
            max: maxData,
            title: {
                text: t('Pages.Appreports.LogByUser.Label.Count'),
            },
        },
        series: LogByUserData,
    }



    const isHaveData = logByUser.length > 0

    return <Pagewrapper dynamicHeight isLoading={isFetching || isUsersFetching} alignTop >
        <div className='w-full'>
            {isHaveData ? <HighchartsReact highcharts={Highcharts} options={LogByUserOption} /> : <NotfoundScreen />}
        </div>
    </Pagewrapper>
}
export default AppreportUserUsagesDaily