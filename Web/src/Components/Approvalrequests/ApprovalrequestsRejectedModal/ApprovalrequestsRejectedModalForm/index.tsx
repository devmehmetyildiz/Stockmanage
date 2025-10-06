import { ApprovalrequestItem, ApprovalrequestRejectRequest } from '@Api/Approvalrequests/type'
import { createAppForm } from '@Utils/CreateAppForm'
import React from 'react'
import { useFieldArray, } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Label } from 'semantic-ui-react'

interface ApprovalrequestsRejectedModalFormProps {
    selectedRecords: ApprovalrequestItem[]
}

const ApprovalrequestsRejectedModalFormAppForm = createAppForm<ApprovalrequestRejectRequest>()

const ApprovalrequestsRejectedModalForm: React.FC<ApprovalrequestsRejectedModalFormProps> = (props) => {

    const { selectedRecords } = props

    const { t } = useTranslation()

    const { fields } = useFieldArray<ApprovalrequestRejectRequest>({ name: 'RejectList', })

    return <Form>
        {fields.map((field, index) => {

            const request = (selectedRecords || []).find(u => u.Uuid === field.Uuid)

            return <Form.Group widths={'equal'}>
                <Form.Field>
                    <div className='w-full'>
                        <Label content={request?.Message} className='!text-white !bg-primary' />
                    </div>
                    <Form.Group widths={'equal'}>
                        <ApprovalrequestsRejectedModalFormAppForm.Input name={`RejectList.${index}.Comment`} label={t('Pages.Approvalrequests.Columns.Comment')} />
                    </Form.Group>
                </Form.Field>
            </Form.Group>
        })}
    </Form>
}
export default ApprovalrequestsRejectedModalForm