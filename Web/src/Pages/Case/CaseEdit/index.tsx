import { useEditCaseMutation, useLazyGetCaseQuery } from '@Api/Case'
import { CaseEditRequest } from '@Api/Case/type'
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
import { DropdownItemProps, Form } from 'semantic-ui-react'
import { CASE_STATU_COMPLETE, CASE_STATU_DECLINED, CASE_STATU_ON_DECLINE_APPROVE, CASE_STATU_START, CASE_STATU_STOP, CASE_STATU_WORKING } from '@Constant/index'

const CaseAppForm = createAppForm<CaseEditRequest>()

const CaseEdit: React.FC = () => {

  const { t } = useTranslation()

  const { Id } = useParams()
  const navigate = useNavigate()

  const [GetCase, { isFetching }] = useLazyGetCaseQuery()
  const [EditCase, { isLoading }] = useEditCaseMutation()

  const methods = useForm<CaseEditRequest>({
    mode: 'onChange',
  })

  const { getValues, formState, trigger, reset, } = methods

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        EditCase(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Cases.Page.Header'),
              Description: t('Pages.Cases.Messages.UpdateSuccess')
            })
            navigate(Paths.Cases)
          })
      } else {
        CheckForm(formState, t('Pages.Cases.Page.Header'))
      }
    })
  }


  useEffect(() => {
    if (Id && validator.isUUID(Id)) {
      GetCase({ Uuid: Id })
        .unwrap()
        .then((data) => {
          reset({
            ...data,
          })
        })
    } else {
      Pushnotification({
        Type: 'Error',
        Subject: t('Pages.Cases.Page.Header'),
        Description: t('Pages.Cases.Messages.UndefinedCase')
      })
      navigate(Paths.Cases)
    }
  }, [Id, GetCase, navigate, reset, t])

  const typeOption: DropdownItemProps[] = [
    { text: t('Option.CaseStatu.Start'), value: CASE_STATU_START, },
    { text: t('Option.CaseStatu.Working'), value: CASE_STATU_WORKING, },
    { text: t('Option.CaseStatu.Complete'), value: CASE_STATU_COMPLETE, },
    { text: t('Option.CaseStatu.Stop'), value: CASE_STATU_STOP, },
    { text: t('Option.CaseStatu.OnDeclineApprove'), value: CASE_STATU_ON_DECLINE_APPROVE, },
    { text: t('Option.CaseStatu.Declined'), value: CASE_STATU_DECLINED, },
  ]

  return <Pagewrapper isLoading={isFetching || isLoading} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Cases.Page.Header')}
      AdditionalName={t('Pages.Cases.Page.EditHeader')}
      PageUrl={Paths.Cases}
    />
    <FormProvider<CaseEditRequest> {...methods}>
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <CaseAppForm.Input name='Name' label={t('Pages.Cases.Columns.Name')} required={t('Pages.Cases.Messages.NameRequired')} />
            <CaseAppForm.Input name='Description' label={t('Pages.Cases.Columns.Description')} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <CaseAppForm.Input name='Color' label={t('Pages.Cases.Columns.Color')} required={t('Pages.Cases.Messages.ColorRequired')} />
            <CaseAppForm.Select name='Type' label={t('Pages.Cases.Columns.Type')} required={t('Pages.Cases.Messages.TypeRequired')} options={typeOption} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <CaseAppForm.Checkbox name='Isdefault' label={t('Pages.Cases.Columns.Isdefault')} />
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
export default CaseEdit