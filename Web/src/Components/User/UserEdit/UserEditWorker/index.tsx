import { UserEditRequest } from '@Api/User/type'
import { createAppForm } from '@Utils/CreateAppForm'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'semantic-ui-react'

const UserAppForm = createAppForm<UserEditRequest>()

const UserEditWorker: React.FC = () => {

    const { t } = useTranslation()

    const { watch } = useFormContext<UserEditRequest>()

    const [IsworkerForm] = watch(['Isworker'])

    const Isworker = IsworkerForm ? true : false

    return <React.Fragment>
        <Form.Group widths={'equal'}>
            <UserAppForm.Input name='Workstarttime' label={t('Pages.Users.Prepare.Label.Workstarttime')} type='date' required={Isworker ? t('Pages.Users.Messages.WorkstarttimeRequired') : undefined} />
        </Form.Group>
    </React.Fragment>
}
export default UserEditWorker