import React, { PropsWithChildren } from 'react'
import { Tab, TabProps } from 'semantic-ui-react'
import styles from './style.module.scss'
import useMobile from '@Hooks/useMobile'

interface AppTabProps extends TabProps {

}

interface AppTabMenuItemProps {
    onError?: boolean
    errorCount?: number
}

export const AppTabMenuItem: React.FC<PropsWithChildren<AppTabMenuItemProps>> = (props) => {

    const { children, errorCount, onError } = props

    return <div className={` ${onError || (errorCount && errorCount > 0) ? '!text-[#9f3a38]' : ''}  `}>
        {children}
        {errorCount && errorCount > 0 ? ` (${errorCount})` : null}
    </div>
}

const AppTab: React.FC<AppTabProps> = (props) => {

    const { isTablet } = useMobile()

    return <div className={`w-full ${styles.tabWrapper} ${isTablet ? styles.tabWrapper_mobile : ''}`}>
        <Tab
            menu={{ fluid: true, vertical: false, tabular: false }}
            {...props}
        />
    </div>
}
export default AppTab

