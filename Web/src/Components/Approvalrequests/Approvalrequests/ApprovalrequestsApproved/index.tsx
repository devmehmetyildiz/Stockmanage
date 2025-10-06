import { useGetApprovalrequestsQuery } from '@Api/Approvalrequests'
import { ApprovalrequestItem } from '@Api/Approvalrequests/type'
import { useGetTableMetaQuery } from '@Api/Profile'
import { useGetUsersListQuery } from '@Api/User'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import DataTableWrapper from '@Components/Common/DataTable/DataTableWrapper'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import { loaderCellhandler } from '@Utils/CellHandler'
import { FormatFullDate } from '@Utils/FormatDate'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { useTranslation } from 'react-i18next'

const ApprovalrequestsApproved = () => {

    const { t } = useTranslation()

    const { data, isFetching } = useGetApprovalrequestsQuery({ isActive: 1, Isapproved: 1, Isrejected: 0 })
    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1, Isworker: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'approvalrequestsapproved' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const userCellhandler = (value: string) => {
        const user = (users || []).find(u => u.Uuid === value)
        return user ? `${user.Name} ${user.Surname}` : t('Common.NoDataFound')
    }

    const columns: ColumnType<ApprovalrequestItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Approvalrequests.Columns.Message'), accessorKey: 'Message' },
        { header: t('Pages.Approvalrequests.Columns.RequestTime'), accessorFn: row => dateCellhandler(row?.RequestTime) },
        { header: t('Pages.Approvalrequests.Columns.RequestUserID'), accessorFn: row => userCellhandler(row?.RequestUserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching), isMobile: true },
        { header: t('Pages.Approvalrequests.Columns.ApproveTime'), accessorFn: row => dateCellhandler(row?.ApproveTime) },
        { header: t('Pages.Approvalrequests.Columns.ApproveUserID'), accessorFn: row => userCellhandler(row?.ApproveUserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching), isMobile: true },
    ]

    const tableKey = `${isFetching}-${isUsersFetching}`

    return <LoadingWrapper loading={isFetching || isUsersFetching}>
        <DataTableWrapper>
            <DataTable
                key={tableKey}
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </DataTableWrapper>
    </LoadingWrapper>
}
export default ApprovalrequestsApproved