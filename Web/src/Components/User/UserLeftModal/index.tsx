import { useRemoveUserMutation } from '@Api/User'
import { UserItem, UserListItem, UserRemoveRequest } from '@Api/User/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Image, Modal } from 'semantic-ui-react'

interface UserLeftModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: UserItem | UserListItem | null
    setData: React.Dispatch<React.SetStateAction<UserItem | UserListItem | null>>
}

const UserAppForm = createAppForm<UserRemoveRequest>()

const UserLeftModal: React.FC<UserLeftModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [RemoveUser, { isLoading }] = useRemoveUserMutation()

    const userName = `${data?.Name} ${data?.Surname}`

    const methods = useForm<UserRemoveRequest>({
        mode: 'onChange',
        defaultValues: {
            Leftinfo: '',
            Uuid: data?.Uuid,
        }
    })

    const { getValues, formState, trigger, reset } = methods

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                RemoveUser(getValues())
                    .unwrap()
                    .then(() => {
                        setData(null)
                        setOpen(false)
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Users.Page.Header'),
                            Description: t('Pages.Users.Messages.RemoveSuccess')
                        })
                    })
            } else {
                CheckForm(formState, t('Pages.Users.Page.Header'))
            }
        })
    }

    useEffect(() => {
        if (open && data) {
            reset({
                Leftinfo: '',
                Uuid: data.Uuid,
                Workendtime: undefined
            })
        }
    }, [reset, data, open])

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{`${t('Pages.Users.Page.RemoveHeader')} - ${userName}`}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.dataClear} wrapped />
            <Modal.Description className='!w-full'>
                <FormProvider<UserRemoveRequest> {...methods}>
                    <Contentwrapper>
                        <Form>
                            <Form.Group widths={'equal'}>
                                <UserAppForm.Input name='Workendtime' label={t('Pages.Users.Columns.Workendtime')} required={t('Pages.Users.Messages.WorkstartendRequired')} type='datetime-local' />
                            </Form.Group>
                            <Form.Group widths={'equal'}>
                                <UserAppForm.Input name='Leftinfo' label={t('Pages.Users.Columns.Leftinfo')} />
                            </Form.Group>
                        </Form>
                    </Contentwrapper>
                </FormProvider>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.RemoveWork')} onClick={() => submit()} />
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default UserLeftModal