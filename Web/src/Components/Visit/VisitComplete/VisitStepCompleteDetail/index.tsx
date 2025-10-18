import { useGetStocksQuery } from '@Api/Stock'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { VisitCompleteRequest, VisitItem } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import NotfoundScreen from '@Components/Common/NotfoundScreen'
import Pagewrapper from '@Components/Common/Pagewrapper'
import { FormatDate } from '@Utils/FormatDate'
import validator from '@Utils/Validator'
import React, { useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Card, Divider, Icon, Table } from 'semantic-ui-react'

interface VisitStepCompleteDetailProps {
    data: VisitItem | undefined
}

const VisitStepCompleteDetail: React.FC<VisitStepCompleteDetailProps> = (props) => {

    const { data } = props
    const { t } = useTranslation()

    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1, WarehouseID: data?.WarehouseID }, { skip: !validator.isUUID(data?.WarehouseID) })
    const { data: stockdefines, isFetching: isStockdefinessFetching } = useGetStockdefinesQuery({ isActive: 1 }, { skip: !validator.isUUID(data?.WarehouseID) })


    const { getValues } = useFormContext<VisitCompleteRequest>()
    const values = getValues()

    const {
        Totalamount,
        Prepaymentamount,
        Installmentcount,
        Installmentinterval,
        Duedays,
        isFullPayment,
        Returnedproducts: rawReturnedProducts,
        Startdate,
    } = values

    const ReturnedProducts = (rawReturnedProducts || []).filter(u => u.Amount)

    const formattedTotal = useMemo(() => new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(Totalamount || 0), [Totalamount])

    const formattedPrepayment = useMemo(() => new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(Prepaymentamount || 0), [Prepaymentamount])

    return <Pagewrapper dynamicHeight alignTop direction="vertical" gap={4} isLoading={isStockdefinessFetching || isStocksFetching}>
        <Contentwrapper className='!bg-transparent !outline-none !shadow-none'>
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <Icon name="file alternate" className='!text-primary' />
                    {t('Pages.Visits.Label.StepDetail')}
                </h2>
                <Divider />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
                    <div className="flex items-center gap-3">
                        <Icon name="calendar" className='!text-primary' />
                        <span className="font-medium">{t('Pages.Visits.Columns.Visitstartdate')}:</span>
                        <strong className='font-bold text-primary'>{FormatDate(Startdate) || '-'}</strong>
                    </div>
                    <div className="flex items-center gap-3">
                        <Icon name="money bill alternate" className='!text-primary' />
                        <span className="font-medium">{t('Pages.Visits.Label.Totalamount')}:</span>
                        <strong className='font-bold text-primary'>{formattedTotal}</strong>
                    </div>
                    <div className="flex items-center gap-3">
                        <Icon name="credit card" className='!text-primary' />
                        <span className="font-medium">{t('Pages.Visits.Label.Prepayment')}:</span>
                        <strong className='font-bold text-primary'>{isFullPayment ? t('Pages.Visits.Label.FullPayment') : formattedPrepayment}</strong>
                    </div>
                    {!isFullPayment && (
                        <>
                            <div className="flex items-center gap-3">
                                <Icon name="calendar" className='!text-primary' />
                                <span className="font-medium">{t('Pages.Visits.Label.Installmentcount')}:</span>
                                <strong className=' text-primary'>{Installmentcount}</strong>
                            </div>
                            <div className="flex items-center gap-3">
                                <Icon name="clock" className='!text-primary' />
                                <span className="font-medium">{t('Pages.Visits.Label.Installmentinterval')}:</span>
                                <strong className='font-bold text-primary'>{Installmentinterval} {t('Common.Days')}</strong>
                            </div>
                            <div className="flex items-center gap-3">
                                <Icon name="hourglass half" className='!text-primary' />
                                <span className="font-medium">{t('Pages.Visits.Label.Duedays')}:</span>
                                <strong className='font-bold text-primary'>{Duedays}</strong>
                            </div>
                        </>
                    )}
                </div>
                <Divider horizontal>
                    {t('Pages.Visits.Label.ReturnedProducts')}
                </Divider>
                {ReturnedProducts.length > 0 ?
                    <Table celled striped compact>
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>{t('Pages.Visits.Label.Productname')}</Table.HeaderCell>
                                <Table.HeaderCell>{t('Pages.Visits.Columns.Amount')}</Table.HeaderCell>
                                <Table.HeaderCell>{t('Pages.Visits.Columns.Description')}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {ReturnedProducts && ReturnedProducts.length > 0 ? (
                                ReturnedProducts.filter(u => u.Amount > 0).map((product, i) => {
                                    const visitProduct = (data?.Products || []).find(item => item.Uuid === product.Uuid)
                                    const stock = (stocks || []).find(item => item.Uuid === visitProduct?.StockID)
                                    const stockdefine = (stockdefines || []).find(item => item.Uuid === stock?.StockdefineID)
                                    const stockName = stockdefine?.Productname ?? product?.Uuid

                                    return <Table.Row key={i}>
                                        <Table.Cell>{stockName}</Table.Cell>
                                        <Table.Cell>{product.Amount}</Table.Cell>
                                        <Table.Cell>{product.Description || '-'}</Table.Cell>
                                    </Table.Row>
                                })
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan="3" textAlign="center">
                                        {t('Common.NoDataFound')}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table> : <NotfoundScreen text={t('Pages.Visits.Messages.NoReturnProductFound')} />
                }

            </div>
        </Contentwrapper>
    </Pagewrapper>
}
export default VisitStepCompleteDetail