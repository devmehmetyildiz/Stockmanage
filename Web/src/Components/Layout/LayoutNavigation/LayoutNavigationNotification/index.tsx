import useLayout from '@Hooks/useLayout'
import React from 'react'
import { Icon } from 'semantic-ui-react'

const LayoutNavigationNotification: React.FC = () => {

    const { changeNotificationSidebar, isNotificationSidebarOpen } = useLayout()

    return <div
        className='cursor-pointer group'
        onClick={() => {
            changeNotificationSidebar(!isNotificationSidebarOpen)
        }}
    >
        <Icon name='bell' className='text-white group-hover:text-gray-300 transition-all duration-500 pt-2' />
    </div>
}
export default LayoutNavigationNotification