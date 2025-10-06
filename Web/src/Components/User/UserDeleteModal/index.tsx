import { useDeleteUserMutation } from '@Api/User'
import { UserItem, UserListItem } from '@Api/User/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface UserDeleteModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: UserItem | UserListItem | null
    setData: React.Dispatch<React.SetStateAction<UserItem | UserListItem | null>>
}

const UserDeleteModal: React.FC<UserDeleteModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [DeleteUser, { isLoading }] = useDeleteUserMutation()

    const userName = `${data?.Name} ${data?.Surname}`

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.Users.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.dataClear} wrapped />
            <Modal.Description>
                <Header>{userName}</Header>
                <p>
                    {userName} {t('Pages.Users.Delete.Label.DeleteCheck')}
                </p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Delete')} onClick={() => {
                if (data?.Uuid) {
                    DeleteUser({ Uuid: data?.Uuid })
                        .unwrap()
                        .then(() => {
                            setData(null)
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Users.Page.Header'),
                                Description: t('Pages.Users.Messages.DeleteSuccess')
                            })
                        })
                }
            }} />
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default UserDeleteModal