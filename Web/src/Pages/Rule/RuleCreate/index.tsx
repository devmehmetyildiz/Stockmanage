import { useAddRuleMutation } from '@Api/Rule'
import { RuleAddRequest } from '@Api/Rule/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import { breakdownmainteanciesrule, mainteancecreaterule, maintestrule,  usercreaterule } from '@Constant/ruleTemplates'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React, { useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Dropdown, Form } from 'semantic-ui-react'
import Editor from '@monaco-editor/react'

const RuleAppForm = createAppForm<RuleAddRequest>()

const RuleCreate: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()
    const templateEditorRef = useRef<any>(undefined)

    const methods = useForm<RuleAddRequest>({
        mode: 'onChange',
        defaultValues: {
            Name: '',
            Rule: '',
            Info: '',
            Status: false
        }
    })

    const { getValues, formState, trigger, watch, setValue } = methods

    const [AddRule, { isLoading }] = useAddRuleMutation()

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
                    AddRule(getValues())
                        .unwrap()
                        .then(() => {
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Rules.Page.Header'),
                                Description: t('Pages.Rules.Messages.AddSuccess')
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
        { key: 4, text: "User Create Rule", value: usercreaterule },
        { key: 5, text: "Mainteance Creater Rule", value: mainteancecreaterule },
        { key: 6, text: "Mail Test Rule", value: maintestrule },
    ]

    return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Rules.Page.Header')}
            AdditionalName={t('Pages.Rules.Page.CreateHeader')}
            PageUrl={Paths.Rules}
        />
        <FormProvider<RuleAddRequest> {...methods}>
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
                text={t('Common.Button.Create')}
                onClick={() => submit()}
            />
        </FormFooter>
    </Pagewrapper >
}
export default RuleCreate