import useLayout from '@Hooks/useLayout'
import React, { useEffect, useState } from 'react'
import { Confirm, Dimmer, DimmerDimmable, Divider, Dropdown, Loader, Menu, Sidebar } from 'semantic-ui-react'
import styles from './style.module.scss'
import { useDeleteAllNotificationMutation, useDeleteReadNotificationMutation, useLazyGetLastUserNotificationsByUuidQuery, useShowAllNotificationsMutation } from '@Api/Usernotification'
import { useGetMetaQuery } from '@Api/Profile'
import { useTranslation } from 'react-i18next'
import Title from '@Components/Common/Title'
import NotfoundScreen from '@Components/Common/NotfoundScreen'
import LayoutNotificationMessage from './LayoutNotificationMessage'
import FormButton from '@Components/Common/FormButton'
import { UserNotificationItem } from '@Api/Usernotification/type'
import LayoutNotificationDetail from './LayoutNotificationDetail'
import { useNavigate } from 'react-router-dom'
import Paths from '@Constant/path'
import validator from '@Utils/Validator'
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

const LayoutNotification: React.FC = () => {

    const { isNotificationSidebarOpen, changeNotificationSidebar } = useLayout()

    const navigate = useNavigate()
    const { t } = useTranslation()
    const [deleteAllOpen, setDeleteAllOpen] = useState(false)
    const [deleteReadOpen, setDeleteReadOpen] = useState(false)
    const [maxHeight, setMaxHeight] = useState<string | number>('70vh');
    const [openView, setOpenView] = useState(false)
    const [record, setRecord] = useState<UserNotificationItem | null>(null)

    const [GetNotifications, { isLoading, data, reset }] = useLazyGetLastUserNotificationsByUuidQuery()
    const [DeleteAllNotification, { isLoading: DeleteAllLoading }] = useDeleteAllNotificationMutation()
    const [DeleteReadNotification, { isLoading: DeleteReadLoading }] = useDeleteReadNotificationMutation()
    const [ShowAllNotification] = useShowAllNotificationsMutation()

    const { data: meta } = useGetMetaQuery()

    useEffect(() => {
        if (isNotificationSidebarOpen && meta?.Uuid) {
            GetNotifications({ userId: meta.Uuid })
        }
    }, [GetNotifications, isNotificationSidebarOpen, meta])

    useEffect(() => {
        if (!isNotificationSidebarOpen) {
            reset()
        }
    }, [reset, isNotificationSidebarOpen])

    useEffect(() => {
        if (isNotificationSidebarOpen && (data || []).filter(u => !u.Isshowed && u.Isactive).length > 0 && meta?.Uuid && validator.isUUID(meta?.Uuid)) {
            ShowAllNotification({
                userId: meta?.Uuid
            })
        }
    }, [data, isNotificationSidebarOpen, meta, ShowAllNotification])

    useEffect(() => {
        const updateHeight = () => {
            const height = window.innerHeight;
            if (height < 400) {
                setMaxHeight(height * 0.40);
            } else if (height < 434) {
                setMaxHeight(height * 0.45);
            } else if (height < 500) {
                setMaxHeight(height * 0.50);
            } else if (height < 575) {
                setMaxHeight(height * 0.57);
            } else if (height < 642) {
                setMaxHeight(height * 0.62);
            } else if (height < 713) {
                setMaxHeight(height * 0.65);
            } else if (height < 836) {
                setMaxHeight(height * 0.67);
            } else if (height < 920) {
                setMaxHeight(height * 0.7);
            } else if (height < 1000) {
                setMaxHeight(height * 0.72);
            } else if (height < 1050) {
                setMaxHeight(height * 0.74);
            } else if (height < 1300) {
                setMaxHeight(height * 0.76);
            } else if (height < 1400) {
                setMaxHeight(height * 0.77);
            } else if (height < 1500) {
                setMaxHeight(height * 0.78);
            } else if (height < 1600) {
                setMaxHeight(height * 0.79);
            } else if (height < 1700) {
                setMaxHeight(height * 0.8);
            } else if (height < 1800) {
                setMaxHeight(height * 0.81);
            } else if (height < 1900) {
                setMaxHeight(height * 0.82);
            } else {
                setMaxHeight('75vh');
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    return <React.Fragment>
        <Sidebar
            className={`${styles.notificationContainer} notificationContainer`}
            as={Menu}
            animation={'overlay'}
            icon='labeled'
            vertical
            direction='right'
            visible={isNotificationSidebarOpen}
            width='wide'
        >
            <DimmerDimmable>
                <div className='w-full h-full min-h-screen overflow-x-hidden'>
                    <Dimmer active={isLoading || DeleteAllLoading || DeleteReadLoading} inverted>
                        <Loader active />
                    </Dimmer>
                    <Title
                        PageName={t('Pages.Usernotifications.Page.Header')}
                        additionalButtons={[
                            {
                                onClick: () => changeNotificationSidebar(false),
                                iconOnly: true,
                                icon: 'sign-out'
                            },
                        ]}
                        additionalButtonNoWrap
                    />
                    {data && data.length > 0
                        ? <div>
                            <List
                                height={typeof maxHeight === "string" ? 500 : Number(maxHeight)}
                                itemCount={data.length}
                                itemSize={70}
                                width="100%"
                                style={{ overflowX: "hidden" }}
                            >
                                {({ index, style }: ListChildComponentProps) => {
                                    const message = data[index];
                                    return (
                                        <div style={style}>
                                            <LayoutNotificationMessage
                                                key={index}
                                                message={message}
                                                setOpenView={setOpenView}
                                                setRecord={setRecord}
                                            />
                                        </div>
                                    );
                                }}
                            </List>
                            <Divider />
                            <div className='w-full flex flex-row justify-center items-center gap-2'>
                                <Dropdown
                                    text={t('Pages.Usernotifications.Columns.Process')}
                                    icon='filter'
                                    floating
                                    labeled
                                    button
                                    className='icon !bg-[#2355a0] !text-white'
                                >
                                    <Dropdown.Menu>
                                        <Dropdown.Header icon='tags' content={t('Pages.Usernotifications.Columns.Processdetail')} />
                                        <Dropdown.Item onClick={() => setDeleteAllOpen(true)}>
                                            {t('Pages.Usernotifications.Columns.DeleteAllNotification')}
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => setDeleteReadOpen(true)}>
                                            {t('Pages.Usernotifications.Columns.DeleteReadedNotification')}
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                <FormButton
                                    onClick={() => {
                                        navigate(Paths.UserNotifications)
                                        changeNotificationSidebar(false)
                                    }}
                                    text={t('Pages.Usernotifications.Columns.AllNotification')}
                                />
                            </div>
                        </div>
                        : <NotfoundScreen />
                    }
                </div>
            </DimmerDimmable>
        </Sidebar>
        <Confirm
            open={deleteAllOpen}
            content={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteAllContent')}
            header={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteHeader')}
            cancelButton={t('Common.Button.Cancel')}
            confirmButton={t('Common.Button.Delete')}
            onCancel={() => { setDeleteAllOpen(false) }}
            onConfirm={() => {
                if (meta?.Uuid && validator.isUUID(meta?.Uuid)) {
                    setDeleteAllOpen(false)
                    DeleteAllNotification({
                        userId: meta.Uuid
                    })
                }
            }}
        />
        <Confirm
            open={deleteReadOpen}
            content={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteReadedContent')}
            header={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteHeader')}
            cancelButton={t('Common.Button.Cancel')}
            confirmButton={t('Common.Button.Delete')}
            onCancel={() => { setDeleteReadOpen(false) }}
            onConfirm={() => {
                if (meta?.Uuid && validator.isUUID(meta?.Uuid)) {
                    setDeleteReadOpen(false)
                    DeleteReadNotification({
                        userId: meta.Uuid
                    })
                }
            }}
        />
        <LayoutNotificationDetail
            open={openView}
            setOpen={setOpenView}
            record={record}
            setRecord={setRecord}
        />
    </React.Fragment>
}
export default LayoutNotification