import { useGetVisitsCountQuery } from '@Api/Visit'
import AppTab from '@Components/Common/AppTab'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import VisitClosed from '@Components/Visit/Visit/VisitClosed'
import VisitCompleted from '@Components/Visit/Visit/VisitCompleted'
import VisitOnapprove from '@Components/Visit/Visit/VisitOnapprove'
import VisitPlanned from '@Components/Visit/Visit/VisitPlanned'
import VisitWorking from '@Components/Visit/Visit/VisitWorking'
import { VISIT_STATU_CLOSED, VISIT_STATU_COMPLETED, VISIT_STATU_ON_APPROVE, VISIT_STATU_PLANNED, VISIT_STATU_WORKING, VISIT_TYPE_SALEVISIT } from '@Constant/index'
import Paths from '@Constant/path'
import privileges from '@Constant/privileges'
import RouteKeys from '@Constant/routeKeys'
import { ExcelProvider } from '@Context/ExcelContext'
import useHasPrivileges from '@Hooks/useHasPrivileges'
import useTabNavigation from '@Hooks/useTabNavigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Visit: React.FC = () => {

    const { t } = useTranslation()

    const { isHasPrivilege, isMetaLoading, isSuccess, UserID } = useHasPrivileges(privileges.visitmanageall)

    const { data: plannedCount, isFetching: isPlannedFetching } = useGetVisitsCountQuery({ Visittype: VISIT_TYPE_SALEVISIT, Status: VISIT_STATU_PLANNED, WorkerUserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })
    const { data: workingCount, isFetching: isWorkingFetching } = useGetVisitsCountQuery({ Visittype: VISIT_TYPE_SALEVISIT, Status: VISIT_STATU_WORKING, WorkerUserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })
    const { data: onapproveCount, isFetching: isOnapproveFetching } = useGetVisitsCountQuery({ Visittype: VISIT_TYPE_SALEVISIT, Status: VISIT_STATU_ON_APPROVE, WorkerUserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })
    const { data: completedCount, isFetching: isCompletedFetching } = useGetVisitsCountQuery({ Visittype: VISIT_TYPE_SALEVISIT, Status: VISIT_STATU_COMPLETED, WorkerUserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })
    const { data: closedCount, isFetching: isClosedCountFetching } = useGetVisitsCountQuery({ Visittype: VISIT_TYPE_SALEVISIT, Status: VISIT_STATU_CLOSED, WorkerUserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })

    const { activeTab, setActiveTab } = useTabNavigation({
        mainRoute: RouteKeys.Visits,
        tabOrder: ['planned', 'onapprove', 'working', 'completed', 'closed'],
    })

    return <Pagewrapper isLoading={isPlannedFetching || isWorkingFetching || isOnapproveFetching || isCompletedFetching || isClosedCountFetching || isMetaLoading} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Visits.Page.Header')}
                PageUrl={Paths.Visits}
                excelExportName={t('Pages.Visits.Page.Header')}
                create={{
                    Pagecreateheader: t('Pages.Visits.Page.CreateHeader'),
                    Pagecreatelink: Paths.VisitsCreate,
                    role: privileges.visitadd
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
                        menuItem: `${t('Pages.Visits.Tab.Onapprove')} (${onapproveCount ?? 0})`,
                        render: () => <VisitOnapprove />,
                    },
                    {
                        menuItem: `${t('Pages.Visits.Tab.Working')} (${workingCount ?? 0})`,
                        render: () => <VisitWorking />,
                    },
                    {
                        menuItem: `${t('Pages.Visits.Tab.Completed')} (${completedCount ?? 0})`,
                        render: () => <VisitCompleted />,
                    },
                    {
                        menuItem: `${t('Pages.Visits.Tab.Closed')} (${closedCount ?? 0})`,
                        render: () => <VisitClosed />,
                    },
                ]}
            />
        </ExcelProvider>
    </Pagewrapper>
}
export default Visit