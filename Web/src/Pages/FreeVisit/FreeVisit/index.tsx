import { useGetVisitsCountQuery } from '@Api/Visit'
import AppTab from '@Components/Common/AppTab'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import FreeVisitCompleted from '@Components/FreeVisit/FreeVisit/FreeVisitCompleted'
import FreeVisitPlanned from '@Components/FreeVisit/FreeVisit/FreeVisitPlanned'
import FreeVisitWorking from '@Components/FreeVisit/FreeVisit/FreeVisitWorking'
import { VISIT_STATU_COMPLETED, VISIT_STATU_PLANNED, VISIT_STATU_WORKING, VISIT_TYPE_FREEVISIT } from '@Constant/index'
import Paths from '@Constant/path'
import privileges from '@Constant/privileges'
import RouteKeys from '@Constant/routeKeys'
import { ExcelProvider } from '@Context/ExcelContext'
import useHasPrivileges from '@Hooks/useHasPrivileges'
import useTabNavigation from '@Hooks/useTabNavigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const FreeVisit: React.FC = () => {

    const { t } = useTranslation()

    const { isHasPrivilege, isMetaLoading, isSuccess, UserID } = useHasPrivileges(privileges.visitmanageall)

    const { data: plannedCount, isFetching: isPlannedFetching } = useGetVisitsCountQuery({ Visittype: VISIT_TYPE_FREEVISIT, Status: VISIT_STATU_PLANNED, WorkerUserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })
    const { data: workingCount, isFetching: isWorkingFetching } = useGetVisitsCountQuery({ Visittype: VISIT_TYPE_FREEVISIT, Status: VISIT_STATU_WORKING, WorkerUserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })
    const { data: completedCount, isFetching: isCompletedFetching } = useGetVisitsCountQuery({ Visittype: VISIT_TYPE_FREEVISIT, Status: VISIT_STATU_COMPLETED, WorkerUserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })

    const { activeTab, setActiveTab } = useTabNavigation({
        mainRoute: RouteKeys.FreeVisits,
        tabOrder: ['planned', 'working', 'completed'],
    })

    return <Pagewrapper isLoading={isPlannedFetching || isWorkingFetching || isCompletedFetching || isMetaLoading} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.FreeVisits.Page.Header')}
                PageUrl={Paths.FreeVisits}
                excelExportName={t('Pages.FreeVisits.Page.Header')}
                create={{
                    Pagecreateheader: t('Pages.FreeVisits.Page.CreateHeader'),
                    Pagecreatelink: Paths.FreeVisitsCreate,
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
                        menuItem: `${t('Pages.FreeVisits.Tab.Planned')} (${plannedCount ?? 0})`,
                        render: () => <FreeVisitPlanned />,
                    },
                    {
                        menuItem: `${t('Pages.FreeVisits.Tab.Working')} (${workingCount ?? 0})`,
                        render: () => <FreeVisitWorking />,
                    },
                    {
                        menuItem: `${t('Pages.FreeVisits.Tab.Completed')} (${completedCount ?? 0})`,
                        render: () => <FreeVisitCompleted />,
                    },
                ]}
            />
        </ExcelProvider>
    </Pagewrapper>
}
export default FreeVisit