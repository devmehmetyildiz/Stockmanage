import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import { useGetLocationsQuery } from '@Api/Location'
import { useGetPaymenttypesQuery } from '@Api/Paymenttype'
import { useEditVisitDefinesMutation, useLazyGetVisitQuery } from '@Api/Visit'
import { VisitUpdateDefinesRequest } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import { SuppressDate } from '@Utils/FormatDate'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { DropdownItemProps, Form } from 'semantic-ui-react'

const VisitAppForm = createAppForm<VisitUpdateDefinesRequest>()

const VisitUpdateDefines: React.FC = () => {

    const { t } = useTranslation()

    const { Id } = useParams()
    const navigate = useNavigate()

    const [GetVisit, { isFetching }] = useLazyGetVisitQuery()
    const [EditVisitDefines, { isLoading }] = useEditVisitDefinesMutation()

    const { data: doctordefines, isFetching: isDoctordefinesFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })
    const { data: paymenttypes, isFetching: isPaymenttypesFetching } = useGetPaymenttypesQuery({ isActive: 1 })

    const locationOpiton: DropdownItemProps[] = useMemo(() => {
        return (locations || []).map(item => {
            return {
                value: item.Uuid,
                text: item.Name
            }
        })
    }, [locations])

    const paymenttypeOpiton: DropdownItemProps[] = useMemo(() => {
        return (paymenttypes || []).map(item => {
            return {
                value: item.Uuid,
                text: item.Name
            }
        })
    }, [paymenttypes])

    const doctorOpiton: DropdownItemProps[] = useMemo(() => {
        return (doctordefines || []).map(item => {
            const doctordefineName = `${item.Name} ${item.Surname}`
            return {
                value: item.Uuid,
                text: doctordefineName
            }
        })
    }, [doctordefines])

    const methods = useForm<VisitUpdateDefinesRequest>({
        mode: 'onChange',
    })

    const { getValues, formState, trigger, reset, watch } = methods

    const [Visitcode] = watch(['Visitcode'])

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const data = getValues()
                const visitDate = new Date(data.Visitdate)
                visitDate.setHours(0, 0, 0, 0)
                EditVisitDefines({
                    ...data,
                    Visitdate: visitDate
                })
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
                        DoctorID: data.DoctorID,
                        LocationID: data.LocationID,
                        Notes: data.Notes,
                        UserID: data.UserID,
                        Visitcode: data.Visitcode,
                        Visitdate: SuppressDate(data.Visitdate),
                        VisitID: data.Uuid,
                        PaymenttypeID: data.PaymenttypeID,
                        Scheduledpayment: data.Scheduledpayment
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

    return <Pagewrapper isLoading={isFetching || isLoading || isDoctordefinesFetching || isLocationsFetching || isPaymenttypesFetching} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Visits.Page.EditDefinesHeader')}
            AdditionalName={Visitcode}
            PageUrl={Paths.Visits}
        />
        <FormProvider<VisitUpdateDefinesRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <VisitAppForm.Select name='LocationID' label={t('Pages.Visits.Columns.LocationID')} required={t('Pages.Visits.Messages.LocationIDRequired')} options={locationOpiton} />
                        <VisitAppForm.Select name='DoctorID' label={t('Pages.Visits.Columns.DoctorID')} required={t('Pages.Visits.Messages.DoctorIDRequired')} options={doctorOpiton} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <VisitAppForm.Input name='Visitdate' label={t('Pages.Visits.Columns.Visitdate')} type='date' required={t('Pages.Visits.Messages.VisitdateReqired')} />
                        <VisitAppForm.Input name='Description' label={t('Pages.Visits.Columns.Description')} />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <VisitAppForm.Select name='PaymenttypeID' label={t('Pages.Visits.Columns.PaymenttypeID')} options={paymenttypeOpiton} />
                        <VisitAppForm.Input name='Scheduledpayment' label={t('Pages.Visits.Columns.Scheduledpayment')} type='number' inputProps={{ min: 0 }} showPriceIcon />
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
export default VisitUpdateDefines