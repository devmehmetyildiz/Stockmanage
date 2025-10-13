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
import { StockdefineItem } from '@Api/Stockdefine/type'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import StockdefineDeleteModal from '@Components/Stockdefine/StockdefineDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, EditCellHandler } from '@Components/Common/CellHandler'

const Stockdefine: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<StockdefineItem | null>(null)

    const { data, isFetching } = useGetStockdefinesQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'stockdefine' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as StockdefineItem

        return <EditCellHandler url={`/${RouteKeys.Stockdefines}/${data.Uuid}/edit`} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as StockdefineItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const columns: ColumnType<StockdefineItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Stockdefines.Columns.Productname'), accessorKey: 'Productname', isMobile: true },
        { header: t('Pages.Stockdefines.Columns.Brand'), accessorKey: 'Brand', },
        { header: t('Pages.Stockdefines.Columns.Barcodeno'), accessorKey: 'Barcodeno', },
        { header: t('Pages.Stockdefines.Columns.Model'), accessorKey: 'Model', },
        { header: t('Pages.Stockdefines.Columns.Category'), accessorKey: 'Category', },
        { header: t('Pages.Stockdefines.Columns.Diameter'), accessorKey: 'Diameter', },
        { header: t('Pages.Stockdefines.Columns.Length'), accessorKey: 'Length', },
        { header: t('Pages.Stockdefines.Columns.Material'), accessorKey: 'Material', },
        { header: t('Pages.Stockdefines.Columns.Surfacetreatment'), accessorKey: 'Surfacetreatment', },
        { header: t('Pages.Stockdefines.Columns.Connectiontype'), accessorKey: 'Connectiontype', },
        { header: t('Pages.Stockdefines.Columns.Suppliername'), accessorKey: 'Suppliername', },
        { header: t('Pages.Stockdefines.Columns.Suppliercontact'), accessorKey: 'Suppliercontact', },
        { header: t('Pages.Stockdefines.Columns.Description'), accessorKey: 'Description' },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.stockdefineupdate, cell: (wrapper) => editCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.stockdefinedelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 }
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    return (
        <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
            <ExcelProvider>
                <Title
                    PageName={t('Pages.Stockdefines.Page.Header')}
                    PageUrl={Paths.Stockdefines}
                    excelExportName={t('Pages.Stockdefines.Page.Header')}
                    create={{
                        Pagecreateheader: t('Pages.Stockdefines.Page.CreateHeader'),
                        Pagecreatelink: Paths.StockdefinesCreate
                    }}
                />
                <DataTable
                    columns={columns}
                    data={data}
                    config={initialConfig}
                />
            </ExcelProvider>
            <StockdefineDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                data={record}
                setData={setRecord}
            />
        </Pagewrapper>
    )
}

export default Stockdefine
