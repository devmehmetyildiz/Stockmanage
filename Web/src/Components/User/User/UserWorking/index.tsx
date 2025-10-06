import React from 'react'
import { useGetTableMetaQuery } from '@Api/Profile'
import { useGetUsersListQuery } from '@Api/User'
import { UserListItem } from '@Api/User/type'
import { DeleteCellHandler, EditCellHandler, RemoveCellHandler } from '@Components/Common/CellHandler'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import DataTableWrapper from '@Components/Common/DataTable/DataTableWrapper'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import privileges from '@Constant/privileges'
import RouteKeys from '@Constant/routeKeys'
import { CellContext } from '@tanstack/react-table'
import { FormatDate } from '@Utils/FormatDate'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Icon } from 'semantic-ui-react'

interface UserWorkingProps {
    setRecord: React.Dispatch<React.SetStateAction<UserListItem | null>>
    setDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>
    setRemoveOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const UserWorking: React.FC<UserWorkingProps> = ({ setDeleteOpen, setRecord, setRemoveOpen }) => {

    const { t } = useTranslation()

    const { data, isFetching } = useGetUsersListQuery({ isActive: 1, Isworker: 1, Isworking: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'userworking' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as UserListItem

        return <Link to={`/${RouteKeys.Users}/${data.Uuid}/edit`} ><Icon size='large' className='!text-primary' name='edit' /></Link>
    }

    const removeCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as UserListItem

        return <RemoveCellHandler onClick={() => {
            setRecord(data)
            setRemoveOpen(true)
        }} />
    }


    const dateCellhandler = (value: string) => {
        return FormatDate(value)
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as UserListItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const columns: ColumnType<UserListItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t("Pages.Users.Columns.Username"), accessorKey: 'Username', isMobile: true },
        { header: t("Pages.Users.Columns.Name"), accessorKey: 'Name', isMobile: true },
        { header: t("Pages.Users.Columns.Surname"), accessorKey: 'Surname', isMobile: true },
        { header: t("Pages.Users.Columns.Email"), accessorKey: 'Email' },
        { header: t("Pages.Users.Columns.Workstarttime"), accessorKey: 'Workstarttime', accessorFn: row => dateCellhandler(row.Workstarttime) },
        { header: t("Common.Columns.remove"), accessorKey: 'remove', isIcon: true, pinned: true, role: privileges.userremove, cell: (wrapper) => removeCellhandler(wrapper), size: 70 },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.userupdate, cell: (wrapper) => editCellhandler(wrapper), size: 70 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.userdelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 }
    ]

    const tableKey = `${isFetching}`

    return <LoadingWrapper loading={isFetching}>
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
export default UserWorking