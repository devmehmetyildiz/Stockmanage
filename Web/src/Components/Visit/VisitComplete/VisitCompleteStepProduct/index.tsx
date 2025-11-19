import { useGetStocksQuery } from '@Api/Stock'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { VisitCompleteRequest, VisitItem } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import Pagewrapper from '@Components/Common/Pagewrapper'
import { createAppForm } from '@Utils/CreateAppForm'
import validator from '@Utils/Validator'
import React from 'react'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Divider, Form } from 'semantic-ui-react'

interface VisitCompleteStepProductProps {
    data: VisitItem | undefined
}

const VisitAppForm = createAppForm<VisitCompleteRequest>()

const VisitCompleteStepProduct: React.FC<VisitCompleteStepProductProps> = (props) => {

    const { data } = props

    const { t } = useTranslation()

    const { fields } = useFieldArray<VisitCompleteRequest>({ name: 'Returnedproducts' })

    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1, WarehouseID: data?.WarehouseID }, { skip: !validator.isUUID(data?.WarehouseID) })
    const { data: stockdefines, isFetching: isStockdefinessFetching } = useGetStockdefinesQuery({ isActive: 1 }, { skip: !validator.isUUID(data?.WarehouseID) })

    return <Pagewrapper dynamicHeight alignTop direction='vertical' gap={4} isLoading={isStocksFetching || isStockdefinessFetching}>
        <Contentwrapper className='!bg-transparent !outline-none !shadow-none'>
            <Form>
                {fields.map((field, index) => {
                    const visitProduct = (data?.Products || []).find(item => item.Uuid === field.Uuid)
                    const stock = (stocks || []).find(item => item.Uuid === visitProduct?.StockID)
                    const stockdefine = (stockdefines || []).find(item => item.Uuid === stock?.StockdefineID)

                    return <>
                        <Form.Group key={field.id} widths={'equal'} className='!my-0' >
                            <Form.Field className='!w-full !my-auto '>
                                <div className='flex flex-row justify-start items-center gap-4 whitespace-nowrap'>
                                    <div className='font-bold'>{`${t('Pages.Visits.Label.Productname')} :   `}</div>
                                    <div>{stockdefine?.Productname}</div>
                                </div>
                                <div className='flex flex-row justify-start items-center gap-4 whitespace-nowrap'>
                                    <div className='font-bold'>{`${t('Pages.Visits.Label.Barcodeno')} :   `}</div>
                                    <div>{stockdefine?.Barcodeno}</div>
                                </div>
                                <div className='flex flex-row justify-start items-center gap-4 whitespace-nowrap'>
                                    <div className='font-bold'>{`${t('Pages.Visits.Label.RequestedAmount')} :   `}</div>
                                    <div>{visitProduct?.Amount}</div>
                                </div>
                            </Form.Field>
                            <VisitAppForm.Input name={`Returnedproducts.${index}.Amount`} label={index === 0 ? t('Pages.Visits.Columns.Returnamount') : undefined} type='number' inputProps={{ min: 0, max: field.Amount }} required={t('Pages.Visits.Messages.AmountReqired')}
                                rules={{
                                    validate: (value: any) => {
                                        if (validator.isNumber(value)) {
                                            if (value > (visitProduct?.Amount ?? 0)) {
                                                return t('Pages.Visits.Messages.ReturnAmountBigger')
                                            }
                                            return true
                                        } else {
                                            return t('Pages.Visits.Messages.AmountReqired')
                                        }
                                    }
                                }} />
                            <VisitAppForm.Input name={`Returnedproducts.${index}.Description`} label={index === 0 ? t('Pages.Visits.Columns.Description') : undefined} />
                        </Form.Group>
                        <Divider key={field.id}/>
                    </>
                })}
            </Form>
        </Contentwrapper>
    </Pagewrapper >
}
export default VisitCompleteStepProduct