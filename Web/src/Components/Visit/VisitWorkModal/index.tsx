import { useWorkVisitMutation } from '@Api/Visit'
import { VisitListItem } from '@Api/Visit/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface VisitWorkModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: VisitListItem | null
    setData: React.Dispatch<React.SetStateAction<VisitListItem | null>>
}

const VisitWorkModal: React.FC<VisitWorkModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [WorkVisit, { isLoading }] = useWorkVisitMutation()

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.Visits.Page.WorkHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.approve} wrapped />
            <Modal.Description>
                <Header>{data?.Visitcode}</Header>
                <p>
                    {data?.Visitcode} {t('Pages.Visits.Work.Label.WorkCheck')}
                </p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Work')} onClick={() => {
                if (data?.Uuid) {
                    WorkVisit({ VisitID: data.Uuid })
                        .unwrap()
                        .then(() => {
                            setData(null)
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Visits.Page.Header'),
                                Description: t('Pages.Visits.Messages.WorkSuccess')
                            })
                        })
                }
            }} />
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default VisitWorkModal