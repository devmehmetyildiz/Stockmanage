import React, { useEffect } from 'react'
import { UserEditRequest } from '@Api/User/type'
import { createAppForm } from '@Utils/CreateAppForm'
import { useTranslation } from 'react-i18next'
import { DropdownItemProps, Form } from 'semantic-ui-react'
import { useGetRolesQuery } from '@Api/Role'
import { getSidebarRoutes } from '@Components/Layout/LayoutSidebar'
import { useGetPrivilegesQuery } from '@Api/Profile'

const UserAppForm = createAppForm<UserEditRequest>()

const UserEditApp: React.FC = () => {

    const { t } = useTranslation()

    const { data: roles, isFetching: isRolesFetching } = useGetRolesQuery({ isActive: 1 })
    const { data: privileges, isFetching: isPrivilegesFetching } = useGetPrivilegesQuery()


    const userPrivileges = privileges || [] as string[]

    const pages = getSidebarRoutes(t, userPrivileges)

    const sidebarRoutes = pages.flatMap(section => {
        return section.items.filter(u => u.permission)
    })

    const PageOption: DropdownItemProps[] = sidebarRoutes.map(item => {
        return { text: item.subtitle, value: item.url }
    })

    const LanguageOptions: DropdownItemProps[] = [
        { text: 'EN', value: 'en' },
        { text: 'TR', value: 'tr' },
    ]

    const RoleOption: DropdownItemProps[] = (roles || []).map(item => {
        return { text: item.Name, value: item.Uuid }
    })

    const Notificaitonoptions = [
        { key: 1, text: t('Option.NotificationPosition.Left'), value: 'left' },
        { key: 2, text: t('Option.NotificationPosition.Mid'), value: 'center' },
        { key: 3, text: t('Option.NotificationPosition.Right'), value: 'right' },
    ]

    return <React.Fragment>
        <Form.Group widths={'equal'}>
            <UserAppForm.Select name='Roles' label={t('Pages.Users.Prepare.Label.Roles')} multiple required={t('Pages.Users.Messages.RolesRequired')} options={RoleOption} loading={isRolesFetching || isPrivilegesFetching} />
            <UserAppForm.Select name='Language' label={t('Pages.Users.Prepare.Label.Language')} required={t('Pages.Users.Messages.LanguageRequired')} options={LanguageOptions} />
        </Form.Group>
        <Form.Group widths={'equal'}>
            <UserAppForm.Select name='Defaultpage' label={t('Pages.Users.Prepare.Label.Defaultpage')} options={PageOption} />
            <UserAppForm.Checkbox name='Isworker' label={t('Pages.Users.Prepare.Label.Isworker')} />
        </Form.Group>
        <Form.Group widths={'equal'}>
            <UserAppForm.Select name='Position' label={t('Pages.Users.Prepare.Label.Position')} options={Notificaitonoptions} />
            <UserAppForm.Input name='Duration' label={t('Pages.Users.Prepare.Label.Duration')} type='number' inputProps={{ min: 0, max: 9999 }} />
        </Form.Group>
    </React.Fragment>
}
export default UserEditApp