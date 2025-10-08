import { useGetStocksQuery, useLazyGetStockMovementsQuery } from '@Api/Stock'
import { useGetUsersListQuery } from '@Api/User'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import { STOCK_SOURCETYPE_USER } from '@Constant/index'
import Paths from '@Constant/path'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import StockMovementTimeline from './StockMovementTimeline'
import { useGetStockdefineQuery } from '@Api/Stockdefine'
import Contentwrapper from '@Components/Common/Contentwrapper'
import { Card, Icon } from 'semantic-ui-react'
import { useGetWarehouseQuery } from '@Api/Warehouse'
import StockMovementItem from './StockMovementItem'
import { motion } from 'framer-motion'


const StockMovement: React.FC = () => {

    const { Id } = useParams()
    const navigate = useNavigate()

    const { t } = useTranslation()

    const [GetStockMovements, { isFetching, data }] = useLazyGetStockMovementsQuery()
    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ Uuid: Id }, { skip: !validator.isUUID(Id) })

    const stock = (stocks || []).find(u => u.Uuid === Id)

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery()
    const { data: stockdefine, isFetching: isStockdefinesFetching } = useGetStockdefineQuery({ Uuid: stock?.StockdefineID ?? '' }, { skip: !validator.isUUID(stock?.StockdefineID) })
    const { data: warehouse, isFetching: isWarehouseFetching } = useGetWarehouseQuery({ Uuid: stock?.WarehouseID ?? '' }, { skip: !validator.isUUID(stock?.WarehouseID) })

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetStockMovements({ StockID: Id, isActive: 1 })
                .unwrap()
                .catch(() => {
                    navigate(Paths.Stocks)
                })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Stocks.Page.Header'),
                Description: t('Pages.Stocks.Messages.UndefinedStock')
            })
            navigate(Paths.Stocks)
        }
    }, [Id, GetStockMovements, navigate, t])

    return <Pagewrapper isLoading={isFetching || isUsersFetching || isStocksFetching || isStockdefinesFetching || isWarehouseFetching} direction='vertical' gap={4} alignTop>
        <Title
            PageName={t('Pages.Stocks.Page.Header')}
            PageUrl={Paths.Stocks}
            AdditionalName={stockdefine?.Productname}
        />
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
                duration: 1.5,
                ease: [0.25, 0.1, 0.25, 1],
            }}
            className='w-full'>
            <Card fluid className="!rounded-2xl !shadow-lg !border-0 !bg-white mb-12 !p-4"   >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 ">
                            <Icon name="cubes" className='text-primary' size="large" />
                            {`${stockdefine?.Productname} (${warehouse?.Name})`}
                        </h2>
                        {stockdefine?.Description && (
                            <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                                {stockdefine?.Description}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:gap-2 text-sm text-gray-700 ml-auto bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                        <StockMovementItem
                            icon='industry'
                            label={t('Pages.Stockdefines.Columns.Brand')}
                            value={stockdefine?.Brand}
                            isGray
                        />
                        <StockMovementItem
                            icon='tag'
                            label={t('Pages.Stockdefines.Columns.Model')}
                            value={stockdefine?.Model}
                            isGray
                        />
                        <StockMovementItem
                            icon='boxes'
                            label={t('Pages.Stockdefines.Columns.Category')}
                            value={stockdefine?.Category}
                            isGray
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8 text-sm text-gray-700">
                    <StockMovementItem
                        icon='resize vertical'
                        label={t('Pages.Stockdefines.Columns.Diameter')}
                        value={stockdefine?.Diameter}
                    />
                    <StockMovementItem
                        icon='resize vertical'
                        label={t('Pages.Stockdefines.Columns.Length')}
                        value={stockdefine?.Length}
                    />
                    <StockMovementItem
                        icon='cubes'
                        label={t('Pages.Stockdefines.Columns.Material')}
                        value={stockdefine?.Material}
                    />
                    <StockMovementItem
                        icon='paint brush'
                        label={t('Pages.Stockdefines.Columns.Surfacetreatment')}
                        value={stockdefine?.Surfacetreatment}
                    />
                    <StockMovementItem
                        icon='paint brush'
                        label={t('Pages.Stockdefines.Columns.Surfacetreatment')}
                        value={stockdefine?.Surfacetreatment}
                    />
                    <StockMovementItem
                        icon='plug'
                        label={t('Pages.Stockdefines.Columns.Connectiontype')}
                        value={stockdefine?.Connectiontype}
                    />

                    <StockMovementItem
                        icon='user'
                        label={t('Pages.Stockdefines.Columns.Suppliername')}
                        value={stockdefine?.Suppliername}
                    />

                    <StockMovementItem
                        icon='phone'
                        label={t('Pages.Stockdefines.Columns.Suppliercontact')}
                        value={stockdefine?.Suppliercontact}
                    />
                </div>
            </Card>
        </motion.div>
        <Contentwrapper>
            <Title
                PageName={t('Pages.Stocks.Label.History')}
            />
            <StockMovementTimeline
                data={data}
                users={users}
            />
        </Contentwrapper>
    </Pagewrapper >
}
export default StockMovement