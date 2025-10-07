import { useAddWarehouseMutation } from '@Api/Warehouse'
import { WarehouseAddRequest } from '@Api/Warehouse/type'
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

const WarehouseAppForm = createAppForm<WarehouseAddRequest>()

const WarehouseCreate: React.FC = () => {

  const { t } = useTranslation()

  const navigate = useNavigate()

  const methods = useForm<WarehouseAddRequest>({
    mode: 'onChange',
  })

  const { getValues, formState, trigger } = methods

  const [AddWarehouse, { isLoading }] = useAddWarehouseMutation()

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        AddWarehouse(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Warehouses.Page.Header'),
              Description: t('Pages.Warehouses.Messages.AddSuccess')
            })
            navigate(Paths.Warehouses)
          })
      } else {
        CheckForm(formState, t('Pages.Warehouses.Page.Header'))
      }
    })
  }


  return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Warehouses.Page.Header')}
      AdditionalName={t('Pages.Warehouses.Page.CreateHeader')}
      PageUrl={Paths.Warehouses}
    />
    <FormProvider<WarehouseAddRequest> {...methods}>
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <WarehouseAppForm.Input name='Name' label={t('Pages.Warehouses.Columns.Name')} required={t('Pages.Warehouses.Messages.NameRequired')} />
            <WarehouseAppForm.Input name='Description' label={t('Pages.Warehouses.Columns.Description')} />
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
export default WarehouseCreate