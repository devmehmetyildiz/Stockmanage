import { useEditRuleMutation, useLazyGetRuleQuery } from '@Api/Rule'
import { RuleEditRequest } from '@Api/Rule/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import { breakdownmainteanciesrule, mainteancecreaterule, maintestrule, patientroutinecreaterrule, patienttodoccreaterule, personelshifteditorrule, usercreaterule } from '@Constant/ruleTemplates'
import { Editor } from '@monaco-editor/react'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Dropdown, Form } from 'semantic-ui-react'

const RuleAppForm = createAppForm<RuleEditRequest>()

const RuleEdit: React.FC = () => {

  const { t } = useTranslation()

  const { Id } = useParams()
  const navigate = useNavigate()
  const templateEditorRef = useRef<any>(undefined)

  const [GetRule, { isFetching }] = useLazyGetRuleQuery()
  const [EditRule, { isLoading }] = useEditRuleMutation()

  const methods = useForm<RuleEditRequest>({
    mode: 'onChange',
    defaultValues: {
      Name: '',
      Rule: '',
      Info: '',
      Status: false
    },
  })

  const { getValues, formState, trigger, reset, setValue, watch } = methods

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        const values = getValues()
        if (values.Rule.length <= 0) {
          Pushnotification({
            Type: 'Error',
            Subject: t('Pages.Rules.Page.Header'),
            Description: t('Pages.Rules.Messages.RuleRequired')
          })
        } else {
          EditRule(getValues())
            .unwrap()
            .then(() => {
              Pushnotification({
                Type: 'Success',
                Subject: t('Pages.Rules.Page.Header'),
                Description: t('Pages.Rules.Messages.UpdateSuccess')
              })
              navigate(Paths.Rules)
            })
        }
      } else {
        CheckForm(formState, t('Pages.Rules.Page.Header'))
      }
    })
  }

  const [SelectedRule] = watch(['Rule'])

  const handleTemplateEditorChange = () => {
    setValue('Rule', templateEditorRef.current.getValue())
  }

  const handleTemplateEditorDidMount = (editor: any) => {
    templateEditorRef.current = editor
    templateEditorRef.current.onDidChangeModelContent(handleTemplateEditorChange)
  }

  const Templateoptions = [
    { key: 1, text: "Breakdown and Mainteancies Notification Rule", value: breakdownmainteanciesrule },
    { key: 2, text: "Patient Todo Create Rule", value: patienttodoccreaterule },
    { key: 3, text: "Personel Shift Editor Rule", value: personelshifteditorrule },
    { key: 4, text: "User Create Rule", value: usercreaterule },
    { key: 5, text: "Mainteance Creater Rule", value: mainteancecreaterule },
    { key: 6, text: "Mail Test Rule", value: maintestrule },
    { key: 7, text: "Patient Routine Creater Rule", value: patientroutinecreaterrule },
  ]

  useEffect(() => {
    if (Id && validator.isUUID(Id)) {
      GetRule({ Uuid: Id })
        .unwrap()
        .then((data) => {
          reset({
            ...data,
            Status: data.Status === 1 || data.Status === true ? true : false
          })
        })
    } else {
      Pushnotification({
        Type: 'Error',
        Subject: t('Pages.Rules.Page.Header'),
        Description: t('Pages.Rules.Messages.UndefinedRule')
      })
      navigate(Paths.Rules)
    }
  }, [Id, GetRule, navigate, reset, t])

  return <Pagewrapper isLoading={isFetching || isLoading} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Rules.Page.Header')}
      AdditionalName={t('Pages.Rules.Page.EditHeader')}
      PageUrl={Paths.Rules}
    />
    <FormProvider<RuleEditRequest> {...methods}>
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <RuleAppForm.Input name='Name' label={t('Pages.Rules.Columns.Name')} required={t('Pages.Rules.Messages.NameRequired')} />
            <RuleAppForm.Input name='Info' label={t('Pages.Rules.Columns.Info')} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <RuleAppForm.Checkbox name='Status' label={t('Pages.Rules.Columns.Status')} />
          </Form.Group>
          <Form.Field>
            <label className='text-[#000000de]'>{t('Pages.Rules.Columns.Templates')}</label>
            <Dropdown
              placeholder={t('Pages.Rules.Columns.Templates')}
              onChange={(_, data) => {
                setValue('Rule', data.value as any)
              }}
              options={Templateoptions}
              clearable
              search
              fluid
              selection
            />
          </Form.Field>
          <Contentwrapper>
            <Editor
              height="54vh"
              language="javascript"
              value={SelectedRule}
              onMount={handleTemplateEditorDidMount}
            />
          </Contentwrapper>
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
export default RuleEdit