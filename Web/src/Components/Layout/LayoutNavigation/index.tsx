import React from 'react'
import LayoutNavigationMenu from './LayoutNavigationMenu'
import LayoutNavigationTitle from './LayoutNavigationTitle'
import LayoutNavigationUser from './LayoutNavigationUser'
import LayoutNavigationNotification from './LayoutNavigationNotification'
import LayoutNaviationSearch from './LayoutNaviationSearch'
import { Icon, Popup } from 'semantic-ui-react'
import useMobile from '@Hooks/useMobile'

interface LayoutNavigationProps {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const LayoutNavigation: React.FC<LayoutNavigationProps> = ({ setVisible }) => {

    const { isSmallerThanBreakpoint } = useMobile(900)

    return <div className='w-full h-navbar bg-primary flex flex-row justify-between items-center px-4 relative z-10'>
        <LayoutNavigationMenu setVisible={setVisible} />
        <LayoutNavigationTitle />
        <div className='flex flex-row justify-end items-center gap-4'>
            {
                isSmallerThanBreakpoint ? <Popup
                    trigger={<Icon name='search' className='text-white group-hover:text-gray-300 transition-all duration-500 ' />}
                    on={'click'}
                    position="bottom center"
                >
                    <LayoutNaviationSearch />
                </Popup>
                    : <LayoutNaviationSearch />
            }
            <LayoutNavigationNotification />
            <LayoutNavigationUser />
        </div>
    </div>
}
export default LayoutNavigation