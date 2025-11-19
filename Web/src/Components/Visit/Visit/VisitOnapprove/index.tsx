import React, { useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import { FormatDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { VisitListItem } from '@Api/Visit/type'
import { useGetVisitsQuery } from '@Api/Visit'
import { VISIT_STATU_ON_APPROVE } from '@Constant/index'
import { useGetUsersListQuery } from '@Api/User'
import privileges from '@Constant/privileges'
import { DeleteCellHandler, DetailCellHandler, WorkCellhandler } from '@Components/Common/CellHandler'
import { CellContext } from '@tanstack/react-table'
import VisitWorkModal from '@Components/Visit/VisitWorkModal'
import VisitDeleteModal from '@Components/Visit/VisitDeleteModal'
import { loaderCellhandler } from '@Utils/CellHandler'
import RouteKeys from '@Constant/routeKeys'
import useHasPrivileges from '@Hooks/useHasPrivileges'

const VisitOnapprove: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [workOpen, setWorkOpen] = useState(false)
    const [record, setRecord] = useState<VisitListItem | null>(null)
    const { isHasPrivilege, isMetaLoading, isSuccess, UserID } = useHasPrivileges(privileges.visitmanageall)

    const { data, isFetching } = useGetVisitsQuery({ Status: VISIT_STATU_ON_APPROVE, UserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'visitonapprove' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatDate(value)
    }

    const userCellhandler = (value: string) => {
        const user = (users || []).find(u => u.Uuid === value)
        return user ? `${user.Name} ${user.Surname}` : value
    }

    const boolCellhandler = (value: boolean) => {
        return value ? t('Pages.Visits.Messages.Approved') : t('Pages.Visits.Messages.NotApproved')
    }

    const workCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <WorkCellhandler disabled={!data.Isapproved} onClick={() => {
            setRecord(data)
            setWorkOpen(true)
        }} />
    }

    const detailCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <DetailCellHandler url={`/${RouteKeys.Visits}/${data.Uuid}/Detail`} />
    }


    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <DeleteCellHandler disabled={!data.Isapproved} onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const columns: ColumnType<VisitListItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Visits.Columns.Visitcode'), accessorKey: 'Visitcode', isMobile: true },
        { header: t("Pages.Visits.Columns.Visitdate"), accessorKey: 'Visitdate', accessorFn: row => dateCellhandler(row.Visitdate) },
        { header: t("Pages.Visits.Columns.Isapproved"), accessorKey: 'Isapproved', accessorFn: row => boolCellhandler(row.Isapproved) },
        { header: t('Pages.Visits.Columns.Description'), accessorKey: 'Description', },
        { header: t("Pages.Visits.Columns.ApprovedUserID"), accessorKey: 'ApprovedUserID', accessorFn: row => userCellhandler(row.ApprovedUserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching) },
        { header: t("Pages.Visits.Columns.ApproveDescription"), accessorKey: 'ApproveDescription' },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.detail"), accessorKey: 'detail', isIcon: true, pinned: true, role: privileges.visitview, cell: (wrapper) => detailCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.work"), accessorKey: 'work', isIcon: true, pinned: true, role: privileges.visitupdate, cell: (wrapper) => workCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.visitdelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 },
    ]

    const tableKey = `${isUsersFetching}`

    return (<Pagewrapper padding={0} isLoading={isFetching || isMetaLoading} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <DataTable
                key={tableKey}
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
        <VisitWorkModal
            open={workOpen}
            setOpen={setWorkOpen}
            data={record}
            setData={setRecord}
        />
        <VisitDeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            data={record}
            setData={setRecord}
        />
    </Pagewrapper>
    )
}

export default VisitOnapprove
