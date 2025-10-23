import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import { useTranslation } from 'react-i18next'
import { FormatFullDate } from '@Utils/FormatDate'
import { ExcelProvider } from '@Context/ExcelContext'
import { WarehouseItem } from '@Api/Warehouse/type'
import { useGetWarehousesQuery } from '@Api/Warehouse'
import WarehouseDeleteModal from '@Components/Warehouse/WarehouseDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, EditCellHandler } from '@Components/Common/CellHandler'
import { motion } from 'framer-motion'
import { Card, Icon } from 'semantic-ui-react'
import { useNavigate } from 'react-router-dom'
import NotfoundScreen from '@Components/Common/NotfoundScreen'
import { useGetStocksQuery } from '@Api/Stock'
import privileges from '@Constant/privileges'

const Warehouse: React.FC = () => {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<WarehouseItem | null>(null)

    const { data, isFetching } = useGetWarehousesQuery({ isActive: 1 })
    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1 })

    const warehouses = data || []

    const getWarehouseProductCount = (warehouseId: string) => {
        const warehouseStocks = (stocks || []).filter(
            (s) => s.WarehouseID === warehouseId && s.TotalAmount > 0
        )
        return warehouseStocks.length
    }

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    return (
        <Pagewrapper isLoading={isFetching || isStocksFetching} direction="vertical" gap={4} alignTop>
            <ExcelProvider>
                <Title
                    PageName={t('Pages.Warehouses.Page.Header')}
                    PageUrl={Paths.Warehouses}
                    excelExportName={t('Pages.Warehouses.Page.Header')}
                    create={{
                        Pagecreateheader: t('Pages.Warehouses.Page.CreateHeader'),
                        Pagecreatelink: Paths.WarehousesCreate,
                        role: privileges.warehouseadd
                    }}
                />

                {warehouses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                        {warehouses.map((warehouse: WarehouseItem) => (
                            <motion.div
                                key={warehouse.Uuid}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ duration: 0.25 }}
                            >
                                <Card
                                    fluid
                                    className="!rounded-2xl !shadow-md hover:!shadow-xl !border-0 !bg-white transition-all duration-300 cursor-pointer"
                                >
                                    <Card.Content
                                        onClick={() => navigate(`${Paths.Warehouses}/${warehouse.Uuid}/Detail`)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex flex-col gap-1">
                                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                    <Icon name="warehouse" className="text-primary" />
                                                    {warehouse.Name}
                                                </h2>
                                                {warehouse.Description && (
                                                    <p className="text-gray-500 text-sm leading-relaxed">
                                                        {warehouse.Description}
                                                    </p>
                                                )}
                                            </div>
                                            <Icon name="arrow right" size="large" className="text-gray-400" />
                                        </div>

                                        <div className="mt-4 flex flex-col gap-2 text-sm text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Icon name="boxes" className="text-primary" />
                                                {t('Pages.Warehouses.Label.ActiveProducts')}: {getWarehouseProductCount(warehouse.Uuid)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icon name="calendar plus" className="text-primary" />
                                                {t('Common.Columns.Createtime')}: {FormatFullDate(warehouse.Createtime)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icon name="user" className="text-primary" />
                                                {t('Common.Columns.Createduser')}: {warehouse.Createduser || t('Common.Unknown')}
                                            </div>
                                        </div>
                                    </Card.Content>

                                    <Card.Content extra>
                                        <div className="flex justify-end items-center gap-3">
                                            <EditCellHandler
                                                role={privileges.warehouseupdate}
                                                url={`/${RouteKeys.Warehouses}/${warehouse.Uuid}/edit`}
                                            />
                                            <DeleteCellHandler
                                                role={privileges.warehousedelete}
                                                onClick={() => {
                                                    setRecord(warehouse)
                                                    setDeleteOpen(true)
                                                }}
                                            />
                                        </div>
                                    </Card.Content>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <NotfoundScreen />
                )}
            </ExcelProvider>

            <WarehouseDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                data={record}
                setData={setRecord}
            />
        </Pagewrapper>
    )
}

export default Warehouse
