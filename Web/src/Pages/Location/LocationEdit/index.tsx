import { useEditLocationMutation, useLazyGetLocationQuery } from '@Api/Location'
import { LocationEditRequest } from '@Api/Location/type'
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

const LocationAppForm = createAppForm<LocationEditRequest>()

const LocationEdit: React.FC = () => {

  const { t } = useTranslation()

  const { Id } = useParams()
  const navigate = useNavigate()

  const [GetLocation, { isFetching }] = useLazyGetLocationQuery()
  const [EditLocation, { isLoading }] = useEditLocationMutation()

  const methods = useForm<LocationEditRequest>({
    mode: 'onChange',
  })

  const { getValues, formState, trigger, reset, } = methods

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        EditLocation(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Locations.Page.Header'),
              Description: t('Pages.Locations.Messages.UpdateSuccess')
            })
            navigate(Paths.Locations)
          })
      } else {
        CheckForm(formState, t('Pages.Locations.Page.Header'))
      }
    })
  }


  useEffect(() => {
    if (Id && validator.isUUID(Id)) {
      GetLocation({ Uuid: Id })
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
        Subject: t('Pages.Locations.Page.Header'),
        Description: t('Pages.Locations.Messages.UndefinedLocation')
      })
      navigate(Paths.Locations)
    }
  }, [Id, GetLocation, navigate, reset, t])

  return <Pagewrapper isLoading={isFetching || isLoading} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Locations.Page.Header')}
      AdditionalName={t('Pages.Locations.Page.EditHeader')}
      PageUrl={Paths.Locations}
    />
    <FormProvider<LocationEditRequest> {...methods}>
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <LocationAppForm.Input name='Name' label={t('Pages.Locations.Columns.Name')} required={t('Pages.Locations.Messages.NameRequired')} />
            <LocationAppForm.Input name='Description' label={t('Pages.Locations.Columns.Description')} />
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
export default LocationEdit