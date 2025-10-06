import { useAddMailsettingMutation } from '@Api/Mailsetting'
import { MailsettingAddRequest } from '@Api/Mailsetting/type'
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

const MailsettingAppForm = createAppForm<MailsettingAddRequest>()

const MailsettingCreate: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const methods = useForm<MailsettingAddRequest>({
        mode: 'onChange',
        defaultValues: {
            Isbodyhtml: false,
            Issettingactive: false
        }
    })

    const { getValues, formState, trigger } = methods

    const [AddMailsetting, { isLoading }] = useAddMailsettingMutation()

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                AddMailsetting(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Mailsettings.Page.Header'),
                            Description: t('Pages.Mailsettings.Messages.AddSuccess')
                        })
                        navigate(Paths.Mailsettings)
                    })
            } else {
                CheckForm(formState, t('Pages.Mailsettings.Page.Header'))
            }
        })
    }

    return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Mailsettings.Page.Header')}
            AdditionalName={t('Pages.Mailsettings.Page.CreateHeader')}
            PageUrl={Paths.Mailsettings}
        />
        <FormProvider<MailsettingAddRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <MailsettingAppForm.Input name='Name' label={t('Pages.Mailsettings.Columns.Name')} required={t('Pages.Mailsettings.Messages.NameRequired')} />
                        <MailsettingAppForm.Input name='User' label={t('Pages.Mailsettings.Columns.User')} required={t('Pages.Mailsettings.Messages.UserRequired')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <MailsettingAppForm.Input name='Password' label={t('Pages.Mailsettings.Columns.Password')} required={t('Pages.Mailsettings.Messages.PasswordRequired')} type='password' />
                        <MailsettingAppForm.Input name='Smtpport' label={t('Pages.Mailsettings.Columns.Smtpport')} required={t('Pages.Mailsettings.Messages.SmtpportRequired')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <MailsettingAppForm.Input name='Smtphost' label={t('Pages.Mailsettings.Columns.Smtphost')} required={t('Pages.Mailsettings.Messages.SmtphostRequired')} />
                        <MailsettingAppForm.Input name='Mailaddress' label={t('Pages.Mailsettings.Columns.Mailaddress')} required={t('Pages.Mailsettings.Messages.MailaddressRequired')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <MailsettingAppForm.Checkbox name='Isbodyhtml' label={t('Pages.Mailsettings.Columns.Isbodyhtml')} />
                        <MailsettingAppForm.Checkbox name='Issettingactive' label={t('Pages.Mailsettings.Columns.Issettingactive')} />
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
export default MailsettingCreate