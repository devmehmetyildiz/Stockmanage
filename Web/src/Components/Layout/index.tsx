import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import LayoutNavigation from './LayoutNavigation'
import { useGetMetaQuery, useGetPrivilegesQuery } from '@Api/Profile'
import LoadingScreen from '@Components/Common/LoadingScreen'
import LayoutSidebar from './LayoutSidebar'
import useLayout from '@Hooks/useLayout'
import styles from './style.module.scss'
import { DimmerDimmable, Segment, SidebarPushable, SidebarPusher } from 'semantic-ui-react'
import LayoutNotification from './LayoutNotification'
import PreviousUrlProvider from '@Context/PreviousContext'
import useMobile from '@Hooks/useMobile'
import LayoutNewVersiyonModal from './LayoutNewVersiyonModal'

const Layout = () => {

    const [visible, setVisible] = useState(false)
    const { isTablet } = useMobile()
    const { changeSidebar, changeNotificationSidebar, isNewVersionShowed, setIsNewVersionShowed } = useLayout()

    const MetaQuery = useGetMetaQuery()
    const PrivilegeQuery = useGetPrivilegesQuery()

    const { data } = MetaQuery

    const isLoading =
        MetaQuery.isLoading ||
        MetaQuery.isFetching ||
        PrivilegeQuery.isLoading ||
        PrivilegeQuery.isFetching

    useEffect(() => {
        const current = localStorage.getItem('i18nextLng')
        if (data && data.Language !== current) {
            localStorage.setItem('i18nextLng', (data?.Language ?? 'tr').toLocaleLowerCase('tr'))
        }
    }, [data])

    useEffect(() => {
        changeSidebar(visible)
    }, [changeSidebar, visible])

    return isLoading || !MetaQuery.isSuccess || !PrivilegeQuery.isSuccess
        ? <LoadingScreen />
        : <div className={`w-screen h-screen ${styles.layoutBg} relative`}>
            <LayoutNewVersiyonModal
                open={isNewVersionShowed}
                setOpen={setIsNewVersionShowed}
            />
            <LayoutNavigation setVisible={setVisible} />
            <SidebarPushable className='!-m-0  !bg-transparent h-contentScreen overflow-hidden' as={Segment}>
                <LayoutNotification />
                <SidebarPusher>
                    <div className='w-screen flex flex-row justify-start items-start h-contentScreen z-0' onClick={() => changeNotificationSidebar(false)}>
                        <LayoutSidebar visible={visible} setVisible={setVisible} />
                        {isTablet
                            ? <DimmerDimmable dimmed={visible} blurring className='w-full'>
                                <div className={`${visible ? styles.sidebarOpenWidth : styles.sidebarCloseWidth} overflow-auto`}>
                                    <PreviousUrlProvider>
                                        <Outlet />
                                    </PreviousUrlProvider>
                                </div>
                            </DimmerDimmable>
                            : <div className={`${visible ? styles.sidebarOpenWidth : styles.sidebarCloseWidth} overflow-auto`}>
                                <PreviousUrlProvider>
                                    <Outlet />
                                </PreviousUrlProvider>
                            </div>
                        }
                    </div>
                </SidebarPusher>
            </SidebarPushable>
        </div>
}
export default Layout