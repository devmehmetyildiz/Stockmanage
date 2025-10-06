import { LogAppReportRequest } from '@Api/Log/type'
import AppreportServiceUsages from '@Components/Appreport/AppreportServiceUsages'
import AppreportUserUsages from '@Components/Appreport/AppreportUserUsages'
import AppreportUserUsagesDaily from '@Components/Appreport/AppreportUserUsagesDaily'
import AppTab from '@Components/Common/AppTab'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import { SuppressDate } from '@Utils/FormatDate'
import validator from '@Utils/Validator'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'semantic-ui-react'

const AppreportAppForm = createAppForm<LogAppReportRequest>()

const Appreport: React.FC = () => {

    const { t } = useTranslation()

    const [reqBody, setReqBody] = useState<LogAppReportRequest | null>(null)

    const getDefaultValues = (): LogAppReportRequest => {
        const startDate = new Date()
        startDate.setDate(1)
        startDate.setMonth(startDate.getMonth() - 1)
        startDate.setHours(0, 0, 0, 0)
        const endDate = new Date()
        return {
            Startdate: SuppressDate(startDate, true),
            Enddate: SuppressDate(endDate, true)
        }
    }

    const methods = useForm<LogAppReportRequest>({
        mode: 'onChange',
        defaultValues: getDefaultValues()
    })

    const { getValues, formState, trigger, watch } = methods

    const [CurrentStartDate, CurrentEndDate] = watch(['Startdate', 'Enddate'])

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const values = getValues()
                setReqBody(values)
            } else {
                CheckForm(formState, t('Pages.Appreports.Page.Header'))
            }
        })
    }

    const isDateSetted = validator.isISODate(reqBody?.Enddate) && validator.isISODate(reqBody?.Startdate)
    const isDateSame = reqBody?.Startdate === CurrentStartDate && reqBody?.Enddate === CurrentEndDate

    return <Pagewrapper direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Appreports.Page.Header')}
            PageUrl={Paths.Appreports}
        />
        <FormProvider<LogAppReportRequest> {...methods}>
            <Contentwrapper>
                <Form>
                    <Form.Group widths={'equal'}>
                        <AppreportAppForm.Input name='Startdate' label={t('Pages.Appreports.Label.Startdate')} required={t('Pages.Appreports.Messages.StartdateRequired')} type='datetime-local' />
                        <AppreportAppForm.Input name='Enddate' label={t('Pages.Appreports.Label.Enddate')} required={t('Pages.Appreports.Messages.EnddateRequired')} type='datetime-local' />
                    </Form.Group>
                    <Form.Group widths={'equal'}>
                        <FormButton
                            disabled={isDateSame}
                            text={t('Pages.Appreports.Columns.FetchList')}
                            onClick={() => submit()}
                        />
                    </Form.Group>
                </Form>
            </Contentwrapper>
            {isDateSetted ?
                <AppTab
                    panes={[
                        {
                            menuItem: t('Pages.Appreports.Tab.Userusages'),
                            render: () => <AppreportUserUsages
                                startDate={reqBody?.Startdate}
                                endDate={reqBody?.Enddate}
                            />,
                        },
                        {
                            menuItem: t('Pages.Appreports.Tab.Serviceusages'),
                            render: () => <AppreportServiceUsages
                                startDate={reqBody?.Startdate}
                                endDate={reqBody?.Enddate}
                            />,
                        },
                        {
                            menuItem: t('Pages.Appreports.Tab.Userdailyusages'),
                            render: () => <AppreportUserUsagesDaily
                                startDate={reqBody?.Startdate}
                                endDate={reqBody?.Enddate}
                            />,
                        },
                    ]}
                />
                : null}
        </FormProvider>
    </Pagewrapper >
}
export default Appreport