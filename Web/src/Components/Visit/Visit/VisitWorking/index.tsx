import React from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import { FormatDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { VisitListItem } from '@Api/Visit/type'
import { useGetVisitsQuery } from '@Api/Visit'
import { VISIT_STATU_WORKING } from '@Constant/index'
import { useGetUsersListQuery } from '@Api/User'
import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import { useGetLocationsQuery } from '@Api/Location'
import { useGetPaymenttypesQuery } from '@Api/Paymenttype'
import { loaderCellhandler } from '@Utils/CellHandler'
import privileges from '@Constant/privileges'
import { CompleteCellhandler, DetailCellHandler, EditCellHandler } from '@Components/Common/CellHandler'
import { CellContext } from '@tanstack/react-table'
import RouteKeys from '@Constant/routeKeys'

const VisitWorking: React.FC = () => {

    const { t } = useTranslation()

    const { data, isFetching } = useGetVisitsQuery({ isActive: 1, Status: VISIT_STATU_WORKING })

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 })
    const { data: doctordefines, isFetching: isDoctordefinesFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })
    const { data: paymenttypes, isFetching: isPaymenttypesFetching } = useGetPaymenttypesQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'visitworking' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatDate(value)
    }

    const userCellhandler = (value: string) => {
        const user = (users || []).find(u => u.Uuid === value)
        return user ? `${user.Name} ${user.Surname}` : t('Common.NoDataFound')
    }

    const doctordefineCellhandler = (value: string) => {
        const doctordefine = (doctordefines || []).find(u => u.Uuid === value)
        return doctordefine ? `${doctordefine.Name} ${doctordefine.Surname}` : t('Common.NoDataFound')
    }

    const locationCellhandler = (value: string) => {
        const location = (locations || []).find(u => u.Uuid === value)
        return location?.Name ?? t('Common.NoDataFound')
    }

    const paymenttypeCellhandler = (value: string) => {
        const paymenttype = (paymenttypes || []).find(u => u.Uuid === value)
        return paymenttype?.Name ?? t('Common.NoDataFound')
    }

    const detailCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <DetailCellHandler url={`/${RouteKeys.Visits}/${data.Uuid}/Detail`} />
    }

    const editDefinesCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <EditCellHandler url={`/${RouteKeys.Visits}/${data.Uuid}/edit-payment-defines`} icon="pencil alternate" />
    }

    const completeCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        return <CompleteCellhandler url={`/${RouteKeys.Visits}/${data.Uuid}/complete`} />
    }

    const columns: ColumnType<VisitListItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Visits.Columns.Visitcode'), accessorKey: 'Visitcode', isMobile: true },
        { header: t('Pages.Visits.Columns.UserID'), accessorKey: 'UserID', accessorFn: row => userCellhandler(row.UserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching) },
        { header: t('Pages.Visits.Columns.DoctorID'), accessorKey: 'DoctorID', accessorFn: row => doctordefineCellhandler(row.DoctorID), cell: wrapper => loaderCellhandler(wrapper, isDoctordefinesFetching), isMobile: true },
        { header: t('Pages.Visits.Columns.LocationID'), accessorKey: 'LocationID', accessorFn: row => locationCellhandler(row.LocationID), cell: wrapper => loaderCellhandler(wrapper, isLocationsFetching), },
        { header: t('Pages.Visits.Columns.PaymenttypeID'), accessorKey: 'PaymenttypeID', accessorFn: row => paymenttypeCellhandler(row.PaymenttypeID), cell: wrapper => loaderCellhandler(wrapper, isPaymenttypesFetching), },
        { header: t('Pages.Visits.Columns.Scheduledpayment'), accessorKey: 'Scheduledpayment', },
        { header: t("Pages.Visits.Columns.Visitdate"), accessorKey: 'Visitdate', accessorFn: row => dateCellhandler(row.Visitdate) },
        { header: t("Pages.Visits.Columns.Visitstartdate"), accessorKey: 'Visitstartdate', accessorFn: row => dateCellhandler(row.Visitdate) },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Pages.Visits.Columns.EditPaymentDefines"), accessorKey: 'editPaymentDefines', isIcon: true, pinned: true, role: privileges.visitupdate, cell: (wrapper) => editDefinesCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.complete"), accessorKey: 'complete', isIcon: true, pinned: true, role: privileges.visitupdate, cell: (wrapper) => completeCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.detail"), accessorKey: 'detail', isIcon: true, pinned: true, role: privileges.visitview, cell: (wrapper) => detailCellhandler(wrapper), size: 45 },
    ]

    const tableKey = `${isUsersFetching}-${isDoctordefinesFetching}-${isLocationsFetching}-${isPaymenttypesFetching}`

    return (<Pagewrapper padding={0} isLoading={isFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <DataTable
                key={tableKey}
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
    </Pagewrapper>
    )
}

export default VisitWorking
