import { useGetLastMovementStocksQuery, useGetStocksQuery } from '@Api/Stock'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { useGetUsersListQuery } from '@Api/User'
import { useGetVisitsQuery } from '@Api/Visit'
import Contentwrapper from '@Components/Common/Contentwrapper'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import Title from '@Components/Common/Title'
import { STOCK_SOURCETYPE_USER, STOCK_SOURCETYPE_VISIT, VISIT_TYPE_SALEVISIT } from '@Constant/index'
import { FormatFullDate } from '@Utils/FormatDate'
import validator from '@Utils/Validator'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Feed, Icon } from 'semantic-ui-react'

interface WarehouseDetailMovementFeedProps {
    WarehouseID: string | undefined
}

const WarehouseDetailMovementFeed: React.FC<WarehouseDetailMovementFeedProps> = ({ WarehouseID }) => {

    const { t } = useTranslation()

    const { data: movements, isFetching: isMovementsFetching } = useGetLastMovementStocksQuery({ WarehouseID: WarehouseID ?? '' }, { skip: !validator.isUUID(WarehouseID) })

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery()
    const { data: visits, isFetching: isVisitsFetching } = useGetVisitsQuery({ Visittype: VISIT_TYPE_SALEVISIT, isActive: 1 })
    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1, WarehouseID: WarehouseID }, { skip: !validator.isUUID(WarehouseID) })
    const { data: stockdefines, isFetching: isStockdefinesFetching } = useGetStockdefinesQuery({ isActive: 1 }, { skip: !validator.isUUID(WarehouseID) })

    const getUserName = (id: string) => {
        const user = (users || []).find(u => u.Uuid === id)
        return user ? `${user.Name} ${user.Surname} - ` : ''
    }

    const getSourceText = (type: number, id: string) => {

        if (type === STOCK_SOURCETYPE_USER) {
            const user = (users || []).find(u => u.Uuid === id)
            return user ? `${user.Name} ${user.Surname} ${t('Option.StockSourceType.User')}` : id
        }
        if (type === STOCK_SOURCETYPE_VISIT) {
            const visit = (visits || []).find(v => v.Uuid === id)
            return visit ? `${visit.Visitcode} ${t('Option.StockSourceType.Visit')}` : id
        }
        return id
    }

    return <LoadingWrapper loading={isMovementsFetching || isUsersFetching || isVisitsFetching || isStocksFetching || isStockdefinesFetching}>
        <Contentwrapper>
            <Title PageName={t('Pages.Warehouses.Label.RecentMovements')} />
            <Feed>
                {(movements || []).map((item, index) => {
                    const isIn = item.Type === 1
                    const icon = isIn ? 'arrow up' : 'arrow down'
                    const source = getSourceText(item.Sourcetype, item.SourceID)
                    const user = getUserName(item.UserID)
                    const stock = (stocks || []).find(u => u.Uuid === item.StockID)
                    const stockdefine = (stockdefines || []).find(u => u.Uuid === stock?.StockdefineID)

                    return (
                        <Feed.Event key={index}>
                            <Feed.Label>
                                <Icon name={icon} className='!text-primary' />
                            </Feed.Label>
                            <Feed.Content>
                                <Feed.Summary>
                                    <strong>{user}</strong>
                                    {isIn ? t('Pages.Stocks.Label.Input') : t('Pages.Stocks.Label.Output')} {' '}
                                    <strong>{item.Amount}</strong> {t('Common.Unit')}
                                    <Feed.Date>{FormatFullDate(item.Movementdate)}</Feed.Date>
                                </Feed.Summary>
                                <Feed.Extra >
                                    {t('Common.Source')}: {source}
                                    <strong>
                                        {` - ${stockdefine?.Productname} (${stockdefine?.Barcodeno})`}
                                    </strong>
                                </Feed.Extra>
                            </Feed.Content>
                        </Feed.Event>
                    )
                })}
            </Feed>
        </Contentwrapper>
    </LoadingWrapper>
}
export default WarehouseDetailMovementFeed