import { useGetVisitsCountQuery } from '@Api/Visit'
import AppTab from '@Components/Common/AppTab'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import VisitCompleted from '@Components/Visit/Visit/VisitCompleted'
import VisitDeclined from '@Components/Visit/Visit/VisitDeclined'
import VisitOnapprove from '@Components/Visit/Visit/VisitOnapprove'
import VisitPlanned from '@Components/Visit/Visit/VisitPlanned'
import VisitWorking from '@Components/Visit/Visit/VisitWorking'
import { VISIT_STATU_COMPLETED, VISIT_STATU_DECLINED, VISIT_STATU_ON_APPROVE, VISIT_STATU_PLANNED, VISIT_STATU_WORKING } from '@Constant/index'
import Paths from '@Constant/path'
import RouteKeys from '@Constant/routeKeys'
import { ExcelProvider } from '@Context/ExcelContext'
import useTabNavigation from '@Hooks/useTabNavigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface VisitProps {
}

const Visit: React.FC<VisitProps> = () => {

    const { t } = useTranslation()

    const { data: plannedCount, isFetching: isPlannedFetching } = useGetVisitsCountQuery({ Status: VISIT_STATU_PLANNED, isActive: 1 })
    const { data: workingCount, isFetching: isWorkingFetching } = useGetVisitsCountQuery({ Status: VISIT_STATU_WORKING, isActive: 1 })
    const { data: onapproveCount, isFetching: isOnapproveFetching } = useGetVisitsCountQuery({ Status: VISIT_STATU_ON_APPROVE, isActive: 1 })
    const { data: completedCount, isFetching: isCompletedFetching } = useGetVisitsCountQuery({ Status: VISIT_STATU_COMPLETED, isActive: 1 })
    const { data: declinedCount, isFetching: isDeclinedFetching } = useGetVisitsCountQuery({ Status: VISIT_STATU_DECLINED, isActive: 1 })

    const { activeTab, setActiveTab } = useTabNavigation({
        mainRoute: RouteKeys.Visits,
        tabOrder: ['completed', 'approved', 'waitingapprove', 'created'],
    })

    return <Pagewrapper isLoading={isPlannedFetching || isWorkingFetching || isOnapproveFetching || isCompletedFetching || isDeclinedFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Visits.Page.Header')}
                PageUrl={Paths.Visits}
                excelExportName={t('Pages.Visits.Page.Header')}
                create={{
                    Pagecreateheader: t('Pages.Visits.Page.CreateHeader'),
                    Pagecreatelink: Paths.VisitsCreate
                }}
            />
            <AppTab
                onTabChange={(_, { activeIndex }) => {
                    setActiveTab(Number(activeIndex))
                }}
                activeIndex={activeTab}
                panes={[
                    {
                        menuItem: `${t('Pages.Visits.Tab.Planned')} (${plannedCount ?? 0})`,
                        render: () => <VisitPlanned />,
                    },
                    {
                        menuItem: `${t('Pages.Visits.Tab.Working')} (${workingCount ?? 0})`,
                        render: () => <VisitWorking />,
                    },
                    {
                        menuItem: `${t('Pages.Visits.Tab.Onapprove')} (${onapproveCount ?? 0})`,
                        render: () => <VisitOnapprove />,
                    },
                    {
                        menuItem: `${t('Pages.Visits.Tab.Completed')} (${completedCount ?? 0})`,
                        render: () => <VisitCompleted />,
                    },
                    {
                        menuItem: `${t('Pages.Visits.Tab.Declined')} (${declinedCount ?? 0})`,
                        render: () => <VisitDeclined />,
                    },
                ]}
            />
        </ExcelProvider>
    </Pagewrapper>
}
export default Visit