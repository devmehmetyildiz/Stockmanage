import { useChangePasswordMutation, useGetMetaQuery } from '@Api/Profile'
import { ProfileChangePasswordRequest, ProfileMetaResponse } from '@Api/Profile/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import { PASSWORD_REGEX } from '@Constant/index'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form, FormInputProps, Icon, Label, Popup } from 'semantic-ui-react'

const ChangePasswordAppForm = createAppForm<ProfileChangePasswordRequest>()

const ChangePassword: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const methods = useForm<ProfileChangePasswordRequest>({
        mode: 'onChange',
        defaultValues: {
            Newpassword: '',
            Newpasswordre: '',
            Oldpassword: ''
        }
    })

    const { getValues, formState, trigger, setValue } = methods

    const [ChangeUserPassword, { isLoading }] = useChangePasswordMutation()

    const { data: meta } = useGetMetaQuery()

    const { Username } = meta || {} as ProfileMetaResponse

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const values = getValues()
                if (!PASSWORD_REGEX.test(values.Newpassword)) {
                    Pushnotification({
                        Type: 'Error',
                        Subject: t('Pages.ChangePassword.Page.Header'),
                        Description: t('Pages.ChangePassword.Messages.PasswordHint')
                    })
                    return
                }
                if (values.Newpassword !== values.Newpasswordre) {
                    Pushnotification({
                        Type: 'Error',
                        Subject: t('Pages.ChangePassword.Page.Header'),
                        Description: t('Pages.ChangePassword.Messages.NewPasswordsarenotsame')
                    })
                } else {
                    ChangeUserPassword(getValues())
                        .unwrap()
                        .then(() => {
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.ChangePassword.Page.Header'),
                                Description: t('Pages.ChangePassword.Messages.ChangeSuccess')
                            })
                            navigate(Paths.Main)
                        })
                }
            } else {
                CheckForm(formState, t('Pages.ChangePassword.Page.Header'))
            }
        })
    }

    const generateRandomPassword = () => {
        const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        const lower = 'abcdefghijklmnopqrstuvwxyz'
        const digits = '0123456789'
        const special = '@$!%*?&.'
        const all = upper + lower + digits + special
        const getRandom = (chars: string) => chars[Math.floor(Math.random() * chars.length)]

        let password = [
            getRandom(upper),
            getRandom(lower),
            getRandom(digits),
            getRandom(special)
        ]

        for (let i = 4; i < 12; i++) {
            password.push(getRandom(all))
        }

        for (let i = password.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
                ;[password[i], password[j]] = [password[j], password[i]]
        }

        const newRandomPassword = password.join('')
        setValue('Newpassword', newRandomPassword)
        setValue('Newpasswordre', newRandomPassword)
    }

    const passwordType: FormInputProps = {
        type: 'password'
    }

    const generateIcon: React.ReactElement = <Popup
        trigger={
            <div onClick={() => generateRandomPassword()}>
                <Icon link name='hand point right' color='red' />
            </div>
        }
        content={t('Pages.Users.Messages.RandomPassword')}
        position='left center'
        on='hover'
    />

    const additionalicon: React.ReactElement = <Popup
        trigger={<div><Icon link name='question circle' /></div>}
        content={<Label color='blue' ribbon>{t('Pages.ChangePassword.Messages.PasswordHint')}</Label>}
        position='left center'
        on='click'
    />

    return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.ChangePassword.Page.Header')}
            AdditionalName={Username}
        />
        <FormProvider<ProfileChangePasswordRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <ChangePasswordAppForm.Input name='Oldpassword' label={t('Pages.ChangePassword.Columns.Currentpassword')} required={t('Pages.ChangePassword.Messages.OldpasswordReqired')} inputProps={passwordType} additionalIcon={additionalicon} type='password' />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <ChangePasswordAppForm.Input name='Newpassword' label={t('Pages.ChangePassword.Columns.Newpassword')} required={t('Pages.ChangePassword.Messages.NewpasswordReqired')} type='password' inputProps={passwordType} additionalIcon={[additionalicon, generateIcon]} />
                        <ChangePasswordAppForm.Input name='Newpasswordre' label={t('Pages.ChangePassword.Columns.NewpasswordRe')} required={t('Pages.ChangePassword.Messages.NewpasswordReqired')} type='password' inputProps={passwordType} additionalIcon={[additionalicon, generateIcon]} />
                    </Form.Group>
                </Form>
            </Contentwrapper>
        </FormProvider>
        <FormFooter>
            <FormButton
                onClick={() => navigate(Paths.Main)}
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
export default ChangePassword