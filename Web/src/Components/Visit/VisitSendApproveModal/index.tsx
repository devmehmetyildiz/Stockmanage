import { useSendApproveVisitMutation } from '@Api/Visit'
import { VisitListItem, VisitSendApproveRequest } from '@Api/Visit/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Header, Image, Modal } from 'semantic-ui-react'

interface VisitSendApproveModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: VisitListItem | null
    setData: React.Dispatch<React.SetStateAction<VisitListItem | null>>
}

const VisitAppForm = createAppForm<VisitSendApproveRequest>()

const VisitSendApproveModal: React.FC<VisitSendApproveModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [SendApproveVisit, { isLoading }] = useSendApproveVisitMutation()

    const methods = useForm<VisitSendApproveRequest>({
        mode: 'all',
        defaultValues: {
            VisitID: '',
            Comment: ''
        }
    })

    const { formState, reset, trigger, getValues } = methods

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                SendApproveVisit(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Visits.Page.Header'),
                            Description: t('Pages.Visits.Messages.SendApproveSuccess')
                        })
                        setData(null)
                        setOpen(false)
                    })
            } else {
                CheckForm(formState, t('Pages.Visits.Page.Header'))
            }
        })
    }

    useEffect(() => {
        if (open && data) {
            reset({
                Comment: '',
                VisitID: data.Uuid
            })
        }
    }, [reset, open, data])

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.Visits.Page.SendApproveHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.approve} wrapped />
            <Modal.Description>
                <Header>{data?.Visitcode}</Header>
                <p className='mb-6'>
                    {data?.Visitcode} {t('Pages.Visits.SendApprove.Label.SendApproveCheck')}
                </p>
                <Modal.Description>
                    <FormProvider<VisitSendApproveRequest> {...methods}>
                        <Contentwrapper>
                            <Form>
                                <Form.Group widths={'equal'}>
                                    <VisitAppForm.Input name='Comment' label={t('Pages.Visits.Columns.Comment')} />
                                </Form.Group>
                            </Form>
                        </Contentwrapper>
                    </FormProvider>
                </Modal.Description>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.SendApprove')} onClick={submit} />
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default VisitSendApproveModal