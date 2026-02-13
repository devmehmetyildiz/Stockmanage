import React, { useMemo } from 'react'
import { useAddCashflowMutation } from '@Api/Cashflow'
import { CashflowAddRequest } from '@Api/Cashflow/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form } from 'semantic-ui-react'
import {
    PAYMENT_TRANSACTION_TYPE_INCOME, PAYMENT_TRANSACTION_TYPE_OUTCOME, PAYMENT_TRANSACTION_TYPE_PASSIVE,
    PAYMENTTYPE_TYPE_BANKTRANSFER, PAYMENTTYPE_TYPE_CASH, PAYMENTTYPE_TYPE_CREDITCARD, PAYMENTTYPE_TYPE_INVOICE
} from '@Constant/index'

const CashflowAppForm = createAppForm<CashflowAddRequest>()

const CashflowCreate: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const methods = useForm<CashflowAddRequest>({
        mode: 'onChange',
    })

    const { getValues, formState, trigger } = methods

    const [AddCashflow, { isLoading }] = useAddCashflowMutation()

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                AddCashflow(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Cashflows.Page.Header'),
                            Description: t('Pages.Cashflows.Messages.AddSuccess')
                        })
                        navigate(Paths.Cashflows)
                    })
            } else {
                CheckForm(formState, t('Pages.Cashflows.Page.Header'))
            }
        })
    }

    const transactionTypeOption = useMemo(() => {
        return [
            { text: t('Option.Movementoption.Income'), value: PAYMENT_TRANSACTION_TYPE_INCOME },
            { text: t('Option.Movementoption.Outcome'), value: PAYMENT_TRANSACTION_TYPE_OUTCOME },
            { text: t('Option.Movementoption.Passive'), value: PAYMENT_TRANSACTION_TYPE_PASSIVE },
        ]
    }, [])

    const paymentTypeOption = [
        { text: t('Option.Paymenttype.Cash'), value: PAYMENTTYPE_TYPE_CASH },
        { text: t('Option.Paymenttype.CreditCard'), value: PAYMENTTYPE_TYPE_CREDITCARD },
        { text: t('Option.Paymenttype.BankTransfer'), value: PAYMENTTYPE_TYPE_BANKTRANSFER },
        { text: t('Option.Paymenttype.Invoice'), value: PAYMENTTYPE_TYPE_INVOICE },
    ]

    return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Cashflows.Page.Header')}
            AdditionalName={t('Pages.Cashflows.Page.CreateHeader')}
            PageUrl={Paths.Cashflows}
        />
        <FormProvider<CashflowAddRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <CashflowAppForm.Select name='Type' label={t('Pages.Cashflows.Columns.Type')} required={t('Pages.Cashflows.Messages.TypeRequired')} options={transactionTypeOption} />
                        <CashflowAppForm.Select name='Paymenttype' label={t('Pages.Cashflows.Columns.Paymenttype')} required={t('Pages.Cashflows.Messages.PaymenttypeRequired')} options={paymentTypeOption} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <CashflowAppForm.Input name='Processdate' label={t('Pages.Cashflows.Columns.Processdate')} required={t('Pages.Cashflows.Messages.ProcessdateRequired')} type='date' />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <CashflowAppForm.Input
                            name={`Amount`}
                            label={t('Pages.Cashflows.Columns.Amount')}
                            required={t('Pages.Cashflows.Messages.AmountRequired')}
                            rules={{
                                required: t('Pages.Cashflows.Messages.AmountRequired'),
                                validate: (value: any) => {
                                    if (value > 0) {
                                        return true
                                    }
                                    return t('Pages.Cashflows.Messages.AmountRequired')
                                }
                            }}
                            type='number'
                            inputProps={{ min: 0 }}
                            showPriceIcon
                        />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <CashflowAppForm.Input label={t('Pages.Cashflows.Columns.Info')} name='Info' />
                    </Form.Group>
                </Form>
            </Contentwrapper>
        </FormProvider>
        <FormFooter>
            <FormButton
                onClick={() => navigate(-1)}
                secondary
                text={t('Common.Button.Goback')}
            />
            <FormButton
                loading={isLoading}
                text={t('Common.Button.Create')}
                onClick={() => submit()}
            />
        </FormFooter>
    </Pagewrapper >
}
export default CashflowCreate