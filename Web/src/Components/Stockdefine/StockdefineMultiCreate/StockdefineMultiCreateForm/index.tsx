import { StockdefineAddRequestWrapper } from '@Api/Stockdefine/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import { createAppForm } from '@Utils/CreateAppForm'
import React from 'react'
import { useFieldArray } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'semantic-ui-react'

interface StockdefineMultiCreateFormProps {
}

const StockdefineAppForm = createAppForm<StockdefineAddRequestWrapper>()

const StockdefineMultiCreateForm: React.FC<StockdefineMultiCreateFormProps> = () => {

    const { t } = useTranslation()
    const { fields, remove, append } = useFieldArray({ name: 'DefineList' })

    const handleAdd = () => {
        append({
        })
    }

    const handleRemove = (index: number) => {
        remove(index)
    }

    return <Pagewrapper dynamicHeight alignTop gap={4} direction='vertical' >
        {fields.map((item, index) => {
            return <Contentwrapper className='w-full' key={item.id}>
                <Title
                    PageName={`${t('Pages.Stockdefines.Label.Record')} ${index + 1}`}
                    additionalButtons={[
                        {
                            onClick: () => handleRemove(index),
                            name: t('Common.Columns.delete'),
                        }
                    ]}
                />
                <Form>
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name={`DefineList.${index}.Productname`} label={t('Pages.Stockdefines.Columns.Productname')} required={t('Pages.Stockdefines.Messages.ProductnameRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Barcodeno`} label={t('Pages.Stockdefines.Columns.Barcodeno')} required={t('Pages.Stockdefines.Messages.BarcodenoRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Brand`} label={t('Pages.Stockdefines.Columns.Brand')} required={t('Pages.Stockdefines.Messages.BrandRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Model`} label={t('Pages.Stockdefines.Columns.Model')} required={t('Pages.Stockdefines.Messages.ModelRequired')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name={`DefineList.${index}.Category`} label={t('Pages.Stockdefines.Columns.Category')} required={t('Pages.Stockdefines.Messages.CategoryRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Diameter`} label={t('Pages.Stockdefines.Columns.Diameter')} required={t('Pages.Stockdefines.Messages.DiameterRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Length`} label={t('Pages.Stockdefines.Columns.Length')} required={t('Pages.Stockdefines.Messages.LengthRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Material`} label={t('Pages.Stockdefines.Columns.Material')} required={t('Pages.Stockdefines.Messages.MaterialRequired')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name={`DefineList.${index}.Surfacetreatment`} label={t('Pages.Stockdefines.Columns.Surfacetreatment')} required={t('Pages.Stockdefines.Messages.SurfacetreatmentRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Connectiontype`} label={t('Pages.Stockdefines.Columns.Connectiontype')} required={t('Pages.Stockdefines.Messages.ConnectiontypeRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Suppliername`} label={t('Pages.Stockdefines.Columns.Suppliername')} required={t('Pages.Stockdefines.Messages.SuppliernameRequired')} />
                        <StockdefineAppForm.Input name={`DefineList.${index}.Suppliercontact`} label={t('Pages.Stockdefines.Columns.Suppliercontact')} required={t('Pages.Stockdefines.Messages.SuppliercontactRequired')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <StockdefineAppForm.Input name={`DefineList.${index}.Description`} label={t('Pages.Stockdefines.Columns.Description')} />
                    </Form.Group>
                </Form>
            </Contentwrapper>
        })}
        <FormFooter >
            <div className='w-full flex justify-end items-end'>
                <FormButton
                    text={t('Pages.Stockdefines.Label.AddNew')}
                    onClick={() => handleAdd()}
                />
            </div>
        </FormFooter>
    </Pagewrapper>
}
export default StockdefineMultiCreateForm