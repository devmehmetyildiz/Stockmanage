import { useEditWarehouseMutation, useLazyGetWarehouseQuery } from '@Api/Warehouse'
import { WarehouseEditRequest } from '@Api/Warehouse/type'
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

const WarehouseAppForm = createAppForm<WarehouseEditRequest>()

const WarehouseEdit: React.FC = () => {

  const { t } = useTranslation()

  const { Id } = useParams()
  const navigate = useNavigate()

  const [GetWarehouse, { isFetching }] = useLazyGetWarehouseQuery()
  const [EditWarehouse, { isLoading }] = useEditWarehouseMutation()

  const methods = useForm<WarehouseEditRequest>({
    mode: 'onChange',
  })

  const { getValues, formState, trigger, reset, } = methods

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        EditWarehouse(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Warehouses.Page.Header'),
              Description: t('Pages.Warehouses.Messages.UpdateSuccess')
            })
            navigate(Paths.Warehouses)
          })
      } else {
        CheckForm(formState, t('Pages.Warehouses.Page.Header'))
      }
    })
  }


  useEffect(() => {
    if (Id && validator.isUUID(Id)) {
      GetWarehouse({ Uuid: Id })
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
        Subject: t('Pages.Warehouses.Page.Header'),
        Description: t('Pages.Warehouses.Messages.UndefinedWarehouse')
      })
      navigate(Paths.Warehouses)
    }
  }, [Id, GetWarehouse, navigate, reset, t])

  return <Pagewrapper isLoading={isFetching || isLoading} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Warehouses.Page.Header')}
      AdditionalName={t('Pages.Warehouses.Page.EditHeader')}
      PageUrl={Paths.Warehouses}
    />
    <FormProvider<WarehouseEditRequest> {...methods}>
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
        text={t('Common.Button.Update')}
        onClick={() => submit()}
      />
    </FormFooter>
  </Pagewrapper >
}
export default WarehouseEdit