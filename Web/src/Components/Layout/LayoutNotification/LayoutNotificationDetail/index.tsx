import { useEditUserNotificationMutation } from '@Api/Usernotification'
import { UserNotificationItem } from '@Api/Usernotification/type'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import useLayout from '@Hooks/useLayout'
import { FormatFullDate } from '@Utils/FormatDate'
import validator from '@Utils/Validator'
import React, { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Label, Modal } from 'semantic-ui-react'

interface LayoutNotificationDetailProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    record: UserNotificationItem | null
    setRecord: React.Dispatch<React.SetStateAction<UserNotificationItem | null>>
}

const LayoutNotificationDetail: React.FC<LayoutNotificationDetailProps> = (props) => {

    const { open, setOpen, record, setRecord } = props
    const { t } = useTranslation()
    const { changeNotificationSidebar } = useLayout()
    const navigate = useNavigate()

    const [EditNotifications] = useEditUserNotificationMutation()

    const notification = useMemo(() => record || {} as UserNotificationItem, [record])

    const onClose = () => {
        setRecord(null)
        setOpen(false)
    }

    useEffect(() => {
        if (open && notification && EditNotifications) {
            if (!notification?.Isreaded) {
                EditNotifications(
                    [{
                        Uuid: notification?.Uuid,
                        Readtime: new Date(),
                        Isreaded: true
                    }])
            }
        }
    }, [open, EditNotifications, notification])

    return <AppModal
        onClose={() => onClose()}
        onOpen={() => setOpen(true)}
        open={open}
    >
        <Modal.Header>{`${t('Pages.Usernotifications.Page.Header')}`}</Modal.Header>
        <Modal.Content image>
            <Modal.Description>
                <div className='w-full justify-start items-start flex flex-col gap-6'>
                    <div className='font-bold w-full flex justify-between items-center'>
                        <div>
                            {notification.Subject}
                        </div>
                        <div className='flex flex-col justify-end items-end gap-2'>
                            {notification.Createtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>{`${t('Pages.Usernotifications.UsernotificationsNotificationView.Creattime')} :  `}<Label.Detail>{FormatFullDate(notification.Createtime)}</Label.Detail></Label>}
                            {notification.Showedtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>{`${t('Pages.Usernotifications.UsernotificationsNotificationView.Showtime')} :  `}<Label.Detail>{FormatFullDate(notification.Showedtime)}</Label.Detail></Label>}
                            {notification.Readtime && <Label as='a' className='!bg-[#2355a0] !text-white' image>{`${t('Pages.Usernotifications.UsernotificationsNotificationView.Readtime')} :  `}<Label.Detail>{FormatFullDate(notification.Readtime)}</Label.Detail></Label>}
                        </div>
                    </div>
                    <div>
                        {notification.Message}
                    </div>
                </div>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            {validator.isString(notification?.Pushurl) && history &&
                <FormButton
                    text={t('Common.Button.GoToDetail')}
                    onClick={() => {
                        navigate(notification.Pushurl)
                        onClose()
                        changeNotificationSidebar(false)
                    }}
                />
            }
            <FormButton
                text={t('Common.Button.Giveup')}
                secondary
                onClick={() => onClose()}
            />
        </Modal.Actions>
    </AppModal>
}
export default LayoutNotificationDetail