import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import { useTranslation } from 'react-i18next'
import { UserItem, UserListItem } from '@Api/User/type'
import { ExcelProvider } from '@Context/ExcelContext'
import UserDeleteModal from '@Components/User/UserDeleteModal'
import useTabNavigation from '@Hooks/useTabNavigation'
import RouteKeys from '@Constant/routeKeys'
import { useNavigate } from 'react-router-dom'
import AppTab from '@Components/Common/AppTab'
import { useGetUsersCountQuery } from '@Api/User'
import UserAppUser from '@Components/User/User/UserAppUser'
import UserLeftWorker from '@Components/User/User/UserLeftWorker'
import UserWorking from '@Components/User/User/UserWorking'
import UserLeftModal from '@Components/User/UserLeftModal'

const User: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [removeOpen, setRemoveOpen] = useState(false)
    const [record, setRecord] = useState<UserItem | UserListItem | null>(null)

    const { data: workerCount, isFetching: isWorkerCountFetching } = useGetUsersCountQuery({ isActive: 1, Isworker: 1, Isworking: 1 })
    const { data: nonWorkingCount, isFetching: isNonworkingCountFetching } = useGetUsersCountQuery({ isActive: 1, Isworker: 1, Isworking: 0 })
    const { data: userCount, isFetching: isUserCountFetching } = useGetUsersCountQuery({ isActive: 1, Isworker: 0 })

    const { activeTab, setActiveTab } = useTabNavigation({
        mainRoute: RouteKeys.Users,
        navigate,
        tabOrder: ['working', 'nonworking', 'appuser'],
    })

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    return <Pagewrapper isLoading={isWorkerCountFetching || isNonworkingCountFetching || isUserCountFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Users.Page.Header')}
                PageUrl={Paths.Users}
                excelExportName={t('Pages.Users.Page.Header')}
                create={{
                    Pagecreateheader: t('Pages.Users.Page.CreateHeader'),
                    Pagecreatelink: Paths.UsersCreate
                }}
            />
            <AppTab
                onTabChange={(_, { activeIndex }) => {
                    setActiveTab(Number(activeIndex))
                }}
                activeIndex={activeTab}
                panes={[
                    {
                        menuItem: `${t('Pages.Users.Page.Tab.Worketlist')} (${workerCount ?? 0})`,
                        render: () => <UserWorking
                            setRemoveOpen={setRemoveOpen}
                            setDeleteOpen={setDeleteOpen}
                            setRecord={setRecord}
                        />,
                    },
                    {
                        menuItem: `${t('Pages.Users.Page.Tab.LeftWorketlist')} (${nonWorkingCount ?? 0})`,
                        render: () => <UserLeftWorker
                            setDeleteOpen={setDeleteOpen}
                            setRecord={setRecord}
                        />,
                    },
                    {
                        menuItem: `${t('Pages.Users.Page.Tab.Appuserlist')} (${userCount ?? 0})`,
                        render: () => <UserAppUser
                            setDeleteOpen={setDeleteOpen}
                            setRecord={setRecord}
                        />,
                    },
                ]}
                renderActiveOnly
            />
        </ExcelProvider>
        <UserDeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            data={record}
            setData={setRecord}
        />
        <UserLeftModal
            open={removeOpen}
            setOpen={setRemoveOpen}
            data={record}
            setData={setRecord}
        />
    </Pagewrapper>
}
export default User