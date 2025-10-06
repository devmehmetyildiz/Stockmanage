import React, { useEffect, useState } from 'react'

import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'

import { useTranslation } from 'react-i18next'
import privileges from '@Constant/privileges'
import { Link } from 'react-router-dom'
import { CellContext } from '@tanstack/react-table'
import { FormatFullDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { useGetRolesQuery } from '@Api/Role'
import { RoleItem } from '@Api/Role/type'
import RoleDeleteModal from '@Components/Role/RoleDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, EditCellHandler } from '@Components/Common/CellHandler'


const Role: React.FC = () => {

    const { t } = useTranslation()

    const [expandedPrivileges, setExpandedPrivileges] = useState<number[]>([])
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<RoleItem | null>(null)

    const { data, isFetching } = useGetRolesQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'role' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as RoleItem

        return <EditCellHandler url={`/${RouteKeys.Roles}/${data.Uuid}/edit`} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as RoleItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }


    const expandPrivileges = (rowId: number) => {
        setExpandedPrivileges(prev => [
            ...prev,
            rowId
        ])
    }

    const shrinkPrivileges = (rowId: number) => {
        setExpandedPrivileges(prev => prev.filter(u => u !== rowId))
    }

    const privilegeBaseCellhandler = (row: RoleItem) => {
        const items = (row.Privileges || [])
        const itemsText = items.map(u => u?.code).join(',')
        return itemsText
    }

    const privilegeCellhandler = (row: RoleItem) => {
        const itemId = row.Id
        const items = (row.Privileges || [])
        const itemsText = items.map(u => u?.code).join(', ')
        return itemsText.length - 35 > 20 ?
            (
                !expandedPrivileges.includes(itemId) ?
                    [itemsText.slice(0, 35), <Link to='#' className='text-primary' onClick={() => expandPrivileges(itemId)}>{`${t('Common.Expand')}(${items.length})`}</Link>] :
                    [itemsText, <Link to='#' className='text-primary' onClick={() => shrinkPrivileges(itemId)}>{t('Common.Shrink')}</Link>]
            ) : itemsText
    }

    const columns: ColumnType<RoleItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t("Pages.Roles.Columns.Name"), accessorKey: 'Name', isMobile: true },
        { header: t("Pages.Roles.Columns.Privileges"), accessorKey: 'Privileges', accessorFn: row => privilegeBaseCellhandler(row), cell: ({ row }) => privilegeCellhandler(row.original as RoleItem) },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.roleupdate, cell: (wrapper) => editCellhandler(wrapper), size: 70 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.roledelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 }
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])


    return <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Roles.Page.Header')}
                PageUrl={Paths.Roles}
                excelExportName={t('Pages.Roles.Page.Header')}
                create={{
                    Pagecreateheader: t('Pages.Roles.Page.CreateHeader'),
                    Pagecreatelink: Paths.RolesCreate
                }}
            />
            <DataTable
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
        <RoleDeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            data={record}
            setData={setRecord}
        />
    </Pagewrapper>
}
export default Role