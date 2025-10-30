import { ReportRequest } from '@Api/Report/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import React from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from 'semantic-ui-react'

interface OrganizationFilterProps {
    reqBody: ReportRequest | null
    setReqBody: React.Dispatch<React.SetStateAction<ReportRequest | null>>
}

const ReportAppForm = createAppForm<ReportRequest>()

const OrganizationFilter: React.FC<OrganizationFilterProps> = (props) => {
    const { reqBody, setReqBody } = props
    const { t } = useTranslation()

    const { getValues, formState, trigger, watch } = useFormContext<ReportRequest>()

    const [CurrentStartDate, CurrentEndDate] = watch(['Startdate', 'Enddate'])

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const values = getValues()
                setReqBody(values)
            } else {
                CheckForm(formState, t('Pages.Organisation.Page.Header'))
            }
        })
    }

    const isDateSame = reqBody?.Startdate === CurrentStartDate && reqBody?.Enddate === CurrentEndDate

    return <Contentwrapper>
        <Form>
            <Form.Group widths={'equal'}>
                <ReportAppForm.Input name='Startdate' label={t('Common.StartDate')} required={t('Common.Required')} type='datetime-local' />
                <ReportAppForm.Input name='Enddate' label={t('Common.EndDate')} required={t('Common.Required')} type='datetime-local' />
            </Form.Group>
            <Form.Group widths={'equal'}>
                <FormButton
                    disabled={isDateSame}
                    text={t('Pages.Organisation.Messages.FetchList')}
                    onClick={() => submit()}
                />
            </Form.Group>
        </Form>
    </Contentwrapper>
}
export default OrganizationFilter