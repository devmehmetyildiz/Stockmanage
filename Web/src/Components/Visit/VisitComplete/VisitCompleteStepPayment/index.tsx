import { VisitCompleteRequest } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import Pagewrapper from '@Components/Common/Pagewrapper'
import { PAYMENTTYPE_TYPE_BANKTRANSFER, PAYMENTTYPE_TYPE_CASH, PAYMENTTYPE_TYPE_CREDITCARD, PAYMENTTYPE_TYPE_INSTALLMENT, PAYMENTTYPE_TYPE_INVOICE } from '@Constant/index'
import { createAppForm } from '@Utils/CreateAppForm'
import validator from '@Utils/Validator'
import React, { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'semantic-ui-react'

const VisitAppForm = createAppForm<VisitCompleteRequest>()

const VisitCompleteStepPayment: React.FC = () => {

    const { t } = useTranslation()

    const { watch, setValue } = useFormContext<VisitCompleteRequest>()

    const [isFullPayment, Totalamount] = watch(['isFullPayment', 'Totalamount'])

    const paymentTypeOption = [
        { text: t('Option.Paymenttype.Cash'), value: PAYMENTTYPE_TYPE_CASH },
        { text: t('Option.Paymenttype.CreditCard'), value: PAYMENTTYPE_TYPE_CREDITCARD },
        { text: t('Option.Paymenttype.BankTransfer'), value: PAYMENTTYPE_TYPE_BANKTRANSFER },
        { text: t('Option.Paymenttype.Invoice'), value: PAYMENTTYPE_TYPE_INVOICE },
    ]

    useEffect(() => {
        if (isFullPayment) {
            setValue('Duedays', 0)
            setValue('Installmentcount', 0)
            setValue('Installmentinterval', 0)
            setValue('Prepaymentamount', 0)
        }
    }, [setValue, isFullPayment])

    return <Pagewrapper dynamicHeight alignTop direction='vertical' gap={4}>
        <Contentwrapper className='!bg-transparent !outline-none !shadow-none'>
            <Form>
                <Form.Group widths={'equal'}>
                    <VisitAppForm.Input name='Totalamount' label={t('Pages.Visits.Label.Totalamount')} required={t('Pages.Visits.Messages.TotalamountReqired')} type='number' inputProps={{ min: 0 }} showPriceIcon />
                    <VisitAppForm.Checkbox name='isFullPayment' label={t('Pages.Visits.Label.isFullPayment')} />
                </Form.Group>
                {!isFullPayment ?
                    <>
                        <Form.Group widths={'equal'}>
                            <VisitAppForm.Input name='Prepaymentamount' label={t('Pages.Visits.Label.Prepayment')} required={t('Pages.Visits.Messages.PrepaymentReqired')} type='number' inputProps={{ min: 0 }}
                                rules={{
                                    validate: (value: any) => {
                                        if (validator.isNumber(value)) {
                                            if (value > Totalamount) {
                                                return t('Pages.Visits.Messages.PrepaymentBigger')
                                            }
                                            return true
                                        } else {
                                            return t('Pages.Visits.Messages.PrepaymentReqired')
                                        }
                                    }
                                }} showPriceIcon
                            />
                            <VisitAppForm.Select name='Prepaymenttype' label={t('Pages.Visits.Label.Prepaymenttype')} required={t('Pages.Visits.Messages.PrepaymenttypeReqired')} options={paymentTypeOption} />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <VisitAppForm.Input name='Installmentcount' label={t('Pages.Visits.Label.Installmentcount')} required={t('Pages.Visits.InstallmentcountRequired')} type='number' inputProps={{ min: 0 }} />
                            <VisitAppForm.Input name='Installmentinterval' label={t('Pages.Visits.Label.Installmentinterval')} required={t('Pages.Visits.InstallmentintervalRequired')} type='number' inputProps={{ min: 0 }} />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <VisitAppForm.Input name='Duedays' label={t('Pages.Visits.Label.Duedays')} required={t('Pages.Visits.DuedaysRequired')} type='number' inputProps={{ min: 0 }} />
                        </Form.Group>
                    </>
                    : <Form.Group widths={'equal'}>
                        <VisitAppForm.Select name='Prepaymenttype' label={t('Pages.Visits.Label.Paymenttype')} required={t('Pages.Visits.Messages.PaymenttypeReqired')} options={paymentTypeOption} />
                    </Form.Group>}
            </Form>
        </Contentwrapper>
    </Pagewrapper>

}
export default VisitCompleteStepPayment