import { useApprovePaymentplanTransactionMutation } from '@Api/Paymentplan'
import { PaymentplanApproveTransactionRequest, PaymentplanTransactionItem } from '@Api/Paymentplan/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Header, Image, Modal } from 'semantic-ui-react'
import { PAYMENTTYPE_TYPE_BANKTRANSFER, PAYMENTTYPE_TYPE_CASH, PAYMENTTYPE_TYPE_CREDITCARD, PAYMENTTYPE_TYPE_INVOICE } from '@Constant/index'

interface PaymentplantransactionApproveModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: PaymentplanTransactionItem | null
    setData: React.Dispatch<React.SetStateAction<PaymentplanTransactionItem | null>>
}

const TransactionAppForm = createAppForm<PaymentplanApproveTransactionRequest>()

const PaymentplantransactionApproveModal: React.FC<PaymentplantransactionApproveModalProps> = (props) => {

    const { open, data, setData, setOpen } = props

    const { t } = useTranslation()

    const [ApproveTransaction, { isLoading }] = useApprovePaymentplanTransactionMutation()

    const methods = useForm<PaymentplanApproveTransactionRequest>({
        mode: 'all',
        defaultValues: {
            TransactionID: '',
            Description: '',
            Paymentmethod: 4
        }
    })

    const { formState, reset, trigger, getValues } = methods

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                ApproveTransaction(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Paymentplantransactions.Page.Header'),
                            Description: t('Pages.Paymentplantransactions.Messages.ApproveSuccess')
                        })
                        setData(null)
                        setOpen(false)
                    })
            } else {
                CheckForm(formState, t('Pages.Paymentplantransactions.Page.Header'))
            }
        })
    }

    const paymentTypeOption = [
        { text: t('Option.Paymenttype.Cash'), value: PAYMENTTYPE_TYPE_CASH },
        { text: t('Option.Paymenttype.CreditCard'), value: PAYMENTTYPE_TYPE_CREDITCARD },
        { text: t('Option.Paymenttype.BankTransfer'), value: PAYMENTTYPE_TYPE_BANKTRANSFER },
        { text: t('Option.Paymenttype.Invoice'), value: PAYMENTTYPE_TYPE_INVOICE },
    ]

    const formattedTotal = useMemo(() => new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(data?.Amount || 0), [data?.Amount])

    useEffect(() => {
        if (open && data) {
            reset({
                TransactionID: data.Uuid,
                Description: '',
                Paymentmethod: 4
            })
        }
    }, [reset, open, data])

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.Paymentplantransactions.Page.ApproveHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.approve} wrapped />
            <Modal.Description>
                <Header>{formattedTotal}</Header>
                <p className='mb-6'>
                    {formattedTotal} {t('Pages.Paymentplantransactions.Approve.Label.ApproveCheck')}
                </p>
                <Modal.Description>
                    <FormProvider<PaymentplanApproveTransactionRequest> {...methods}>
                        <Contentwrapper>
                            <Form>
                                <Form.Group widths={'equal'}>
                                    <TransactionAppForm.Select name='Paymentmethod' label={t('Pages.Paymentplantransactions.Label.Paymentmethod')} required={t('Pages.Paymentplantransactions.Messages.PaymentmethodRequired')} options={paymentTypeOption} />
                                </Form.Group>
                                <Form.Group widths={'equal'}>
                                    <TransactionAppForm.Input name='Description' label={t('Pages.Paymentplantransactions.Label.Description')} />
                                </Form.Group>
                            </Form>
                        </Contentwrapper>
                    </FormProvider>
                </Modal.Description>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Approve')} onClick={submit} />
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default PaymentplantransactionApproveModal