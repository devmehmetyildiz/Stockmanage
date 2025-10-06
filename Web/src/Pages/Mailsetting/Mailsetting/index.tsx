import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import privileges from '@Constant/privileges'
import { CellContext } from '@tanstack/react-table'
import { FormatFullDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { MailsettingItem } from '@Api/Mailsetting/type'
import { useGetMailsettingsQuery } from '@Api/Mailsetting'
import MailsettingDeleteModal from '@Components/Mailsetting/MailsettingDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, EditCellHandler } from '@Components/Common/CellHandler'

const Mailsetting: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<MailsettingItem | null>(null)

    const { data, isFetching } = useGetMailsettingsQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'mailsetting' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as MailsettingItem

        return <EditCellHandler url={`/${RouteKeys.Mailsettings}/${data.Uuid}/edit`} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as MailsettingItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const boolCellhandler = (value: any) => {
        return value !== null && (value === 1 ? t('Common.Yes') : t('Common.No'))
    }

    const columns: ColumnType<MailsettingItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Mailsettings.Columns.Name'), accessorKey: 'Name', isMobile: true },
        { header: t('Pages.Mailsettings.Columns.User'), accessorKey: 'User' },
        { header: t('Pages.Mailsettings.Columns.Smtphost'), accessorKey: 'Smtphost' },
        { header: t('Pages.Mailsettings.Columns.Smtpport'), accessorKey: 'Smtpport' },
        { header: t('Pages.Mailsettings.Columns.Mailaddress'), accessorKey: 'Mailaddress' },
        { header: t('Pages.Mailsettings.Columns.Isbodyhtml'), accessorFn: row => boolCellhandler(row?.Isbodyhtml) },
        { header: t('Pages.Mailsettings.Columns.Issettingactive'), accessorFn: row => boolCellhandler(row.Issettingactive) },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.mailsettingupdate, cell: (wrapper) => editCellhandler(wrapper), size: 70 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.mailsettingdelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 }
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    return <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Mailsettings.Page.Header')}
                PageUrl={Paths.Mailsettings}
                excelExportName={t('Pages.Mailsettings.Page.Header')}
                create={{
                    Pagecreateheader: t('Pages.Mailsettings.Page.CreateHeader'),
                    Pagecreatelink: Paths.MailsettingsCreate
                }}
            />
            <DataTable
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
        <MailsettingDeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            data={record}
            setData={setRecord}
        />
    </Pagewrapper>
}
export default Mailsetting