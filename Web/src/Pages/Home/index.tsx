import Pagewrapper from '@Components/Common/Pagewrapper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header } from 'semantic-ui-react'

const Home: React.FC = () => {

    const { t } = useTranslation()

    return <Pagewrapper>
        <Header>{t('Pages.Home.Messages.Welcome')}</Header>
        <p>{t('Pages.Home.Messages.Description')}</p>
    </Pagewrapper>
}
export default Home