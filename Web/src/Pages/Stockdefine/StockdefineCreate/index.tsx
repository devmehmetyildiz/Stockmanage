import { useAddStockdefineMutation } from '@Api/Stockdefine'
import { StockdefineAddRequest } from '@Api/Stockdefine/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Form } from 'semantic-ui-react'

const StockdefineAppForm = createAppForm<StockdefineAddRequest>()

const StockdefineCreate: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const methods = useForm<StockdefineAddRequest>({
        mode: 'onChange',
    })

    const { getValues, formState, trigger } = methods

    const [AddStockdefine, { isLoading }] = useAddStockdefineMutation()

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                AddStockdefine(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Stockdefines.Page.Header'),
                            Description: t('Pages.Stockdefines.Messages.AddSuccess')
                        })
                        navigate(Paths.Stockdefines)
                    })
            } else {
                CheckForm(formState, t('Pages.Stockdefines.Page.Header'))
            }
        })
    }


    return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Stockdefines.Page.Header')}
            AdditionalName={t('Pages.Stockdefines.Page.CreateHeader')}
            PageUrl={Paths.Stockdefines}
        />
        <FormProvider<StockdefineAddRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name='Productname' label={t('Pages.Stockdefines.Columns.Productname')} required={t('Pages.Stockdefines.Messages.ProductnameRequired')} />
                        <StockdefineAppForm.Input name='Barcodeno' label={t('Pages.Stockdefines.Columns.Barcodeno')} required={t('Pages.Stockdefines.Messages.BarcodenoRequired')} />
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
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name='Description' label={t('Pages.Stockdefines.Columns.Description')} />
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
export default StockdefineCreate