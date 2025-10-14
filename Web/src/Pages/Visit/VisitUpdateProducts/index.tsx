import { useEditVisitStocksMutation, useLazyGetVisitQuery } from '@Api/Visit'
import { VisitUpdateStocksRequest } from '@Api/Visit/type'
import { useGetWarehousesQuery } from '@Api/Warehouse'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import VisitUpdateProductsForm from '@Components/Visit/VisitUpdateProduct/VisitUpdateProductsForm'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { DropdownItemProps, Form } from 'semantic-ui-react'

const VisitAppForm = createAppForm<VisitUpdateStocksRequest>()

const VisitUpdateProducts: React.FC = () => {

    const { t } = useTranslation()

    const { Id } = useParams()
    const navigate = useNavigate()

    const [GetVisit, { isFetching, data }] = useLazyGetVisitQuery()
    const [EditVisitStocks, { isLoading }] = useEditVisitStocksMutation()

    const { data: warehouses, isFetching: isWarehousesFetching } = useGetWarehousesQuery({ isActive: 1 })

    const warehouseOpiton: DropdownItemProps[] = useMemo(() => {
        return (warehouses || []).map(item => {
            return {
                value: item.Uuid,
                text: item.Name
            }
        })
    }, [warehouses])

    const methods = useForm<VisitUpdateStocksRequest>({
        mode: 'onChange',
    })


    const { getValues, formState, trigger, reset, setValue } = methods

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                EditVisitStocks(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Visits.Page.Header'),
                            Description: t('Pages.Visits.Messages.UpdateSuccess')
                        })
                        navigate(Paths.Visits)
                    })
            } else {
                CheckForm(formState, t('Pages.Visits.Page.Header'))
            }
        })
    }


    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetVisit({ Uuid: Id })
                .unwrap()
                .then((data) => {
                    reset({
                        VisitID: data.Uuid,
                        WarehouseID: data.WarehouseID,
                        Stocks: (data.Products || []).map(item => {
                            return {
                                Uuid: item.StockID,
                                Amount: item.Amount,
                                Description: item.Description
                            }
                        })
                    })
                })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Visits.Page.Header'),
                Description: t('Pages.Visits.Messages.UndefinedVisit')
            })
            navigate(Paths.Visits)
        }
    }, [Id, GetVisit, navigate, reset, t])

    return <Pagewrapper isLoading={isFetching || isLoading || isWarehousesFetching} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Visits.Page.EditProductsHeader')}
            AdditionalName={data?.Visitcode}
            PageUrl={Paths.Visits}
        />
        <FormProvider<VisitUpdateStocksRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <VisitAppForm.Select name={`WarehouseID`} label={t('Pages.Visits.Columns.WarehouseID')} options={warehouseOpiton} additionalOnchange={() => setValue('Stocks', [])} />
                    </Form.Group>
                </Form>
            </Contentwrapper>
            <Contentwrapper>
                <VisitUpdateProductsForm />
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
                text={t('Common.Button.Update')}
                onClick={() => submit()}
            />
        </FormFooter>
    </Pagewrapper >
}
export default VisitUpdateProducts