import { useGetPrivilegesQuery } from '@Api/Profile'
import privileges from '@Constant/privileges'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Icon, SemanticICONS } from 'semantic-ui-react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import styles from './style.module.scss'
import { useNavigate } from 'react-router-dom'
import LayoutSidebarFooter from './LayoutSidebarFooter'
import Paths from '@Constant/path'
import useMobile from '@Hooks/useMobile'

interface LayoutSidebarProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

interface SidebarItemDetail {
    id: number
    subtitle: string
    url: string
    permission: boolean
}

export interface SidebarItem {
    id: number
    title: string
    icon: SemanticICONS
    items: SidebarItemDetail[]
}

export const getSidebarRoutes = (t: any, userPrivileges: string[]) => {

    const checkAuth = (authname: string) => {

        let isAvailable = false
        if (userPrivileges.includes('admin') || userPrivileges.includes(authname)) {
            isAvailable = true
        }
        return isAvailable
    }

    const pages: SidebarItem[] = [
        {
            id: 1,
            title: t('Sidebar.Menu.Organisation'),
            icon: 'building',
            items: [
                { id: 1, subtitle: t('Pages.Organisation.Page.Header'), url: Paths.Organisation, permission: checkAuth(privileges.paymentplanview) },
                { id: 2, subtitle: t('Pages.Visits.Page.Header'), url: Paths.Visits, permission: checkAuth(privileges.visitview) },
                { id: 3, subtitle: t('Pages.Approvalrequests.Page.Header'), url: Paths.Approvalrequests, permission: checkAuth(privileges.approvalrequestcreen) },
            ]
        },
        {
            id: 2,
            title: t('Sidebar.Menu.Claimpayments'),
            icon: 'money bill alternate',
            items: [
                { id: 1, subtitle: t('Pages.Paymentplans.Page.Header'), url: Paths.Paymentplans, permission: checkAuth(privileges.paymentplanview) },
                { id: 2, subtitle: t('Pages.Paymentplantransactions.Page.Header'), url: Paths.Paymentplantransactions, permission: checkAuth(privileges.paymentplanview) },
            ]
        },
        {
            id: 3,
            title: t('Sidebar.Menu.System'),
            icon: 'server',
            items: [
                { id: 1, subtitle: t('Pages.Rules.Page.Header'), url: Paths.Rules, permission: checkAuth(privileges.ruleview) },
                { id: 2, subtitle: t('Pages.Mailsettings.Page.Header'), url: Paths.Mailsettings, permission: checkAuth(privileges.mailsettingview) },
                { id: 3, subtitle: t('Pages.Appreports.Page.Header'), url: Paths.Appreports, permission: checkAuth(privileges.admin) },
                { id: 4, subtitle: t('Pages.Log.Page.Header'), url: Paths.Logs, permission: checkAuth(privileges.admin) },
            ]
        },
        {
            id: 4,
            title: t('Sidebar.Menu.Warehouse'),
            icon: 'boxes',
            items: [
                { id: 1, subtitle: t('Pages.Warehouses.Page.Header'), url: Paths.Warehouses, permission: checkAuth(privileges.warehouseview) },
                { id: 2, subtitle: t('Pages.Stocks.Page.Header'), url: Paths.Stocks, permission: checkAuth(privileges.stockview) },

            ]
        },
        {
            id: 5,
            title: t('Sidebar.Menu.Setting'),
            icon: 'settings',
            items: [
                { id: 1, subtitle: t('Pages.Users.Page.Header'), url: Paths.Users, permission: checkAuth(privileges.userview) },
                { id: 2, subtitle: t('Pages.Roles.Page.Header'), url: Paths.Roles, permission: checkAuth(privileges.roleview) },
                { id: 3, subtitle: t('Pages.Cases.Page.Header'), url: Paths.Cases, permission: checkAuth(privileges.caseview) },
                { id: 4, subtitle: t('Pages.Doctordefines.Page.Header'), url: Paths.Doctordefines, permission: checkAuth(privileges.doctordefineview) },
                { id: 5, subtitle: t('Pages.Locations.Page.Header'), url: Paths.Locations, permission: checkAuth(privileges.locationview) },
                { id: 6, subtitle: t('Pages.Paymenttypes.Page.Header'), url: Paths.Paymenttypes, permission: checkAuth(privileges.paymenttypeview) },
                { id: 7, subtitle: t('Pages.Stockdefines.Page.Header'), url: Paths.Stockdefines, permission: checkAuth(privileges.stockdefineview) },
            ]
        },
    ]

    return pages
}

const LayoutSidebar: React.FC<LayoutSidebarProps> = ({ visible, setVisible }) => {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const { isTablet } = useMobile()
    const { data } = useGetPrivilegesQuery()

    const [openedID, setOpenedID] = useState<number | null>(null)

    const userPrivileges = data || [] as string[]

    const pages = useMemo(() => {
        return getSidebarRoutes(t, userPrivileges)
    }, [getSidebarRoutes, t, userPrivileges])

    useEffect(() => {
        setOpenedID(null)
    }, [visible])

    return <div className='flex h-full bg-white ' >
        <Sidebar
            collapsed={!visible}
            width={"240px"}
            collapsedWidth={isTablet ? '0px' : '50px'}
            className={styles.sidebar}

        >
            <div className='flex flex-col h-full'>
                <div className='flex-1 mb-8'>
                    <Menu closeOnClick >
                        {pages.map((page) => {
                            return <SubMenu
                                className='text-soft font-bold '
                                label={page.title}
                                title={page.title}
                                key={page.id}
                                open={openedID === page.id}
                                onClick={() => setOpenedID(prev => prev === page.id ? null : page.id)}
                                icon={<div className='rounded-full flex justify-center items-center w-10 h-10 bg-softBg shadow-primary shadow-sm'>
                                    <div className='ml-1'>
                                        <Icon name={page.icon} className='text-primary' />
                                    </div>
                                </div>}
                            >
                                {page.items.map((item) => {
                                    return <MenuItem
                                        key={item.id}
                                        onClick={() => {
                                            setOpenedID(null)
                                            navigate(item.url)
                                            setVisible(false)
                                        }}
                                        className='p-1 m-0'
                                    >
                                        {item.subtitle}
                                    </MenuItem>
                                })}
                            </SubMenu>
                        })}
                    </Menu>
                </div>
                <LayoutSidebarFooter visible={visible} setVisible={setVisible} />
            </div>
        </Sidebar>
    </div>
}
export default LayoutSidebar