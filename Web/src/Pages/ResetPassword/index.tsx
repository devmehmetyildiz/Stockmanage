import { useLazyGetPasswordResetUserQuery, usePasswordResetMutation } from '@Api/Auth'
import { PasswordResetRequestForm } from '@Api/Auth/type'
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
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, FormInputProps, Icon, Popup } from 'semantic-ui-react'
import styles from './style.module.scss'

const ResetPasswordAppForm = createAppForm<PasswordResetRequestForm>()

const ResetPassword: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()
    const { Id } = useParams()

    const methods = useForm<PasswordResetRequestForm>({
        mode: 'onChange',
        defaultValues: {
            Password: '',
            PasswordRe: '',
            RequestId: ''
        }
    })

    const { getValues, formState, trigger, reset, setValue } = methods

    const [ResetPassword, { isLoading }] = usePasswordResetMutation()
    const [GetPasswordResetUser, { isFetching, data: user }] = useLazyGetPasswordResetUserQuery()

    const passwordType: FormInputProps = {
        type: 'password'
    }

    const passwordValidation = (value: any) => {
        if (PASSWORD_REGEX.test(value)) {
            return true
        } else {
            return t('Pages.Users.Messages.PasswordHint')
        }
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
        setValue('Password', newRandomPassword)
        setValue('PasswordRe', newRandomPassword)
    }

    const additionalicon: React.ReactElement = <Popup
        trigger={
            <div onClick={() => generateRandomPassword()}>
                <Icon link name='hand point right' color='red' />
            </div>
        }
        content={t('Pages.Users.Messages.RandomPassword')}
        position='left center'
        on='hover'
    />

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const values = getValues()
                if (values.Password !== values.PasswordRe) {
                    Pushnotification({
                        Type: 'Error',
                        Subject: t('Pages.PasswordReset.Page.Header'),
                        Description: t('Pages.PasswordReset.Messages.NewPasswordsarenotsame')
                    })
                    return
                }

                if (!PASSWORD_REGEX.test(values.Password)) {
                    Pushnotification({
                        Type: 'Error',
                        Subject: t('Pages.PasswordReset.Page.Header'),
                        Description: t('Pages.PasswordReset.Messages.PasswordHint')
                    })
                    return
                }

                ResetPassword(values)
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.PasswordReset.Page.Header'),
                            Description: t('Pages.PasswordReset.Messages.Success')
                        })
                        navigate(Paths.Login)
                    })
            } else {
                CheckForm(formState, t('Pages.PasswordReset.Page.Header'))
            }
        })
    }

    useEffect(() => {
        if (Id) {
            GetPasswordResetUser({ requestId: Id })
        }
    }, [Id, GetPasswordResetUser])

    useEffect(() => {
        if (Id) {
            reset({
                Password: '',
                PasswordRe: '',
                RequestId: Id
            })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.PasswordReset.Page.Header'),
                Description: t('Pages.PasswordReset.Messages.RequestIDRequired')
            })
            navigate(Paths.Login)
        }
    }, [Id, reset, Pushnotification])

    return <Pagewrapper padding={40} fullscreen isLoading={isLoading || isFetching} direction='vertical' alignTop gap={4} className={styles.login}>
        <div className='w-full'>
            <Pagewrapper direction='vertical'  gap={4}>
                <Contentwrapper bottomRounded>
                    <Title
                        PageName={t('Pages.PasswordReset.Page.Header')}
                        AdditionalName={user?.Username}
                        PageUrl={Paths.ResetPassword}
                    />
                    <FormProvider<PasswordResetRequestForm> {...methods}>
                        <Form>
                            <Form.Group widths={'equal'}>
                                <ResetPasswordAppForm.Input name='Password' label={t('Pages.PasswordReset.Columns.Newpassword')} required={t('Pages.PasswordReset.Messages.NewpasswordReqired')} inputProps={passwordType} rules={{ validate: (value) => passwordValidation(value) }} additionalIcon={additionalicon} />
                                <ResetPasswordAppForm.Input name='PasswordRe' label={t('Pages.PasswordReset.Columns.NewpasswordRe')} required={t('Pages.PasswordReset.Messages.NewpasswordConfirmReqired')} inputProps={passwordType} rules={{ validate: (value) => passwordValidation(value) }} />
                            </Form.Group>
                        </Form>
                    </FormProvider>
                    <FormFooter transparent>
                        <FormButton
                            onClick={() => navigate(Paths.Login)}
                            secondary
                            text={t('Common.Button.Goback')}
                        />
                        <FormButton
                            loading={isLoading}
                            text={t('Common.Button.Update')}
                            onClick={() => submit()}
                        />
                    </FormFooter>
                </Contentwrapper>
            </Pagewrapper>
        </div>
    </Pagewrapper >
}
export default ResetPassword