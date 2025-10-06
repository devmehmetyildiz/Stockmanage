import { useEditRoleMutation, useGetPrivilegeDefinesQuery, useGetPrivilegeGroupDefinesQuery, useLazyGetRoleQuery } from '@Api/Role'
import { RoleEditRequestForm } from '@Api/Role/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import useMobile from '@Hooks/useMobile'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useState, useTransition } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Checkbox, Divider, Form, Search } from 'semantic-ui-react'

const RoleAppForm = createAppForm<RoleEditRequestForm>()

const RoleEdit: React.FC = () => {

    const { t, i18n } = useTranslation()
    const currentLanguage = i18n.language as 'tr' | 'en'

    const { Id } = useParams()
    const navigate = useNavigate()
    const [isPending, startTransition] = useTransition();
    const [searchParam, setSearchParam] = useState<string>('')
    const { isTablet } = useMobile()

    const [GetRole, { isFetching }] = useLazyGetRoleQuery()
    const [EditRole, { isLoading }] = useEditRoleMutation()
    const { data: privileges } = useGetPrivilegeDefinesQuery()
    const { data: privilegegroups } = useGetPrivilegeGroupDefinesQuery()

    const methods = useForm<RoleEditRequestForm>({
        mode: 'onChange',
        defaultValues: {
            Name: '',
            Privileges: []
        },
    })

    const { getValues, formState, trigger, reset, watch, setValue, setError } = methods

    const [selectedPrivileges] = watch(['Privileges'])

    const privilegeGroups = (privilegegroups || [])

    const decoratedGroups = privilegeGroups.map(group => {
        const foundedPrivileges = (privileges || []).filter(u => u.group[currentLanguage] === group[currentLanguage] && (u.text[currentLanguage].toLowerCase()).includes(searchParam.toLowerCase()))
        return foundedPrivileges.length > 0 ? { name: group[currentLanguage], privileges: foundedPrivileges } : null
    }).filter(u => u)

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const rawBody = getValues()

                EditRole({
                    ...rawBody,
                    Privileges: rawBody.Privileges.map(u => u.code)
                })
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Roles.Page.Header'),
                            Description: t('Pages.Roles.Messages.UpdateSuccess')
                        })
                        navigate(Paths.Roles)
                    })
            } else {
                CheckForm(formState, t('Pages.Roles.Page.Header'))
            }
        })
    }

    const addAll = () => {
        startTransition(() => {
            const basePrivileges = (privileges || [])
            if (selectedPrivileges.length === basePrivileges.length) {
                setValue('Privileges', [])
            } else {
                setValue('Privileges', [...basePrivileges])
            }
        })
    }

    useEffect(() => {
        if (selectedPrivileges.length > 0 && formState.errors.Privileges?.message) {
            setError('Privileges', { message: undefined })
        } else if (selectedPrivileges.length === 0 && !formState.errors.Privileges?.message) {
            setError('Privileges', { message: t('Pages.Roles.Messages.PrivilegesRequired') })
        }
    }, [formState.errors, setError, selectedPrivileges])

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetRole({ Uuid: Id })
                .unwrap()
                .then((data) => {
                    reset({
                        Uuid: data.Uuid,
                        Name: data.Name,
                        Privileges: data.Privileges
                    })
                })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Roles.Page.Header'),
                Description: t('Pages.Roles.Messages.UndefinedRole')
            })
            navigate(Paths.Roles)
        }
    }, [Id, GetRole, navigate, reset, t])

    return <Pagewrapper isLoading={isFetching || isLoading || isPending} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Roles.Page.Header')}
            AdditionalName={t('Pages.Roles.Page.EditHeader')}
            PageUrl={Paths.Roles}
            additionalButtons={[
                {
                    onClick: () => addAll(),
                    name: t('Pages.Roles.Columns.AddAll')
                }
            ]}
        />
        <FormProvider<RoleEditRequestForm> {...methods}>
            <Contentwrapper >
                <Form>
                    <RoleAppForm.Input name='Name' label={t('Pages.Roles.Columns.Name')} required={t('Pages.Roles.Messages.NameRequired')} />
                    <Divider />
                    <Form.Field>
                        <label className=''>{t('Components.LayoutNaviationSearch.Placeholder')}</label>
                        <Search
                            placeholder={t('Components.LayoutNaviationSearch.Placeholder')}
                            onSearchChange={(_, data) => { setSearchParam(data.value ?? '') }}
                            showNoResults={false}
                        />
                    </Form.Field>
                    <Divider />
                    <div className='w-full h-[calc(100vh-500px)] overflow-y-auto'>
                        {decoratedGroups.map((group, index) => {
                            const isGroupChecked = selectedPrivileges.filter(u => u.group[currentLanguage] === group?.name).length === privileges?.filter(u => u.group[currentLanguage] === group?.name).length
                            const groupName = group?.name ?? ''

                            return <div key={index} className="mb-8">
                                <div className='flex flex-row justify-start items-center'>
                                    <label className='text-[#000000de] font-bold'>{group?.name}</label>
                                    <Checkbox toggle className='ml-4'
                                        onClick={() => {
                                            setValue('Privileges',
                                                isGroupChecked
                                                    ? selectedPrivileges.filter(u => u.group[currentLanguage] !== groupName)
                                                    : [
                                                        ...selectedPrivileges.filter(u => u.group[currentLanguage] !== groupName),
                                                        ...(privileges || []).filter(u => u.group[currentLanguage] === groupName)
                                                    ]
                                            )
                                        }}
                                        id={groupName}
                                        checked={isGroupChecked}
                                    />
                                </div>
                                <Divider className='w-full  h-[1px]' />
                                <div className={`grid ${isTablet ? 'grid-cols-1' : 'lg:grid-cols-3 md:grid-cols-2 '} gap-2`}>
                                    {(group?.privileges || []).map((privilege, index) => {
                                        const isChecked = (selectedPrivileges.length > 0 ? selectedPrivileges : []).find(u => u.code === privilege.code) ? true : false
                                        return <Checkbox toggle className='m-2'
                                            checked={isChecked}
                                            onClick={() => {
                                                setValue('Privileges',
                                                    isChecked
                                                        ? selectedPrivileges.filter(u => u.code !== privilege.code)
                                                        : [...selectedPrivileges, privilege]
                                                )
                                            }}
                                            id={privilege.code}
                                            key={index}
                                            label={privilege.text[currentLanguage]} />
                                    })}
                                </div>
                            </div>
                        })}
                    </div>
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
export default RoleEdit