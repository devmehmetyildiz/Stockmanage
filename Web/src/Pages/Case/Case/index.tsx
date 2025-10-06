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
import { CaseItem } from '@Api/Case/type'
import { useGetCasesQuery } from '@Api/Case'
import CaseDeleteModal from '@Components/Case/CaseDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, EditCellHandler } from '@Components/Common/CellHandler'
import { CASE_STATU_COMPLETE, CASE_STATU_DECLINED, CASE_STATU_ON_DECLINE_APPROVE, CASE_STATU_START, CASE_STATU_STOP, CASE_STATU_WORKING } from '@Constant/index'

const Case: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<CaseItem | null>(null)

    const { data, isFetching } = useGetCasesQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'case' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as CaseItem

        return <EditCellHandler url={`/${RouteKeys.Cases}/${data.Uuid}/edit`} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as CaseItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const caseStatusCellhandler = (value: number) => {
        const options = [
            { key: 0, text: t('Option.CaseStatu.Start'), value: CASE_STATU_START, },
            { key: 1, text: t('Option.CaseStatu.Working'), value: CASE_STATU_WORKING, },
            { key: 2, text: t('Option.CaseStatu.Complete'), value: CASE_STATU_COMPLETE, },
            { key: 3, text: t('Option.CaseStatu.Stop'), value: CASE_STATU_STOP, },
            { key: 4, text: t('Option.CaseStatu.OnDeclineApprove'), value: CASE_STATU_ON_DECLINE_APPROVE, },
            { key: 5, text: t('Option.CaseStatu.Declined'), value: CASE_STATU_DECLINED, },
        ]

        return options.find(u => u.value === value)?.text || t('Common.NoDataFound')
    }

    const boolCellhandler = (value: any) => {
        return value === 1 || value === true ? t('Common.Yes') : t('Common.No')
    }

    const columns: ColumnType<CaseItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Cases.Columns.Name'), accessorKey: 'Name', isMobile: true },
        { header: t('Pages.Cases.Columns.Color'), accessorKey: 'Color' },
        { header: t('Pages.Cases.Columns.Type'), accessorKey: 'Type', accessorFn: row => caseStatusCellhandler(row?.Type) },
        { header: t('Pages.Cases.Columns.Isdefault'), accessorKey: 'Isdefault', accessorFn: row => boolCellhandler(row?.Isdefault) },
        { header: t('Pages.Cases.Columns.Description'), accessorKey: 'Description' },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.caseupdate, cell: (wrapper) => editCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.casedelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 }
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    return <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Cases.Page.Header')}
                PageUrl={Paths.Cases}
                excelExportName={t('Pages.Cases.Page.Header')}
                create={{
                    Pagecreateheader: t('Pages.Cases.Page.CreateHeader'),
                    Pagecreatelink: Paths.CasesCreate
                }}
            />
            <DataTable
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
        <CaseDeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            data={record}
            setData={setRecord}
        />
    </Pagewrapper>
}
export default Case