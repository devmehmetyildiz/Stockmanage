import { useGetStocksQuery } from '@Api/Stock'
import { StockItem } from '@Api/Stock/type'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { StockdefineItem } from '@Api/Stockdefine/type'
import { VisitItem } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import Title from '@Components/Common/Title'
import validator from '@Utils/Validator'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Icon, Label, Message, Popup } from 'semantic-ui-react'

interface VisitDetailProductsProps {
    data: VisitItem | undefined
}

const VisitDetailProducts: React.FC<VisitDetailProductsProps> = (props) => {

    const { data, } = props
    const { t } = useTranslation()

    const { data: stockdefines, isFetching: isStockdefinesFetching } = useGetStockdefinesQuery({ isActive: 1 }, { skip: !validator.isUUID(data?.Uuid) });
    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1 }, { skip: !validator.isUUID(data?.Uuid) });

    const productRows = useMemo(() => {
        const products = data?.Products || [];
        return Array.isArray(products) ? products : [];
    }, [data]);

    const hasProducts = productRows.length > 0;

    return <LoadingWrapper loading={isStocksFetching || isStockdefinesFetching}>
        <Contentwrapper bottomRounded className="flex-1">
            <Title PageName={t('Pages.Visits.Label.Stocks')} />
            {!hasProducts && (
                <Message info>
                    <Message.Header>{t('Common.NoDataFound')}</Message.Header>
                    <p className="m-0">{t('Pages.Visits.Messages.NoProducts')}</p>
                </Message>
            )}

            {hasProducts && (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3 ">
                    {productRows.map((product, index) => {
                        const stock = (stocks || []).find(item => item.Uuid === product.StockID)
                        const stockdefine = (stockdefines || []).find(item => item.Uuid === stock?.StockdefineID)
                        const stockName = stockdefine?.Productname ?? product.StockID

                        return (<div className='w-full ' key={index}>
                            <Card
                                fluid
                                className="!bg-red-30 !rounded-xl !shadow !border-0 "
                            >
                                <Card.Content>
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-2">
                                            <div className='mb-1'>
                                                <Icon name="cube" className='text-primary' />
                                            </div>
                                            <div className="font-semibold text-gray-800">{stockName}</div>
                                        </div>
                                        <Popup
                                            content={product.Description || t('Pages.Visits.Label.NoDescription')}
                                            trigger={<Icon name="info circle" className="text-gray-400" />}
                                        />
                                    </div>

                                    <div className="mt-3 grid grid-cols-4 gap-2 text-sm ">
                                        <div className="text-gray-500 col-span-3">{t('Pages.Visits.Columns.Amount')}</div>
                                        <div className="text-gray-800 font-semibold">{product.Amount}</div>

                                        <div className="text-gray-500 col-span-3">{t('Pages.Visits.Label.IsTaken')}</div>
                                        <div className="text-gray-800">
                                            {product.Istaken ? (
                                                <Label color="green" size="mini" className="!text-white">
                                                    {t('Common.Yes')}
                                                </Label>
                                            ) : (
                                                <Label size="mini">{t('Common.No')}</Label>
                                            )}
                                        </div>

                                        <div className="text-gray-500 col-span-3">{t('Pages.Visits.Label.IsReturned')}</div>
                                        <div className="text-gray-800">
                                            {product.IsReturned ? (
                                                <Label color="teal" size="mini" className="!text-white">
                                                    {t('Common.Yes')}
                                                </Label>
                                            ) : (
                                                <Label size="mini">{t('Common.No')}</Label>
                                            )}
                                        </div>
                                    </div>

                                    {product.Description && (
                                        <div className="mt-3 text-xs text-gray-500">{product.Description}</div>
                                    )}
                                </Card.Content>
                            </Card>
                        </div>

                        );
                    })}
                </div>
            )}
        </Contentwrapper>
    </LoadingWrapper>
}
export default VisitDetailProducts