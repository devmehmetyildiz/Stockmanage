import { useGetRolesQuery } from '@Api/Role'
import { useAddUserMutation } from '@Api/User'
import { UserAddApiRequest, UserAddRequest } from '@Api/User/type'
import AppTab, { AppTabMenuItem } from '@Components/Common/AppTab'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import UserCreateApp from '@Components/User/UserCreate/UserCreateApp'
import UserCreateKnowledge from '@Components/User/UserCreate/UserCreateKnowledge'
import UserCreateWorker from '@Components/User/UserCreate/UserCreateWorker'
import { EMAIL_REGEX, PASSWORD_REGEX, USERNAME_REGEX } from '@Constant/index'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useState } from 'react'
import { FormProvider, FormState, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form, FormInputProps, Icon, MenuItem, Popup } from 'semantic-ui-react'

//TODO AKTİVASYON BUTONU İLET MAİL ADRESİNE AKTİVE EDİLMİŞ KULLANICI GİRİŞ YAPACAK

const UserAppForm = createAppForm<UserAddRequest>()

const UserCreate: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()
    const [appErrorCount, setAppErrorCount] = useState(0)
    const [knowledgeErrorCount, setKnowledgeErrorCount] = useState(0)
    const [workerErrorCount, setWorkerErrorCount] = useState(0)

    const methods = useForm<UserAddRequest>({
        mode: 'onChange',
        defaultValues: {
            Roles: [],
            Isworker: false,
            Isworking: true,
        }
    })

    const { getValues, handleSubmit, trigger, formState, watch, setValue } = methods

    const { data: roles, isFetching: isRolesFetching } = useGetRolesQuery({ isActive: 1 })
    const [AddUser, { isLoading }] = useAddUserMutation()

    const [Isworker] = watch(['Isworker'])

    const calculateIsworking = (isWorker: boolean, StartTime?: string, Endtime?: string) => {
        if (isWorker && StartTime && validator.isISODate(StartTime)) {
            if (validator.isISODate(Endtime)) {
                return false
            }
            const start = new Date(StartTime)
            const now = new Date()
            return now.getTime() >= start.getTime()
        }
        return false
    }

    const submit = () => {
        const submitFunction = handleSubmit(() => {

            const { Duration, Position, ...rest } = getValues()

            const userForm: UserAddApiRequest = {
                ...rest,
                Isworking: calculateIsworking(rest.Isworker, rest.Workstarttime, rest.Workendtime),
                Config: JSON.stringify({
                    Duration: Duration ?? 0,
                    Position: Position || 'right',
                }),
                Roles: rest.Roles.map(roleID => {
                    return (roles || []).find(role => role.Uuid === roleID)
                }).filter(u => !!u)
            }

            AddUser(userForm)
                .unwrap()
                .then(() => {
                    Pushnotification({
                        Type: 'Success',
                        Subject: t('Pages.Users.Page.Header'),
                        Description: t('Pages.Users.Messages.AddSuccess')
                    })
                    navigate(Paths.Users)
                })
        }, (errors) => {
            CheckForm({ errors } as FormState<UserAddRequest>, t('Pages.Users.Page.Header'))
        })

        submitFunction()
            .catch(() => {
                trigger()
            })
    }

    useEffect(() => {
        let appErrorCount = 0
        if (formState.errors.Roles?.message) {
            appErrorCount++
        }
        if (formState.errors.Language?.message) {
            appErrorCount++
        }
        setAppErrorCount(appErrorCount)

        let knowledgeErrorCount = 0
        if (formState.errors.CountryID?.message) {
            knowledgeErrorCount++
        }
        setKnowledgeErrorCount(knowledgeErrorCount)

        let workerErrorCount = 0
        if (formState.errors.Workstarttime?.message) {
            workerErrorCount++
        }
        setWorkerErrorCount(workerErrorCount)
    })


    const passwordType: FormInputProps = {
        type: 'password'
    }

    const usernameValidation = (value: any) => {
        if (USERNAME_REGEX.test(value)) {
            return true
        } else {
            return t('Pages.Users.Messages.UsernameHint')
        }
    }

    const passwordValidation = (value: any) => {
        if (PASSWORD_REGEX.test(value)) {
            return true
        } else {
            return t('Pages.Users.Messages.PasswordHint')
        }
    }

    const emailValidation = (value: any) => {
        if (EMAIL_REGEX.test(value)) {
            return true
        } else {
            return t('Pages.Users.Messages.EmailHint')
        }
    }

    useEffect(() => {
        if (!Isworker) {
            setValue('Workstarttime', undefined)
        }
    }, [Isworker, setValue])

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

    return <Pagewrapper isLoading={isLoading || isRolesFetching} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Users.Page.Header')}
            AdditionalName={t('Pages.Users.Page.CreateHeader')}
            PageUrl={Paths.Users}
        />
        <FormProvider<UserAddRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <UserAppForm.Input name='Username' label={t('Pages.Users.Prepare.Label.Username')} required={t('Pages.Users.Messages.UsernameRequired')} rules={{ validate: (value) => usernameValidation(value) }} />
                        <UserAppForm.Input name='Email' label={t('Pages.Users.Prepare.Label.Email')} required={t('Pages.Users.Messages.EmailRequired')} type='email' rules={{ validate: (value) => emailValidation(value) }} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <UserAppForm.Input name='Password' label={t('Pages.Users.Prepare.Label.Password')} required={t('Pages.Users.Messages.PasswordRequired')} type='password' rules={{ validate: (value) => passwordValidation(value) }} inputProps={passwordType} additionalIcon={additionalicon} />
                        <UserAppForm.Input name='PasswordRe' label={t('Pages.Users.Prepare.Label.PasswordRe')} required={t('Pages.Users.Messages.PasswordReRequired')} type='password' rules={{ validate: (value) => passwordValidation(value) }} inputProps={passwordType} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <UserAppForm.Input name='Name' label={t('Pages.Users.Prepare.Label.Name')} required={t('Pages.Users.Messages.NameRequired')} />
                        <UserAppForm.Input name='Surname' label={t('Pages.Users.Prepare.Label.Surname')} required={t('Pages.Users.Messages.SurnameRequired')} />
                    </Form.Group>
                    <AppTab
                        renderActiveOnly={false}
                        panes={[
                            {
                                menuItem: <MenuItem><AppTabMenuItem errorCount={appErrorCount}>{t('Pages.Users.Prepare.Tab.AppHeader')}</AppTabMenuItem></MenuItem>,
                                pane: {
                                    key: "app",
                                    content: <UserCreateApp />
                                }
                            },
                            {
                                menuItem: <MenuItem><AppTabMenuItem errorCount={knowledgeErrorCount}>{t('Pages.Users.Prepare.Tab.KnowledgeHeader')}</AppTabMenuItem></MenuItem>,
                                pane: {
                                    key: "knowledge",
                                    content: <UserCreateKnowledge />
                                }
                            },
                            ...(!Isworker ? [] : [{
                                menuItem: <MenuItem><AppTabMenuItem errorCount={workerErrorCount}>{t('Pages.Users.Prepare.Tab.WorkerHeader')}</AppTabMenuItem></MenuItem>,
                                pane: {
                                    key: "worker",
                                    content: <UserCreateWorker />
                                },
                            }]),
                        ]}
                    />
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
export default UserCreate