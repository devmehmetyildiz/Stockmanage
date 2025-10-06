import { useAddDoctordefineMutation } from '@Api/Doctordefine'
import { DoctordefineAddRequest } from '@Api/Doctordefine/type'
import { useGetLocationsQuery } from '@Api/Location'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import { GENDER_OPTION_MEN, GENDER_OPTION_WOMEN } from '@Constant/index'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DropdownItemProps, Form } from 'semantic-ui-react'

const DoctordefineAppForm = createAppForm<DoctordefineAddRequest>()

const DoctordefineCreate: React.FC = () => {

  const { t } = useTranslation()

  const navigate = useNavigate()

  const methods = useForm<DoctordefineAddRequest>({
    mode: 'onChange',
    defaultValues: {
      Status: true
    }
  })

  const { getValues, formState, trigger } = methods

  const [AddDoctordefine, { isLoading }] = useAddDoctordefineMutation()
  const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })

  const locationOpiton: DropdownItemProps[] = useMemo(() => {
    return (locations || []).map(item => {
      return {
        value: item.Uuid,
        text: item.Name
      }
    })
  }, [locations])

  const genderOpiton: DropdownItemProps[] = [
    { text: t('Option.Genderoption.Men'), value: GENDER_OPTION_MEN },
    { text: t('Option.Genderoption.Women'), value: GENDER_OPTION_WOMEN },
  ]

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        AddDoctordefine(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Doctordefines.Page.Header'),
              Description: t('Pages.Doctordefines.Messages.AddSuccess')
            })
            navigate(Paths.Doctordefines)
          })
      } else {
        CheckForm(formState, t('Pages.Doctordefines.Page.Header'))
      }
    })
  }

  const countryIdValidation = (value: any) => {
    if (validator.isCountryID(value) || (value || '').length <= 0) {
      return true
    } else {
      return t('Pages.Doctordefines.Messages.CountryIDRequired')
    }
  }

  return <Pagewrapper isLoading={isLoading || isLocationsFetching} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Doctordefines.Page.Header')}
      AdditionalName={t('Pages.Doctordefines.Page.CreateHeader')}
      PageUrl={Paths.Doctordefines}
    />
    <FormProvider<DoctordefineAddRequest> {...methods}>
      <Contentwrapper>
        <Form>
          <Form.Group widths={'equal'}>
            <DoctordefineAppForm.Input name='Name' label={t('Pages.Doctordefines.Columns.Name')} required={t('Pages.Doctordefines.Messages.NameRequired')} />
            <DoctordefineAppForm.Input name='Surname' label={t('Pages.Doctordefines.Columns.Surname')} required={t('Pages.Doctordefines.Messages.SurnameRequired')} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <DoctordefineAppForm.Input name='CountryID' label={t('Pages.Doctordefines.Columns.CountryID')} rules={{ validate: (value) => countryIdValidation(value) }} />
            <DoctordefineAppForm.Input name='Address' label={t('Pages.Doctordefines.Columns.Address')} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <DoctordefineAppForm.Select name='LocationID' label={t('Pages.Doctordefines.Columns.LocationID')} required={t('Pages.Doctordefines.Messages.LocationIDRequired')} options={locationOpiton} />
            <DoctordefineAppForm.Select name='Gender' label={t('Pages.Doctordefines.Columns.Gender')} options={genderOpiton} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <DoctordefineAppForm.Input name='Phonenumber1' label={t('Pages.Doctordefines.Columns.Phonenumber1')} />
            <DoctordefineAppForm.Input name='Phonenumber2' label={t('Pages.Doctordefines.Columns.Phonenumber2')} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <DoctordefineAppForm.Input name='Email' label={t('Pages.Doctordefines.Columns.Email')} />
            <DoctordefineAppForm.Input name='Specialization' label={t('Pages.Doctordefines.Columns.Specialization')} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <DoctordefineAppForm.Input name='Role' label={t('Pages.Doctordefines.Columns.Role')} />
            <DoctordefineAppForm.Input name='Description' label={t('Pages.Doctordefines.Columns.Description')} />
          </Form.Group>
          <Form.Group widths={'equal'}>
            <DoctordefineAppForm.Checkbox name='Status' label={t('Pages.Doctordefines.Columns.Status')} />
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
export default DoctordefineCreate