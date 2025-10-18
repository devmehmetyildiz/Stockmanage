import { useGetPaymenttypesQuery } from '@Api/Paymenttype'
import { useEditPaymentdefineVisitMutation, useLazyGetVisitQuery } from '@Api/Visit'
import { VisitUpdateDefinesRequest, VisitUpdatePaymentdefineRequest } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import { SuppressDate } from '@Utils/FormatDate'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { DropdownItemProps, Form } from 'semantic-ui-react'

const VisitAppForm = createAppForm<VisitUpdatePaymentdefineRequest>()

const VisitUpdatePaymentdefines: React.FC = () => {

    const { t } = useTranslation()

    const { Id } = useParams()
    const navigate = useNavigate()

    const [GetVisit, { isFetching, data }] = useLazyGetVisitQuery()
    const [EditVisitPaymentdefines, { isLoading }] = useEditPaymentdefineVisitMutation()

    const { data: paymenttypes, isFetching: isPaymenttypesFetching } = useGetPaymenttypesQuery({ isActive: 1 })


    const paymenttypeOpiton: DropdownItemProps[] = useMemo(() => {
        return (paymenttypes || []).map(item => {
            return {
                value: item.Uuid,
                text: item.Name
            }
        })
    }, [paymenttypes])


    const methods = useForm<VisitUpdateDefinesRequest>({
        mode: 'onChange',
    })

    const { getValues, formState, trigger, reset } = methods


    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                EditVisitPaymentdefines(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Visits.Page.Header'),
                            Description: t('Pages.Visits.Messages.UpdateSuccess')
                        })
                        navigate(`${Paths.Visits}?tab=working`)
                    })
            } else {
                CheckForm(formState, t('Pages.Visits.Page.Header'))
            }
        })
    }

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetVisit({ Uuid: Id })
                .unwrap()
                .then((data) => {
                    reset({
                        VisitID: data.Uuid,
                        PaymenttypeID: data.PaymenttypeID,
                        Scheduledpayment: data.Scheduledpayment
                    })
                })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Visits.Page.Header'),
                Description: t('Pages.Visits.Messages.UndefinedVisit')
            })
            navigate(`${Paths.Visits}?tab=working`)
        }
    }, [Id, GetVisit, navigate, reset, t])

    return <Pagewrapper isLoading={isFetching || isLoading || isPaymenttypesFetching} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Visits.Page.EditDefinesHeader')}
            AdditionalName={data?.Visitcode}
            PageUrl={`${Paths.Visits}?tab=working`}
        />
        <FormProvider<VisitUpdateDefinesRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <VisitAppForm.Select name='PaymenttypeID' label={t('Pages.Visits.Columns.PaymenttypeID')} options={paymenttypeOpiton} />
                        <VisitAppForm.Input name='Scheduledpayment' label={t('Pages.Visits.Columns.Scheduledpayment')} type='number' inputProps={{ min: 0 }} showPriceIcon />
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
                text={t('Common.Button.Update')}
                onClick={() => submit()}
            />
        </FormFooter>
    </Pagewrapper >
}
export default VisitUpdatePaymentdefines