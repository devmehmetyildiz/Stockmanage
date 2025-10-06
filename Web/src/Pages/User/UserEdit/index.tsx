import { useGetRolesQuery } from '@Api/Role'
import { useEditUserMutation, useLazyGetUserQuery } from '@Api/User'
import { UserEditApiRequest, UserEditRequest } from '@Api/User/type'
import AppTab, { AppTabMenuItem } from '@Components/Common/AppTab'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import UserEditApp from '@Components/User/UserEdit/UserEditApp'
import UserEditKnowledge from '@Components/User/UserEdit/UserEditKnowledge'
import UserEditWorker from '@Components/User/UserEdit/UserEditWorker'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import { SuppressDate } from '@Utils/FormatDate'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useState } from 'react'
import { FormProvider, FormState, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, MenuItem } from 'semantic-ui-react'

const UserAppForm = createAppForm<UserEditRequest>()

const UserEdit: React.FC = () => {

    const { t } = useTranslation()

    const { Id } = useParams()
    const navigate = useNavigate()
    const [appErrorCount, setAppErrorCount] = useState(0)
    const [knowledgeErrorCount, setKnowledgeErrorCount] = useState(0)
    const [workerErrorCount, setWorkerErrorCount] = useState(0)

    const { data: roles, isFetching: isRolesFetching } = useGetRolesQuery({ isActive: 1 })
    const [GetUser, { isFetching }] = useLazyGetUserQuery()
    const [EditUser, { isLoading }] = useEditUserMutation()

    const methods = useForm<UserEditRequest>({
        mode: 'onChange',
        defaultValues: {
            Roles: [],
            Isworker: false,
            Isworking: true,
        },
    })

    const { getValues, formState, trigger, reset, handleSubmit, watch } = methods

    const [Isworker] = watch(['Isworker'])

    //TODO start time bugunden büyük olamaz, end time starttan kücük olamaz start değşirse end sıfırlanmalı

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

            const userForm: UserEditApiRequest = {
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

            EditUser(userForm)
                .unwrap()
                .then(() => {
                    Pushnotification({
                        Type: 'Success',
                        Subject: t('Pages.Users.Page.Header'),
                        Description: t('Pages.Users.Messages.UpdateSuccess')
                    })
                    navigate(Paths.Users)

                })
        }, (errors) => {
            CheckForm({ errors } as FormState<UserEditRequest>, t('Pages.Users.Page.Header'))
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

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetUser({ Uuid: Id })
                .unwrap()
                .then((userData) => {
                    const config = userData?.Config ? JSON.parse(userData?.Config) : null

                    reset({
                        ...userData,
                        Isworker: userData.Isworker ?? false,
                        Isworking: userData.Isworking ?? false,
                        Duration: config?.Duration,
                        Position: config?.Position,
                        Roles: userData.Roleuuids.map(item => item.RoleID),
                        Workstarttime: validator.isISODate(userData.Workstarttime) ? SuppressDate(userData.Workstarttime) : userData.Workstarttime,
                        Workendtime: validator.isISODate(userData.Workendtime) ? SuppressDate(userData.Workendtime) : userData.Workendtime,
                    })
                })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Users.Page.Header'),
                Description: t('Pages.Users.Messages.UndefinedUser')
            })
            navigate(Paths.Users)
        }
    }, [Id, GetUser, navigate, reset, t])

    return <Pagewrapper isLoading={isFetching || isLoading || isRolesFetching} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Users.Page.Header')}
            AdditionalName={t('Pages.Users.Page.EditHeader')}
            PageUrl={Paths.Users}
        />
        <FormProvider<UserEditRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <UserAppForm.Input name='Username' label={t('Pages.Users.Prepare.Label.Username')} required={t('Pages.Users.Messages.UsernameRequired')} inputProps={{ disabled: true }} />
                        <UserAppForm.Input name='Email' label={t('Pages.Users.Prepare.Label.Email')} required={t('Pages.Users.Messages.EmailRequired')} type='email' inputProps={{ disabled: true }} />
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
                                    content: <UserEditApp />
                                }
                            },
                            {
                                menuItem: <MenuItem><AppTabMenuItem errorCount={knowledgeErrorCount}>{t('Pages.Users.Prepare.Tab.KnowledgeHeader')}</AppTabMenuItem></MenuItem>,
                                pane: {
                                    key: "knowledge",
                                    content: <UserEditKnowledge />
                                }
                            },
                            ...(!Isworker ? [] : [{
                                menuItem: <MenuItem><AppTabMenuItem errorCount={workerErrorCount}>{t('Pages.Users.Prepare.Tab.WorkerHeader')}</AppTabMenuItem></MenuItem>,
                                pane: {
                                    key: "worker",
                                    content: <UserEditWorker />
                                },
                            }]),
                        ]}
                    />
                </Form>
            </Contentwrapper>
        </FormProvider>
        <FormFooter>
            <FormButton
                onClick={() => navigate(Paths.Users)}
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
export default UserEdit