import { useAddPaymenttypeMutation } from '@Api/Paymenttype'
import { PaymenttypeAddRequest } from '@Api/Paymenttype/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form } from 'semantic-ui-react'

const PaymenttypeAppForm = createAppForm<PaymenttypeAddRequest>()

const PaymenttypeCreate: React.FC = () => {

  const { t } = useTranslation()

  const navigate = useNavigate()

  const methods = useForm<PaymenttypeAddRequest>({
    mode: 'onChange',
  })

  const { getValues, formState, trigger } = methods

  const [AddPaymenttype, { isLoading }] = useAddPaymenttypeMutation()

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        AddPaymenttype(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Paymenttypes.Page.Header'),
              Description: t('Pages.Paymenttypes.Messages.AddSuccess')
            })
            navigate(Paths.Paymenttypes)
          })
      } else {
        CheckForm(formState, t('Pages.Paymenttypes.Page.Header'))
      }
    })
  }

  return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Paymenttypes.Page.Header')}
      AdditionalName={t('Pages.Paymenttypes.Page.CreateHeader')}
      PageUrl={Paths.Paymenttypes}
    />
    <FormProvider<PaymenttypeAddRequest> {...methods}>
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
        text={t('Common.Button.Create')}
        onClick={() => submit()}
      />
    </FormFooter>
  </Pagewrapper >
}
export default PaymenttypeCreate