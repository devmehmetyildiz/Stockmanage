import { useRejectApprovalRequestsMutation } from '@Api/Approvalrequests'
import { ApprovalrequestRejectRequest, ApprovalrequestItem } from '@Api/Approvalrequests/type'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import CheckForm from '@Utils/CheckForm'
import Pushnotification from '@Utils/Pushnotification'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Modal } from 'semantic-ui-react'
import ApprovalrequestsRejectedModalForm from './ApprovalrequestsRejectedModalForm'

interface ApprovalrequestsRejectedModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedRecords: ApprovalrequestItem[]
    setSelectedRecords: React.Dispatch<React.SetStateAction<ApprovalrequestItem[]>>
}

const ApprovalrequestsRejectedModal: React.FC<ApprovalrequestsRejectedModalProps> = (props) => {

    const { open, setOpen, selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()

    const [RejectRequests, { isLoading }] = useRejectApprovalRequestsMutation()

    const methods = useForm<ApprovalrequestRejectRequest>({
        mode: 'all',
        defaultValues: {
            RejectList: []
        }
    })

    const { trigger, formState, getValues, reset } = methods

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                if (selectedRecords.length > 0) {
                    RejectRequests(getValues())
                        .unwrap()
                        .then(() => {
                            setSelectedRecords([])
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Approvalrequests.Page.RejectHeader'),
                                Description: t('Pages.Approvalrequests.Messages.RejectSuccess')
                            })
                        })
                } else {
                    Pushnotification({
                        Type: 'Error',
                        Subject: t('Pages.Approvalrequests.Page.RejectHeader'),
                        Description: t('Pages.Approvalrequests.Messages.Approvelistnotfound')
                    })
                }
            } else {
                CheckForm(formState, t('Pages.Approvalrequests.Page.RejectHeader'))
            }
        })
    }

    useEffect(() => {
        if (open) {
            reset({
                RejectList: selectedRecords.map(item => {
                    return {
                        Uuid: item.Uuid,
                        Comment: '',
                    }
                })
            })
        }
    }, [open, selectedRecords])

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.Approvalrequests.Page.RejectHeader')}</Modal.Header>
        <Modal.Content >
            <FormProvider<ApprovalrequestRejectRequest> {...methods}>
                <Form>
                    <ApprovalrequestsRejectedModalForm selectedRecords={selectedRecords} />
                </Form>
            </FormProvider>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Reject')} onClick={() => submit()} />
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default ApprovalrequestsRejectedModal