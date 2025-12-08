import { useGetApprovalrequestsQuery } from '@Api/Approvalrequests'
import { ApprovalrequestItem } from '@Api/Approvalrequests/type'
import { useGetTableMetaQuery } from '@Api/Profile'
import { useGetUsersListQuery } from '@Api/User'
import { CompleteCellhandler, PatientDetailCellHandler, RemoveCellHandler } from '@Components/Common/CellHandler'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import DataTableWrapper from '@Components/Common/DataTable/DataTableWrapper'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import privileges from '@Constant/privileges'
import { CellContext } from '@tanstack/react-table'
import { loaderCellhandler } from '@Utils/CellHandler'
import { FormatFullDate } from '@Utils/FormatDate'
import FormatTableMeta from '@Utils/FormatTableMeta'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from 'semantic-ui-react'

interface ApprovalrequestsWaitingApproveColumnType extends ApprovalrequestItem {
    check: React.ReactElement
}

interface ApprovalrequestsWaitingApproveProps {
    records: ApprovalrequestItem[]
    setRecords: React.Dispatch<React.SetStateAction<ApprovalrequestItem[]>>
    setApproveOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRejectOpen: React.Dispatch<React.SetStateAction<boolean>>
    multiProcessOpen: boolean
}

const ApprovalrequestsWaitingApprove: React.FC<ApprovalrequestsWaitingApproveProps> = (props) => {

    const { records, setRecords, setApproveOpen, setRejectOpen, multiProcessOpen } = props

    const { t } = useTranslation()

    const { data, isFetching } = useGetApprovalrequestsQuery({ isActive: 1, Isapproved: 0, Isrejected: 0 })
    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'approvalrequestswaitingapprove' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const userCellhandler = (value: string) => {
        const user = (users || []).find(u => u.Uuid === value)
        return user ? `${user.Name} ${user.Surname}` : t('Common.NoDataFound')
    }

    const checkCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as ApprovalrequestItem

        const isSelected = !!records.find(u => u.Uuid === data.Uuid)

        return <Checkbox
            checked={isSelected}
            onChange={() => {
                setRecords(prev => isSelected
                    ? [...prev.filter(u => u.Uuid !== data.Uuid)]
                    : [...prev, data]
                )
            }}
        />
    }

    const detailPageCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as ApprovalrequestItem

        if (data.Detiallink) {
            return <PatientDetailCellHandler url={data.Detiallink} />
        }
        return null
    }

    const approveCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as ApprovalrequestItem

        return <CompleteCellhandler onClick={() => {
            setRecords([
                data
            ])
            setApproveOpen(true)
        }} />
    }

    const rejectCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as ApprovalrequestItem

        return <RemoveCellHandler onClick={() => {
            setRecords([
                data
            ])
            setRejectOpen(true)
        }} />
    }

    const columns: ColumnType<ApprovalrequestsWaitingApproveColumnType>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Approvalrequests.Columns.Message'), accessorKey: 'Message' },
        { header: t('Pages.Approvalrequests.Columns.RequestTime'), accessorFn: row => dateCellhandler(row?.RequestTime) },
        { header: t('Pages.Approvalrequests.Columns.RequestUserID'), accessorFn: row => userCellhandler(row?.RequestUserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching), isMobile: true },
        { header: t('Pages.Approvalrequests.Columns.Comment'), accessorKey: 'Comment' },
        { header: t("Common.Columns.detail"), accessorKey: 'detail', isIcon: true, pinned: true, cell: (wrapper) => detailPageCellhandler(wrapper), size: 50 },
        { header: t("Common.Columns.approve"), accessorKey: 'approve', isIcon: true, pinned: true, role: privileges.approvalrequestupdate, cell: (wrapper) => approveCellhandler(wrapper), size: 55, hidden: multiProcessOpen },
        { header: t("Common.Button.Reject"), accessorKey: 'reject', isIcon: true, pinned: true, role: privileges.approvalrequestupdate, cell: (wrapper) => rejectCellhandler(wrapper), size: 55, hidden: multiProcessOpen },
        { header: '', accessorKey: 'check', cell: wrapper => checkCellhandler(wrapper), isIcon: true, pinned: true, size: 10, hidden: !multiProcessOpen },
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
export default ApprovalrequestsWaitingApprove