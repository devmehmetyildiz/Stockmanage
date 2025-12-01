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
import { VISIT_STATU_PLANNED, VISIT_TYPE_FREEVISIT } from '@Constant/index'
import { useGetUsersListQuery } from '@Api/User'
import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import { useGetLocationsQuery } from '@Api/Location'
import { loaderCellhandler } from '@Utils/CellHandler'
import privileges from '@Constant/privileges'
import { DeleteCellHandler, DetailCellHandler, EditCellHandler, WorkCellhandler } from '@Components/Common/CellHandler'
import { CellContext } from '@tanstack/react-table'
import RouteKeys from '@Constant/routeKeys'
import VisitDeleteModal from '@Components/Visit/VisitDeleteModal'
import useHasPrivileges from '@Hooks/useHasPrivileges'
import FreeVisitWorkModal from '@Components/FreeVisit/FreeVisitWorkModal'

const FreeVisitPlanned: React.FC = () => {

    const { t } = useTranslation()

    const [workOpen, setWorkOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<VisitListItem | null>(null)

    const { isHasPrivilege, isMetaLoading, isSuccess, UserID } = useHasPrivileges(privileges.visitmanageall)

    const { data, isFetching } = useGetVisitsQuery({ Visittype: VISIT_TYPE_FREEVISIT, Status: VISIT_STATU_PLANNED, UserID: isHasPrivilege ? UserID : undefined, isActive: 1 }, { skip: !isSuccess })

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 })
    const { data: doctordefines, isFetching: isDoctordefinesFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'visitplanned' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatDate(value)
    }

    const userCellhandler = (value: string) => {
        const user = (users || []).find(u => u.Uuid === value)
        return user ? `${user.Name} ${user.Surname}` : value
    }

    const doctordefineCellhandler = (value: string) => {
        const doctordefine = (doctordefines || []).find(u => u.Uuid === value)
        return doctordefine ? `${doctordefine.Name} ${doctordefine.Surname}` : t('Common.NoDataFound')
    }

    const locationCellhandler = (value: string) => {
        const location = (locations || []).find(u => u.Uuid === value)
        return location?.Name ?? t('Common.NoDataFound')
    }

    const detailCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <DetailCellHandler url={`/${RouteKeys.FreeVisits}/${data.Uuid}/Detail`} />
    }

    const editDefinesCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <EditCellHandler url={`/${RouteKeys.FreeVisits}/${data.Uuid}/edit-defines`} icon="pencil alternate" />
    }

    const workCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <WorkCellhandler onClick={() => {
            setRecord(data)
            setWorkOpen(true)
        }} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const columns: ColumnType<VisitListItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Visits.Columns.Visitcode'), accessorKey: 'Visitcode', isMobile: true },
        { header: t('Pages.Visits.Columns.WorkerUserID'), accessorKey: 'WorkerUserID', accessorFn: row => userCellhandler(row.WorkerUserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching) },
        { header: t('Pages.Visits.Columns.ResponsibleUserID'), accessorKey: 'ResponsibleUserID', accessorFn: row => userCellhandler(row.ResponsibleUserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching) },
        { header: t('Pages.Visits.Columns.DoctorID'), accessorKey: 'DoctorID', accessorFn: row => doctordefineCellhandler(row.DoctorID), cell: wrapper => loaderCellhandler(wrapper, isDoctordefinesFetching), isMobile: true },
        { header: t('Pages.Visits.Columns.LocationID'), accessorKey: 'LocationID', accessorFn: row => locationCellhandler(row.LocationID), cell: wrapper => loaderCellhandler(wrapper, isLocationsFetching), },
        { header: t("Pages.Visits.Columns.Visitdate"), accessorKey: 'Visitdate', accessorFn: row => dateCellhandler(row.Visitdate) },
        { header: t('Pages.Visits.Columns.Description'), accessorKey: 'Description', },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Pages.Visits.Columns.EditDefines"), accessorKey: 'editDefines', isIcon: true, pinned: true, role: privileges.visitupdate, cell: (wrapper) => editDefinesCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.work"), accessorKey: 'work', isIcon: true, pinned: true, role: privileges.visitupdate, cell: (wrapper) => workCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.detail"), accessorKey: 'detail', isIcon: true, pinned: true, role: privileges.visitview, cell: (wrapper) => detailCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.visitupdate, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 },
    ]

    const tableKey = `${isUsersFetching}-${isDoctordefinesFetching}-${isLocationsFetching}`

    return (<Pagewrapper padding={0} isLoading={isFetching || isMetaLoading} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <DataTable
                key={tableKey}
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
        <FreeVisitWorkModal
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

export default FreeVisitPlanned
