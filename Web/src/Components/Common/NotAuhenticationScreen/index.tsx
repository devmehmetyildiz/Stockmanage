import React from 'react'
import { Message, Icon } from 'semantic-ui-react'
import Pagewrapper from '../Pagewrapper'
import { useTranslation } from 'react-i18next'

const NotAuhenticationScreen: React.FC = () => {

    const { t } = useTranslation()

    return (
        <Pagewrapper>
            <Message negative icon size="big" className="max-w-lg w-full text-center">
                <Icon name="ban" size="big" />
                <Message.Content>
                    <Message.Header>{t('Components.NotAuthentcationScreen.Title')}</Message.Header>
                    {t('Components.NotAuthentcationScreen.Message')}
                </Message.Content>
            </Message>
        </Pagewrapper>
    )
}

export default NotAuhenticationScreen
