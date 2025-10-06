import { useEditMailsettingMutation, useLazyGetMailsettingQuery } from '@Api/Mailsetting'
import { MailsettingEditRequest } from '@Api/Mailsetting/type'
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

const MailsettingAppForm = createAppForm<MailsettingEditRequest>()

const MailsettingEdit: React.FC = () => {

    const { t } = useTranslation()

    const { Id } = useParams()
    const navigate = useNavigate()

    const [GetMailsetting, { isFetching }] = useLazyGetMailsettingQuery()
    const [EditMailsetting, { isLoading }] = useEditMailsettingMutation()

    const methods = useForm<MailsettingEditRequest>({
        mode: 'onChange',
        defaultValues: {
            Isbodyhtml: false,
            Issettingactive: false
        },
    })

    const { getValues, formState, trigger, reset } = methods

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                EditMailsetting(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Mailsettings.Page.Header'),
                            Description: t('Pages.Mailsettings.Messages.UpdateSuccess')
                        })
                        navigate(Paths.Mailsettings)
                    })
            } else {
                CheckForm(formState, t('Pages.Mailsettings.Page.Header'))
            }
        })
    }

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetMailsetting({ Uuid: Id })
                .unwrap()
                .then((data) => {
                    reset(data)
                })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Mailsettings.Page.Header'),
                Description: t('Pages.Mailsettings.Messages.UndefinedMailsetting')
            })
            navigate(Paths.Mailsettings)
        }
    }, [Id, GetMailsetting, navigate, reset, t])

    return <Pagewrapper isLoading={isFetching || isLoading} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Mailsettings.Page.Header')}
            AdditionalName={t('Pages.Mailsettings.Page.EditHeader')}
            PageUrl={Paths.Mailsettings}
        />
        <FormProvider<MailsettingEditRequest> {...methods}>
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
                text={t('Common.Button.Update')}
                onClick={() => submit()}
            />
        </FormFooter>
    </Pagewrapper >
}
export default MailsettingEdit