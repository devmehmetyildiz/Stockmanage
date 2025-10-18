import { useGetStocksQuery } from '@Api/Stock'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { VisitCreateRequest } from '@Api/Visit/type'
import { useGetWarehousesQuery } from '@Api/Warehouse'
import Title from '@Components/Common/Title'
import { createAppForm } from '@Utils/CreateAppForm'
import validator from '@Utils/Validator'
import React, { useEffect, useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DropdownItemProps, Form, Icon } from 'semantic-ui-react'

const VisitAppForm = createAppForm<VisitCreateRequest>()

const VisitCreateStockForm: React.FC = () => {

    const { t } = useTranslation()

    const { watch, setValue } = useFormContext<VisitCreateRequest>()

    const { fields, append, remove } = useFieldArray<VisitCreateRequest>({ name: 'Stocks' })

    const [WarehouseID] = watch(['WarehouseID'])

    const { data: warehouses, isFetching: isWarehousesFetching } = useGetWarehousesQuery({ isActive: 1 })
    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1, WarehouseID }, { skip: !validator.isUUID(WarehouseID) })
    const { data: stockdefines, isFetching: isStocksdefinesFetching } = useGetStockdefinesQuery({ isActive: 1 })

    const warehouseOpiton: DropdownItemProps[] = useMemo(() => {
        return (warehouses || []).map(item => {
            return {
                value: item.Uuid,
                text: item.Name
            }
        })
    }, [warehouses])

    const stockOpiton: DropdownItemProps[] = useMemo(() => {
        return (stocks || []).map(item => {
            const define = (stockdefines || []).find(u => u.Uuid === item.StockdefineID)
            return {
                value: item.Uuid,
                text: `${define?.Productname} (${define?.Barcodeno}) Depoda ${item.TotalAmount} Adet`
            }
        })
    }, [stocks, stockdefines])

    useEffect(() => {
        if (WarehouseID) {
            setValue('Stocks', [])
        }
    }, [WarehouseID, setValue])

    return <>
        <Title
            PageName={"Ürünler"}
            additionalButtons={[{
                name: t('Pages.Visits.Label.Addstock'),
                onClick: () => append({
                    Amount: 0,
                    Description: '',
                    Uuid: ''
                }),
                disabled: !validator.isUUID(WarehouseID)
            }]}
        />
        <Form loading={isStocksFetching || isWarehousesFetching || isStocksdefinesFetching}>
            <Form.Group widths={'equal'}>
                <VisitAppForm.Select name={`WarehouseID`} label={t('Pages.Visits.Columns.WarehouseID')} options={warehouseOpiton} />
            </Form.Group>
            {fields.map((field, index) => {
                return <Form.Group key={field.id} widths={'equal'} className='!my-0'>
                    <VisitAppForm.Select name={`Stocks.${index}.Uuid`} label={index === 0 ? t('Pages.Visits.Columns.StockProductName') : undefined} options={stockOpiton} required={t('Pages.Visits.Messages.StockProductNameReqired')} />
                    <VisitAppForm.Input name={`Stocks.${index}.Amount`} label={index === 0 ? t('Pages.Visits.Columns.Amount') : undefined} type='number' inputProps={{ min: 0 }} required={t('Pages.Visits.Messages.AmountReqired')}
                        rules={{
                            validate: (value: any) => {
                                if (validator.isNumber(value) && value > 0) {
                                    return true
                                } else {
                                    return t('Pages.Visits.Messages.AmountReqired')
                                }
                            }
                        }} />
                    <VisitAppForm.Input name={`Stocks.${index}.Description`} label={index === 0 ? t('Pages.Visits.Columns.Description') : undefined} />
                    <Form.Field className='!w-auto'>
                        {index === 0 ? <label className='!text-[#000000DE]'>{t('Common.Columns.delete')}</label> : null}
                        <div
                            onClick={() => remove(index)}
                            className='flex justify-center items-center cursor-pointer  !mt-6'>
                            <Icon name='remove' color='red' circular />
                        </div>
                    </Form.Field>
                </Form.Group>
            })}
        </Form>
    </>
}
export default VisitCreateStockForm