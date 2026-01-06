import { useGetStocksQuery } from '@Api/Stock'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { VisitUpdateStocksRequest } from '@Api/Visit/type'
import { useGetWarehousesQuery } from '@Api/Warehouse'
import Title from '@Components/Common/Title'
import { createAppForm } from '@Utils/CreateAppForm'
import validator from '@Utils/Validator'
import React, { useMemo } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { DropdownItemProps, Form, Icon } from 'semantic-ui-react'

const VisitAppForm = createAppForm<VisitUpdateStocksRequest>()

const VisitUpdateProductsForm: React.FC = () => {

    const { t } = useTranslation()

    const { watch, setValue } = useFormContext<VisitUpdateStocksRequest>()

    const selectedStocks = watch('Stocks')

    const { fields, append, remove } = useFieldArray<VisitUpdateStocksRequest>({ name: 'Stocks' })

    const { data: warehouses, isFetching: isWarehousesFetching } = useGetWarehousesQuery({ isActive: 1 })
    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1 })
    const { data: stockdefines, isFetching: isStocksdefinesFetching } = useGetStockdefinesQuery({ isActive: 1 })

    const warehouseOpiton: DropdownItemProps[] = useMemo(() => {
        return (warehouses || []).map(item => {
            return {
                value: item.Uuid,
                text: item.Name,
            }
        })
    }, [warehouses])

    const stockOpiton: DropdownItemProps[] = useMemo(() => {
        return (stocks || []).map(item => {
            const define = (stockdefines || []).find(u => u.Uuid === item.StockdefineID)
            return {
                value: item.Uuid,
                text: `${define?.Brand} ${define?.Productname} ($${define?.Barcodeno}) Depoda ${item.TotalAmount} Adet`,
                warehouseID: item.WarehouseID
            }
        })
    }, [stocks, stockdefines])

    return <>
        <Title
            PageName={"Ürünler"}
            additionalButtons={[{
                name: t('Pages.Visits.Label.Addstock'),
                onClick: () => append({
                    Amount: 0,
                    Description: '',
                    WarehouseID: '',
                    Uuid: ''
                }),
            }]}
        />
        <Form loading={isStocksFetching || isStocksdefinesFetching || isWarehousesFetching}>
            {fields.map((field, index) => {

                const selectedStock = selectedStocks ? selectedStocks[index] : null

                return <Form.Group key={field.id} widths={'equal'} className='!my-0'>
                    <VisitAppForm.Select name={`Stocks.${index}.WarehouseID`}
                        label={index === 0 ? t('Pages.Visits.Columns.WarehouseID') : undefined}
                        options={warehouseOpiton}
                        required={t('Pages.Visits.Messages.WarehouseRequired')}
                        additionalOnchange={() => {
                            setValue(`Stocks.${index}.Uuid`, '')
                            setValue(`Stocks.${index}.Amount`, 0)
                        }}
                        searchable
                    />
                    <VisitAppForm.Select
                        name={`Stocks.${index}.Uuid`}
                        label={index === 0 ? t('Pages.Visits.Columns.StockProductName') : undefined}
                        options={stockOpiton.filter(u => u.warehouseID === selectedStock?.WarehouseID)}
                        required={t('Pages.Visits.Messages.StockProductNameReqired')}
                        disabled={!validator.isUUID(selectedStock?.WarehouseID)}
                        searchable
                    />
                    <VisitAppForm.Input
                        name={`Stocks.${index}.Amount`} label={index === 0 ? t('Pages.Visits.Columns.Amount') : undefined}
                        type='number'
                        inputProps={{ min: 0 }}
                        required={t('Pages.Visits.Messages.AmountReqired')}
                        rules={{
                            validate: (value: any) => {
                                if (validator.isNumber(value) && value > 0) {
                                    return true
                                } else {
                                    return t('Pages.Visits.Messages.AmountReqired')
                                }
                            }
                        }}
                    />
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
export default VisitUpdateProductsForm