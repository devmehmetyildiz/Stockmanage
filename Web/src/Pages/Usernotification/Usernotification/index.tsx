import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import { CellContext } from '@tanstack/react-table'
import { FormatFullDate } from '@Utils/FormatDate'
import { useGetMetaQuery, useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { DetailModalCellHandler, } from '@Components/Common/CellHandler'
import { useDeleteAllNotificationMutation, useDeleteReadNotificationMutation, useGetUserNotificationsQuery, useShowAllNotificationsMutation } from '@Api/Usernotification'
import { ProfileMetaResponse } from '@Api/Profile/type'
import validator from '@Utils/Validator'
import { UserNotificationItem } from '@Api/Usernotification/type'
import privileges from '@Constant/privileges'
import { Confirm } from 'semantic-ui-react'
import LayoutNotificationDetail from '@Components/Layout/LayoutNotification/LayoutNotificationDetail'

const Usernotification: React.FC = () => {

    const { t } = useTranslation()

    const [openView, setOpenView] = useState(false)
    const [deleteAllOpen, setDeleteAllOpen] = useState(false)
    const [deleteReadOpen, setDeleteReadOpen] = useState(false)
    const [record, setRecord] = useState<UserNotificationItem | null>(null)


    const { data: meta } = useGetMetaQuery()

    const { Username, Uuid } = meta || {} as ProfileMetaResponse

    const [DeleteAllNotification, { isLoading: DeleteAllLoading }] = useDeleteAllNotificationMutation()
    const [DeleteReadNotification, { isLoading: DeleteReadLoading }] = useDeleteReadNotificationMutation()
    const [ShowAllNotification] = useShowAllNotificationsMutation()
    const { data, isFetching, isSuccess } = useGetUserNotificationsQuery({ isActive: 1, UserID: Uuid }, { skip: !validator.isUUID(Uuid) })

    const TableQuery = useGetTableMetaQuery({ Key: 'usernotification' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const viewCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as UserNotificationItem

        return <DetailModalCellHandler onClick={() => {
            setRecord(data)
            setOpenView(true)
        }} />
    }

    const columns: ColumnType<UserNotificationItem>[] = [
        { header: t('Common.Columns.Id'), accessorKey: 'Id', isIcon: true },
        { header: t('Common.Columns.Uuid'), accessorKey: 'Uuid' },
        { header: t('Pages.Usernotifications.Columns.Notificationtime'), accessorFn: row => dateCellhandler(row?.Notificationtime), isMobile: true },
        { header: t('Pages.Usernotifications.Columns.Subject'), accessorKey: 'Subject', isMobile: true },
        { header: t('Pages.Usernotifications.Columns.Message'), accessorKey: 'Message', },
        { header: t('Pages.Usernotifications.Columns.Showedtime'), accessorFn: row => dateCellhandler(row?.Showedtime), },
        { header: t('Pages.Usernotifications.Columns.Readtime'), accessorFn: row => dateCellhandler(row?.Readtime), },
        { header: t('Common.Columns.Createduser'), accessorKey: 'Createduser' },
        { header: t('Common.Columns.Updateduser'), accessorKey: 'Updateduser' },
        { header: t('Common.Columns.Createtime'), accessorKey: 'Createtime' },
        { header: t('Common.Columns.Updatetime'), accessorKey: 'Updatetime' },
        { header: t('Common.Columns.view'), accessorKey: 'view', isIcon: true, role: privileges.basic, cell: (wrapper) => viewCellhandler(wrapper), size: 70 },
    ]

    useEffect(() => {
        if (isSuccess && validator.isUUID(Uuid) && data && data.filter(u => u.Isshowed).length > 0) {
            ShowAllNotification({
                userId: Uuid
            })
        }
    }, [isSuccess, data, ShowAllNotification, Uuid])

    return <Pagewrapper isLoading={isFetching || DeleteAllLoading || DeleteReadLoading} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Usernotifications.Page.Header')}
                AdditionalName={Username}
                PageUrl={Paths.UserNotifications}
                excelExportName={t('Pages.Usernotifications.Page.Header')}
                additionalButtons={[
                    {
                        onClick: () => setDeleteAllOpen(true),
                        name: t('Pages.Usernotifications.Columns.DeleteAllNotification')
                    },
                    {
                        onClick: () => setDeleteReadOpen(true),
                        name: t('Pages.Usernotifications.Columns.DeleteReadedNotification')
                    }
                ]}
            />
            <DataTable
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
        <LayoutNotificationDetail
            open={openView}
            setOpen={setOpenView}
            record={record}
            setRecord={setRecord}
        />
        <Confirm
            open={deleteAllOpen}
            content={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteAllContent')}
            header={t('Pages.Usernotifications.UsernotificationsNotificationView.DeleteHeader')}
            cancelButton={t('Common.Button.Cancel')}
            confirmButton={t('Common.Button.Delete')}
            onCancel={() => { setDeleteAllOpen(false) }}
            onConfirm={() => {
                if (meta?.Uuid && validator.isUUID(meta?.Uuid)) {
                    DeleteAllNotification({
                        userId: meta.Uuid
                    })
                        .unwrap().then(() => {
                            setDeleteAllOpen(false)
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
                    DeleteReadNotification({
                        userId: meta.Uuid
                    })
                        .unwrap()
                        .then(() => {
                            setDeleteReadOpen(false)
                        })
                }
            }}
        />
    </Pagewrapper>
}
export default Usernotification