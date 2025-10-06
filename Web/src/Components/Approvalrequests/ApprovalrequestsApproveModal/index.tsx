import { useApproveApprovalRequestsMutation } from '@Api/Approvalrequests'
import { ApprovalrequestApproveRequest, ApprovalrequestItem } from '@Api/Approvalrequests/type'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import CheckForm from '@Utils/CheckForm'
import Pushnotification from '@Utils/Pushnotification'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Image, Modal } from 'semantic-ui-react'
import ApprovalrequestsApproveModalForm from './ApprovalrequestsApproveModalForm'

interface ApprovalrequestsApproveModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    selectedRecords: ApprovalrequestItem[]
    setSelectedRecords: React.Dispatch<React.SetStateAction<ApprovalrequestItem[]>>
}

const ApprovalrequestsApproveModal: React.FC<ApprovalrequestsApproveModalProps> = (props) => {

    const { open, setOpen, selectedRecords, setSelectedRecords } = props
    const { t } = useTranslation()

    const [ApproveRequests, { isLoading }] = useApproveApprovalRequestsMutation()

    const methods = useForm<ApprovalrequestApproveRequest>({
        mode: 'all',
        defaultValues: {
            ApproveList: []
        }
    })

    const { trigger, formState, getValues, reset } = methods

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                if (selectedRecords.length > 0) {
                    ApproveRequests(getValues())
                        .unwrap()
                        .then(() => {
                            setSelectedRecords([])
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Approvalrequests.Page.ApproveHeader'),
                                Description: t('Pages.Approvalrequests.Messages.ApproveSuccess')
                            })
                        })
                } else {
                    Pushnotification({
                        Type: 'Error',
                        Subject: t('Pages.Approvalrequests.Page.ApproveHeader'),
                        Description: t('Pages.Approvalrequests.Messages.Approvelistnotfound')
                    })
                }
            } else {
                CheckForm(formState, t('Pages.Approvalrequests.Page.ApproveHeader'))
            }
        })
    }

    useEffect(() => {
        if (open) {
            reset({
                ApproveList: selectedRecords.map(item => {
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
        <Modal.Header>{t('Pages.Approvalrequests.Page.ApproveHeader')}</Modal.Header>
        <Modal.Content >
            <FormProvider<ApprovalrequestApproveRequest> {...methods}>
                <Form>
                    <ApprovalrequestsApproveModalForm selectedRecords={selectedRecords} />
                </Form>
            </FormProvider>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Approve')} onClick={() => submit()} />
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default ApprovalrequestsApproveModal