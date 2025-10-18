import { useDeleteVisitMutation } from '@Api/Visit'
import { VisitListItem } from '@Api/Visit/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface VisitDeleteModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: VisitListItem | null
    setData: React.Dispatch<React.SetStateAction<VisitListItem | null>>
}

const VisitDeleteModal: React.FC<VisitDeleteModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [DeleteVisit, { isLoading }] = useDeleteVisitMutation()

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.Visits.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.dataClear} wrapped />
            <Modal.Description>
                <Header>{data?.Visitcode}</Header>
                <p>
                    {data?.Visitcode} {t('Pages.Visits.Delete.Label.DeleteCheck')}
                </p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Delete')} onClick={() => {
                if (data?.Uuid) {
                    DeleteVisit({ Uuid: data?.Uuid })
                        .unwrap()
                        .then(() => {
                            setData(null)
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Visits.Page.Header'),
                                Description: t('Pages.Visits.Messages.DeleteSuccess')
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
export default VisitDeleteModal