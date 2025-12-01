import { useWorkFreeVisitMutation } from '@Api/Visit'
import { VisitListItem } from '@Api/Visit/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface FreeVisitWorkModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: VisitListItem | null
    setData: React.Dispatch<React.SetStateAction<VisitListItem | null>>
}

const FreeVisitWorkModal: React.FC<FreeVisitWorkModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [WorkVisit, { isLoading }] = useWorkFreeVisitMutation()

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.FreeVisits.Page.WorkHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.approve} wrapped />
            <Modal.Description>
                <Header>{data?.Visitcode}</Header>
                <p>
                    {data?.Visitcode} {t('Pages.FreeVisits.Work.Label.WorkCheck')}
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
                                Subject: t('Pages.FreeVisits.Page.Header'),
                                Description: t('Pages.FreeVisits.Messages.WorkSuccess')
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
export default FreeVisitWorkModal