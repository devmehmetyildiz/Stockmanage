import React from 'react'
import { useTranslation } from 'react-i18next'
import { Dimmer, Loader } from 'semantic-ui-react'

interface AppLoaderProps {
    loading: boolean
}

const AppLoader: React.FC<AppLoaderProps> = ({ loading }) => {

    const { t } = useTranslation()

    return <Dimmer active={loading} inverted>
        <Loader content={t('Loading')} />
    </Dimmer>
}
export default AppLoader