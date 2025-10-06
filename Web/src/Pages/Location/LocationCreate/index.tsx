import { useAddLocationMutation } from '@Api/Location'
import { LocationAddRequest } from '@Api/Location/type'
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

const LocationAppForm = createAppForm<LocationAddRequest>()

const LocationCreate: React.FC = () => {

  const { t } = useTranslation()

  const navigate = useNavigate()

  const methods = useForm<LocationAddRequest>({
    mode: 'onChange',
  })

  const { getValues, formState, trigger } = methods

  const [AddLocation, { isLoading }] = useAddLocationMutation()

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        AddLocation(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Locations.Page.Header'),
              Description: t('Pages.Locations.Messages.AddSuccess')
            })
            navigate(Paths.Locations)
          })
      } else {
        CheckForm(formState, t('Pages.Locations.Page.Header'))
      }
    })
  }


  return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Locations.Page.Header')}
      AdditionalName={t('Pages.Locations.Page.CreateHeader')}
      PageUrl={Paths.Locations}
    />
    <FormProvider<LocationAddRequest> {...methods}>
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
        text={t('Common.Button.Create')}
        onClick={() => submit()}
      />
    </FormFooter>
  </Pagewrapper >
}
export default LocationCreate