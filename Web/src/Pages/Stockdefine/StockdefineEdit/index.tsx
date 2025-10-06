import { useEditStockdefineMutation, useLazyGetStockdefineQuery } from '@Api/Stockdefine'
import { StockdefineEditRequest } from '@Api/Stockdefine/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Form } from 'semantic-ui-react'

const StockdefineAppForm = createAppForm<StockdefineEditRequest>()

const StockdefineEdit: React.FC = () => {

    const { t } = useTranslation()

    const { Id } = useParams()
    const navigate = useNavigate()

    const [GetStockdefine, { isFetching }] = useLazyGetStockdefineQuery()
    const [EditStockdefine, { isLoading }] = useEditStockdefineMutation()

    const methods = useForm<StockdefineEditRequest>({
        mode: 'onChange',
    })

    const { getValues, formState, trigger, reset, } = methods

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                EditStockdefine(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Stockdefines.Page.Header'),
                            Description: t('Pages.Stockdefines.Messages.UpdateSuccess')
                        })
                        navigate(Paths.Stockdefines)
                    })
            } else {
                CheckForm(formState, t('Pages.Stockdefines.Page.Header'))
            }
        })
    }


    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetStockdefine({ Uuid: Id })
                .unwrap()
                .then((data) => {
                    reset({
                        ...data,
                        Description: data.Description ?? undefined
                    })
                })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Stockdefines.Page.Header'),
                Description: t('Pages.Stockdefines.Messages.UndefinedStockdefine')
            })
            navigate(Paths.Stockdefines)
        }
    }, [Id, GetStockdefine, navigate, reset, t])

    return <Pagewrapper isLoading={isFetching || isLoading} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Stockdefines.Page.Header')}
            AdditionalName={t('Pages.Stockdefines.Page.EditHeader')}
            PageUrl={Paths.Stockdefines}
        />
        <FormProvider<StockdefineEditRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name='Productname' label={t('Pages.Stockdefines.Columns.Productname')} required={t('Pages.Stockdefines.Messages.ProductnameRequired')} />
                        <StockdefineAppForm.Input name='Description' label={t('Pages.Stockdefines.Columns.Description')} />
                        <StockdefineAppForm.Input name='Brand' label={t('Pages.Stockdefines.Columns.Brand')} required={t('Pages.Stockdefines.Messages.BrandRequired')} />
                        <StockdefineAppForm.Input name='Model' label={t('Pages.Stockdefines.Columns.Model')} required={t('Pages.Stockdefines.Messages.ModelRequired')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name='Category' label={t('Pages.Stockdefines.Columns.Category')} required={t('Pages.Stockdefines.Messages.CategoryRequired')} />
                        <StockdefineAppForm.Input name='Diameter' label={t('Pages.Stockdefines.Columns.Diameter')} required={t('Pages.Stockdefines.Messages.DiameterRequired')} />
                        <StockdefineAppForm.Input name='Length' label={t('Pages.Stockdefines.Columns.Length')} required={t('Pages.Stockdefines.Messages.LengthRequired')} />
                        <StockdefineAppForm.Input name='Material' label={t('Pages.Stockdefines.Columns.Material')} required={t('Pages.Stockdefines.Messages.MaterialRequired')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name='Surfacetreatment' label={t('Pages.Stockdefines.Columns.Surfacetreatment')} required={t('Pages.Stockdefines.Messages.SurfacetreatmentRequired')} />
                        <StockdefineAppForm.Input name='Connectiontype' label={t('Pages.Stockdefines.Columns.Connectiontype')} required={t('Pages.Stockdefines.Messages.ConnectiontypeRequired')} />
                        <StockdefineAppForm.Input name='Suppliername' label={t('Pages.Stockdefines.Columns.Suppliername')} required={t('Pages.Stockdefines.Messages.SuppliernameRequired')} />
                        <StockdefineAppForm.Input name='Suppliercontact' label={t('Pages.Stockdefines.Columns.Suppliercontact')} required={t('Pages.Stockdefines.Messages.SuppliercontactRequired')} />
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
                text={t('Common.Button.Update')}
                onClick={() => submit()}
            />
        </FormFooter>
    </Pagewrapper >
}
export default StockdefineEdit