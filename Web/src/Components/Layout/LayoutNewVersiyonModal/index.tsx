import config from '@Constant/config'
import Paths from '@Constant/path'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button, Header, Icon, List, Modal } from 'semantic-ui-react'

interface LayoutNewVersiyonModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const LayoutNewVersiyonModal: React.FC<LayoutNewVersiyonModalProps> = ({ open, setOpen }) => {

    const { t } = useTranslation()
    const navigate = useNavigate()
    return <Modal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size="tiny"
        dimmer="blurring"
    >

        <Header icon textAlign="center" style={{ borderBottom: 'none', paddingTop: '2rem' }}>
            <Icon name='rocket' color='blue' circular inverted />
            <Header.Content style={{ marginTop: '1rem' }}>
                {t('Components.LayoutNewVersiyonModal.Title')}
                <Header.Subheader>{config.version}</Header.Subheader>
            </Header.Content>
        </Header>

        <Modal.Actions style={{ backgroundColor: '#f9fafb', borderTop: 'none', padding: '1.5rem' }}>
            <Button
                color='grey'
                basic
                onClick={() => setOpen(false)}
            >
                {t('Components.LayoutNewVersiyonModal.NoButton')}
            </Button>
            <Button
                content={t('Components.LayoutNewVersiyonModal.Button')}
                labelPosition='right'
                icon='arrow right'
                onClick={() => {
                    navigate(Paths.About)
                    setOpen(false)
                }}
                primary
                style={{ borderRadius: '20px' }}
            />
        </Modal.Actions>
    </Modal >
}
export default LayoutNewVersiyonModal