import { useEditPaymenttypeMutation, useLazyGetPaymenttypeQuery } from '@Api/Paymenttype'
import { PaymenttypeEditRequest } from '@Api/Paymenttype/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Form } from 'semantic-ui-react'

const PaymenttypeAppForm = createAppForm<PaymenttypeEditRequest>()

const PaymenttypeEdit: React.FC = () => {

  const { t } = useTranslation()

  const { Id } = useParams()
  const navigate = useNavigate()

  const [GetPaymenttype, { isFetching }] = useLazyGetPaymenttypeQuery()
  const [EditPaymenttype, { isLoading }] = useEditPaymenttypeMutation()

  const methods = useForm<PaymenttypeEditRequest>({
    mode: 'onChange',
  })

  const { getValues, formState, trigger, reset, } = methods

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        EditPaymenttype(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Paymenttypes.Page.Header'),
              Description: t('Pages.Paymenttypes.Messages.UpdateSuccess')
            })
            navigate(Paths.Paymenttypes)
          })
      } else {
        CheckForm(formState, t('Pages.Paymenttypes.Page.Header'))
      }
    })
  }


  useEffect(() => {
    if (Id && validator.isUUID(Id)) {
      GetPaymenttype({ Uuid: Id })
        .unwrap()
        .then((data) => {
          reset({
            ...data,
            Description: data.Description ?? undefined
          })
        })
    } else {
      Pushnotification({
        Type: 'Error',
        Subject: t('Pages.Paymenttypes.Page.Header'),
        Description: t('Pages.Paymenttypes.Messages.UndefinedPaymenttype')
      })
      navigate(Paths.Paymenttypes)
    }
  }, [Id, GetPaymenttype, navigate, reset, t])

  return <Pagewrapper isLoading={isFetching || isLoading} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Paymenttypes.Page.Header')}
      AdditionalName={t('Pages.Paymenttypes.Page.EditHeader')}
      PageUrl={Paths.Paymenttypes}
    />
    <FormProvider<PaymenttypeEditRequest> {...methods}>
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <PaymenttypeAppForm.Input name='Name' label={t('Pages.Paymenttypes.Columns.Name')} required={t('Pages.Paymenttypes.Messages.NameRequired')} />
            <PaymenttypeAppForm.Input name='Duedays' label={t('Pages.Paymenttypes.Columns.Duedays')} required={t('Pages.Paymenttypes.Messages.DuedaysRequired')} type='number' inputProps={{ min: 0 }} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <PaymenttypeAppForm.Input name='Installmentcount' label={t('Pages.Paymenttypes.Columns.Installmentcount')} required={t('Pages.Paymenttypes.Messages.InstallmentcountRequired')} type='number' inputProps={{ min: 0 }} />
            <PaymenttypeAppForm.Input name='Installmentinterval' label={t('Pages.Paymenttypes.Columns.Installmentinterval')} required={t('Pages.Paymenttypes.Messages.InstallmentintervalRequired')} type='number' inputProps={{ min: 0 }} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <PaymenttypeAppForm.Input name='Description' label={t('Pages.Paymenttypes.Columns.Description')} />
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
export default PaymenttypeEdit