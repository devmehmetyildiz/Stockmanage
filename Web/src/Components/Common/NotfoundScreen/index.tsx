import React from 'react'
import { useTranslation } from 'react-i18next'

import styles from './style.module.scss'

interface NotfoundScreenProps {
    text?: string
    fullScreen?: boolean
    noWrap?: boolean
}

const NotfoundScreen: React.FC<NotfoundScreenProps> = (props) => {

    const { text, fullScreen, noWrap } = props

    const { t } = useTranslation()

    return <div className={`w-full flex justify-center items-center overflow-hidden ${fullScreen ? 'h-screen' : ''}  `}>
        <div className={`${styles.noDataMessage} ${noWrap ? ' !whitespace-nowrap ':''}`}>
            <div className={`${styles.noDataMessageText} ${noWrap ? ' !whitespace-nowrap !text-nowrap ':''}`}>{text ?? t('Components.NotfoundScreen.Message')}</div>
        </div>

    </div>
}
export default NotfoundScreen