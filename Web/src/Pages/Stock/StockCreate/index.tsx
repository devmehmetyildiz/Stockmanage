import { useGetMetaQuery } from '@Api/Profile'
import { useCreateStockMutation } from '@Api/Stock'
import { StockCreateRequest } from '@Api/Stock/type'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { useGetWarehousesQuery } from '@Api/Warehouse'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import { STOCK_SOURCETYPE_USER } from '@Constant/index'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DropdownItemProps, Form } from 'semantic-ui-react'

const StockAppForm = createAppForm<StockCreateRequest>()

const StockCreate: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const methods = useForm<StockCreateRequest>({
        mode: 'onChange',
    })

    const { getValues, formState, trigger, reset } = methods

    const [CreateStock, { isLoading }] = useCreateStockMutation()

    const { data: meta, isFetching: isMetaFetching } = useGetMetaQuery()
    const { data: stockdefines, isFetching: isStockdefinesFetching } = useGetStockdefinesQuery({ isActive: 1 })
    const { data: warehouses, isFetching: isWarehousesFetching } = useGetWarehousesQuery({ isActive: 1 })

    const warehouseOpiton: DropdownItemProps[] = useMemo(() => {
        return (warehouses || []).map(item => {
            return {
                value: item.Uuid,
                text: item.Name
            }
        })
    }, [warehouses])

    const stockdefineOpiton: DropdownItemProps[] = useMemo(() => {
        return (stockdefines || []).map(item => {
            return {
                value: item.Uuid,
                text: `${item.Productname} (${item.Barcodeno})`
            }
        })
    }, [stockdefines])

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                CreateStock(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Stocks.Page.Header'),
                            Description: t('Pages.Stocks.Messages.AddSuccess')
                        })
                        navigate(Paths.Stocks)
                    })
            } else {
                CheckForm(formState, t('Pages.Stocks.Page.Header'))
            }
        })
    }

    useEffect(() => {
        if (meta) {
            reset({
                Sourcetype: STOCK_SOURCETYPE_USER,
                SourceID: meta.Uuid,
                Amount: 0,
                StockdefineID: '',
                WarehouseID: ''
            })
        }
    }, [meta, reset])

    return <Pagewrapper isLoading={isLoading || isWarehousesFetching || isStockdefinesFetching || isMetaFetching} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Stocks.Page.Header')}
            AdditionalName={t('Pages.Stocks.Page.CreateHeader')}
            PageUrl={Paths.Stocks}
        />
        <FormProvider<StockCreateRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <StockAppForm.Select name='WarehouseID' label={t('Pages.Stocks.Columns.WarehouseID')} required={t('Pages.Stocks.Messages.WarehouseIDRequired')} options={warehouseOpiton} />
                        <StockAppForm.Select name='StockdefineID' label={t('Pages.Stocks.Columns.StockdefineID')} required={t('Pages.Stocks.Messages.StockdefineIDRequired')} options={stockdefineOpiton} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <StockAppForm.Input name='Amount' label={t('Pages.Stocks.Columns.Amount')} required={t('Pages.Stocks.Messages.AmountRequired')} type='number' inputProps={{ min: 0 }}
                            rules={{
                                validate: (value: any) => {
                                    if (validator.isNumber(value) && value > 0) {
                                        return true
                                    } else {
                                        return t('Pages.Stocks.Messages.AmountRequired')
                                    }
                                }
                            }} />
                    </Form.Group>
                </Form>
            </Contentwrapper>
        </FormProvider>
        <FormFooter>
            <FormButton
                onClick={() => navigate(-1)}
                secondary
                text={t('Common.Button.Goback')}
            />
            <FormButton
                loading={isLoading}
                text={t('Common.Button.Create')}
                onClick={() => submit()}
            />
        </FormFooter>
    </Pagewrapper >
}
export default StockCreate