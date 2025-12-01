import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import { useGetLocationsQuery } from '@Api/Location'
import { useGetPaymenttypesQuery } from '@Api/Paymenttype'
import { useGetMetaQuery } from '@Api/Profile'
import { useGetUsersListQuery } from '@Api/User'
import { useCreateVisitMutation } from '@Api/Visit'
import { VisitCreateRequest } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import VisitCreateStockForm from '@Components/Visit/VisitCreate/VisitCreateStockForm'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React, { useEffect, useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DropdownItemProps, Form } from 'semantic-ui-react'

const VisitAppForm = createAppForm<VisitCreateRequest>()

const VisitCreate: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const methods = useForm<VisitCreateRequest>({
        mode: 'onChange',
    })

    const { getValues, formState, trigger, setValue } = methods

    const [CreateVisit, { isLoading }] = useCreateVisitMutation()

    const { data: meta, isFetching: isMetaFetching } = useGetMetaQuery()
    const { data: doctordefines, isFetching: isDoctordefinesFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })
    const { data: paymenttypes, isFetching: isPaymenttypesFetching } = useGetPaymenttypesQuery({ isActive: 1 })
    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1, Isworker: 1 })

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const data = getValues()
                const visitDate = new Date(data.Visitdate)
                visitDate.setHours(0, 0, 0, 0)
                CreateVisit({
                    ...data,
                    Visitdate: visitDate,
                })
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Visits.Page.Header'),
                            Description: t('Pages.Visits.Messages.AddSuccess')
                        })
                        navigate(Paths.Visits)
                    })
            } else {
                CheckForm(formState, t('Pages.Visits.Page.Header'))
            }
        })
    }

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

    const userOption: DropdownItemProps[] = useMemo(() => {
        return (users || []).map(item => {
            const userName = `${item.Name} ${item.Surname}`
            return {
                value: item.Uuid,
                text: userName
            }
        })
    }, [users])

    useEffect(() => {
        if (meta) {
            setValue('WorkerUserID', meta.Uuid)
        }
    }, [meta, setValue])

    return <Pagewrapper isLoading={isLoading || isDoctordefinesFetching || isLocationsFetching || isPaymenttypesFetching || isMetaFetching || isUsersFetching} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Visits.Page.Header')}
            AdditionalName={t('Pages.Visits.Page.CreateHeader')}
            PageUrl={Paths.Visits}
        />
        <FormProvider<VisitCreateRequest> {...methods}>
            <Contentwrapper className='z-20'>
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
                    <Form.Group widths={'equal'}>
                        <VisitAppForm.Select name='ResponsibleUserID' label={t('Pages.Visits.Columns.ResponsibleUserID')} options={userOption} required={t('Pages.Visits.Messages.ResponsibleUserIDRequired')} />
                    </Form.Group>
                </Form>
            </Contentwrapper>
            <Contentwrapper className='z-10'>
                <VisitCreateStockForm />
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
export default VisitCreate