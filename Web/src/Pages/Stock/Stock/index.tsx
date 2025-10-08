import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import privileges from '@Constant/privileges'
import { CellContext } from '@tanstack/react-table'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { StockItem } from '@Api/Stock/type'
import { useGetStocksQuery } from '@Api/Stock'
import StockDeleteModal from '@Components/Stock/StockDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, MovementCellHandler } from '@Components/Common/CellHandler'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { useGetWarehousesQuery } from '@Api/Warehouse'
import { loaderCellhandler } from '@Utils/CellHandler'

const Stock: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<StockItem | null>(null)

    const { data, isFetching } = useGetStocksQuery({ isActive: 1 })
    const { data: stockdefines, isFetching: isStockdefinesFetching } = useGetStockdefinesQuery({ isActive: 1 })
    const { data: warehouses, isFetching: isWarehousesFetching } = useGetWarehousesQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'stock' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const stockdefineCellhandler = (value: string) => {
        const stockdefine = (stockdefines || []).find(u => u.Uuid === value)
        return stockdefine ? stockdefine.Productname : t('Common.NoDataFound')
    }

    const warehouseCellhandler = (value: string) => {
        const warehouse = (warehouses || []).find(u => u.Uuid === value)
        return warehouse ? warehouse.Name : t('Common.NoDataFound')
    }


    const movementCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as StockItem

        return <MovementCellHandler url={`/${RouteKeys.Stocks}/${data.Uuid}/Movements`} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as StockItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const columns: ColumnType<StockItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Stocks.Columns.WarehouseID'), accessorKey: 'WarehouseID', isMobile: true, accessorFn: row => warehouseCellhandler(row.WarehouseID), cell: wrapper => loaderCellhandler(wrapper, isWarehousesFetching) },
        { header: t('Pages.Stocks.Columns.StockdefineID'), accessorKey: 'StockdefineID', isMobile: true, accessorFn: row => stockdefineCellhandler(row.StockdefineID), cell: wrapper => loaderCellhandler(wrapper, isStockdefinesFetching) },
        { header: t('Pages.Stocks.Columns.TotalAmount'), accessorKey: 'TotalAmount' },
        { header: t("Common.Columns.movement"), accessorKey: 'movement', isIcon: true, pinned: true, role: privileges.stockview, cell: (wrapper) => movementCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.stockdelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 }
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    const tableKey = `${isWarehousesFetching}-${isStockdefinesFetching}`

    return (
        <Pagewrapper isLoading={isFetching || isStockdefinesFetching || isWarehousesFetching} direction='vertical' gap={4} alignTop>
            <ExcelProvider>
                <Title
                    PageName={t('Pages.Stocks.Page.Header')}
                    PageUrl={Paths.Stocks}
                    excelExportName={t('Pages.Stocks.Page.Header')}
                    create={{
                        Pagecreateheader: t('Pages.Stocks.Page.CreateHeader'),
                        Pagecreatelink: Paths.StocksCreate
                    }}
                />
                <DataTable
                    key={tableKey}
                    columns={columns}
                    data={data}
                    config={initialConfig}
                />
            </ExcelProvider>
            <StockDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                data={record}
                setData={setRecord}
            />
        </Pagewrapper>
    )
}

export default Stock
