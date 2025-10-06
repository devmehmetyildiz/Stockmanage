import { useEditDoctordefineMutation, useLazyGetDoctordefineQuery } from '@Api/Doctordefine'
import { DoctordefineEditRequest } from '@Api/Doctordefine/type'
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
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { DropdownItemProps, Form } from 'semantic-ui-react'

const DoctordefineAppForm = createAppForm<DoctordefineEditRequest>()

const DoctordefineEdit: React.FC = () => {

  const { t } = useTranslation()

  const { Id } = useParams()
  const navigate = useNavigate()

  const [GetDoctordefine, { isFetching }] = useLazyGetDoctordefineQuery()
  const [EditDoctordefine, { isLoading }] = useEditDoctordefineMutation()
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

  const methods = useForm<DoctordefineEditRequest>({
    mode: 'onChange',
  })

  const { getValues, formState, trigger, reset, } = methods

  const submit = () => {
    trigger().then((valid) => {
      if (valid) {
        EditDoctordefine(getValues())
          .unwrap()
          .then(() => {
            Pushnotification({
              Type: 'Success',
              Subject: t('Pages.Doctordefines.Page.Header'),
              Description: t('Pages.Doctordefines.Messages.UpdateSuccess')
            })
            navigate(Paths.Doctordefines)
          })
      } else {
        CheckForm(formState, t('Pages.Doctordefines.Page.Header'))
      }
    })
  }


  useEffect(() => {
    if (Id && validator.isUUID(Id)) {
      GetDoctordefine({ Uuid: Id })
        .unwrap()
        .then((data) => {
          reset({
            ...data,
            CountryID: data.CountryID ?? undefined,
            Address: data.Address ?? undefined,
            Gender: data.Gender ?? undefined,
            Phonenumber1: data.Phonenumber1 ?? undefined,
            Phonenumber2: data.Phonenumber2 ?? undefined,
            Email: data.Email ?? undefined,
            Specialization: data.Specialization ?? undefined,
            Role: data.Role ?? undefined,
            Description: data.Description ?? undefined,
          })
        })
    } else {
      Pushnotification({
        Type: 'Error',
        Subject: t('Pages.Doctordefines.Page.Header'),
        Description: t('Pages.Doctordefines.Messages.UndefinedDoctordefine')
      })
      navigate(Paths.Doctordefines)
    }
  }, [Id, GetDoctordefine, navigate, reset, t])

  const countryIdValidation = (value: any) => {
    if (validator.isCountryID(value) || (value || '').length <= 0) {
      return true
    } else {
      return t('Pages.Doctordefines.Messages.CountryIDRequired')
    }
  }

  return <Pagewrapper isLoading={isFetching || isLoading || isLocationsFetching} direction='vertical' alignTop gap={4}>
    <Title
      PageName={t('Pages.Doctordefines.Page.Header')}
      AdditionalName={t('Pages.Doctordefines.Page.EditHeader')}
      PageUrl={Paths.Doctordefines}
    />
    <FormProvider<DoctordefineEditRequest> {...methods}>
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
        text={t('Common.Button.Update')}
        onClick={() => submit()}
      />
    </FormFooter>
  </Pagewrapper >
}
export default DoctordefineEdit