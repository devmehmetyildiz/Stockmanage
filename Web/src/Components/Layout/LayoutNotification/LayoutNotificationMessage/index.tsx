import React, { useState } from 'react'
import { UserNotificationItem } from '@Api/Usernotification/type'
import { AnimatePresence, motion } from 'framer-motion'
import { Confirm, Dimmer, DimmerDimmable, Icon, Loader } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { FormatFullDate } from '@Utils/FormatDate'
import { useDeleteNotificationMutation } from '@Api/Usernotification'

interface LayoutNotificationMessageProps {
    message: UserNotificationItem
    setOpenView: React.Dispatch<React.SetStateAction<boolean>>
    setRecord: React.Dispatch<React.SetStateAction<UserNotificationItem | null>>
}

const LayoutNotificationMessage: React.FC<LayoutNotificationMessageProps> = ({ message, setOpenView, setRecord }) => {

    const [confirmopen, setConfirmopen] = useState(false)

    const { t } = useTranslation()

    const [DeleteNotification, { isLoading }] = useDeleteNotificationMutation()

    const onConfirm = () => {
        DeleteNotification({
            notificationId: message.Uuid
        }).then(() => {
            setRecord(null)
            setOpenView(false)
        })
        setConfirmopen(false)
    }

    const onCancel = () => {
        setConfirmopen(false)
    }

    return <DimmerDimmable dimmed >
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className='w-full flex justify-center items-center'
            >
                <Dimmer  inverted active={isLoading}>
                    <Loader  inverted/>
                </Dimmer>
                <div className='cursor-pointer w-[300px] flex flex-row items-center justify-between shadow-md h-16  m-4 p-2 rounded-lg shadow-[#DDDD] border-[#DDDD] hover:border-[#2355a0] border-[1px]  transition-all ease-in-out duration-300  border-b-[#2355a0] border-b-4 hover:border-b-4'>
                    <div className='flex flex-row justify-center items-center'
                        onClick={() => {
                            setOpenView(true)
                            setRecord(message)
                        }}>
                        {message?.Isreaded
                            ? <Icon name='checkmark' className='text-[#2355a0]' />
                            : <Icon name='attention' className='text-[#2355a0]' />
                        }
                        <div className=' text-left flex flex-col justify-start items-start'>
                            <div className='font-bold'>{message?.Subject}</div>
                            <div className='text-[#868686dd] text-sm'>{FormatFullDate(message?.Createtime)}</div>
                        </div>
                    </div>
                    <div className='flex flex-row justify-center items-center'>
                        <div onClick={() => {
                            setConfirmopen(true)
                        }}>
                            <Icon name='delete' className='text-[#2355a0]' />
                        </div>
                    </div>
                </div>
                <Confirm
                    open={confirmopen}
                    content={t('Pages.Usernotifications.Columns.DeleteNotificationContent')}
                    header={t('Pages.Usernotifications.Columns.DeleteNotificationHeader')}
                    cancelButton={t('Common.Button.Cancel')}
                    confirmButton={t('Common.Button.Delete')}
                    onCancel={() => { onCancel() }}
                    onConfirm={() => { onConfirm() }}
                />
            </motion.div>
        </AnimatePresence>
    </DimmerDimmable>
}
export default LayoutNotificationMessage