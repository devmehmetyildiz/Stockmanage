import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import privileges from '@Constant/privileges'
import { Icon } from 'semantic-ui-react'
import { CellContext } from '@tanstack/react-table'
import { FormatFullDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { RuleItem } from '@Api/Rule/type'
import { useGetRulesQuery } from '@Api/Rule'
import RuleDeleteModal from '@Components/Rule/RuleDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import RuleStopModal from '@Components/Rule/RuleStopModal'
import { DeleteCellHandler, DetailCellHandler, EditCellHandler, StopCellhandler } from '@Components/Common/CellHandler'

const Rule: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [stopOpen, setStopOpen] = useState(false)
    const [record, setRecord] = useState<RuleItem | null>(null)

    const { data, isFetching } = useGetRulesQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'rule' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as RuleItem

        return <EditCellHandler url={`/${RouteKeys.Rules}/${data.Uuid}/edit`} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as RuleItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const stopCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as RuleItem

        if (data.Isworking) {
            return <StopCellhandler onClick={() => {
                setRecord(data)
                setStopOpen(true)
            }} />
        } else {
            return <Icon size='large' color='grey' name='minus' />
        }
    }

    const boolCellhandler = (value: any) => {
        return value !== null && (value === 1 ? t('Common.Yes') : t('Common.No'))
    }

    const workingCellhandler = (value: any) => {
        return value !== null && (value === 1 ? t('Common.Working') : t('Common.NonWorking'))
    }

    const statusStyleCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as RuleItem
        return <Icon style={{ color: data.Status === true || data.Status === 1 ? 'green' : 'red' }} className="ml-2" name='circle' />
    }

    const workingStyleCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as RuleItem
        return <Icon style={{ color: data.Isworking === true || data.Isworking === 1 ? 'green' : 'red' }} className="ml-2" name='circle' />
    }

    const detailCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as RuleItem

        return <DetailCellHandler url={`/${RouteKeys.Rules}/${data.Uuid}`} />
    }

    const columns: ColumnType<RuleItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Rules.Columns.Name'), accessorKey: 'Name', isMobile: true },
        { header: t('Pages.Rules.Columns.Info'), accessorKey: 'Info' },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t('Pages.Rules.Columns.Working'), accessorFn: row => boolCellhandler(row?.Isworking), isIcon: true, cell: (wrapper) => workingStyleCellhandler(wrapper), pinned: true, size: 45, isMobile: true },
        { header: t('Pages.Rules.Columns.Status'), accessorFn: row => workingCellhandler(row?.Status), isIcon: true, cell: (wrapper) => statusStyleCellhandler(wrapper), pinned: true, size: 45 },
        { header: t("Common.Columns.detail"), accessorKey: 'detail', isIcon: true, pinned: true, role: privileges.ruleview, cell: (wrapper) => detailCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.stop"), accessorKey: 'stop', isIcon: true, pinned: true, role: privileges.ruleupdate, cell: (wrapper) => stopCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.ruleupdate, cell: (wrapper) => editCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.ruledelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 }
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    return <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Rules.Page.Header')}
                PageUrl={Paths.Rules}
                excelExportName={t('Pages.Rules.Page.Header')}
                create={{
                    Pagecreateheader: t('Pages.Rules.Page.CreateHeader'),
                    Pagecreatelink: Paths.RulesCreate
                }}
            />
            <DataTable
                columns={columns}
                data={data}
                config={initialConfig}
            />
        </ExcelProvider>
        <RuleDeleteModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            data={record}
            setData={setRecord}
        />
        <RuleStopModal
            open={stopOpen}
            setOpen={setStopOpen}
            data={record}
            setData={setRecord}
        />
    </Pagewrapper>
}
export default Rule