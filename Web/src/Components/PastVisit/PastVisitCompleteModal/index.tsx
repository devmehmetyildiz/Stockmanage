import { useCompletePastVisitMutation } from '@Api/Visit'
import { VisitListItem } from '@Api/Visit/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface PastVisitCompleteModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: VisitListItem | null
    setData: React.Dispatch<React.SetStateAction<VisitListItem | null>>
}

const PastVisitCompleteModal: React.FC<PastVisitCompleteModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [CompleteVisit, { isLoading }] = useCompletePastVisitMutation()

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.PastVisits.Page.CompleteHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.approve} wrapped />
            <Modal.Description>
                <Header>{data?.Visitcode}</Header>
                <p>
                    {data?.Visitcode} {t('Pages.PastVisits.Complete.Label.CompleteCheck')}
                </p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Complete')} onClick={() => {
                if (data?.Uuid) {
                    CompleteVisit({ VisitID: data.Uuid })
                        .unwrap()
                        .then(() => {
                            setData(null)
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.PastVisits.Page.Header'),
                                Description: t('Pages.PastVisits.Messages.CompleteSuccess')
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
export default PastVisitCompleteModal