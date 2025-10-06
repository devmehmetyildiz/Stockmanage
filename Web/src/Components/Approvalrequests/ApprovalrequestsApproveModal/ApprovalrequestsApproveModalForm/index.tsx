import { ApprovalrequestApproveRequest, ApprovalrequestItem } from '@Api/Approvalrequests/type'
import { createAppForm } from '@Utils/CreateAppForm'
import React from 'react'
import { useFieldArray, } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Label } from 'semantic-ui-react'

interface ApprovalrequestsApproveModalFormProps {
    selectedRecords: ApprovalrequestItem[]
}

const ApprovalrequestsApproveModalFormAppForm = createAppForm<ApprovalrequestApproveRequest>()

const ApprovalrequestsApproveModalForm: React.FC<ApprovalrequestsApproveModalFormProps> = (props) => {

    const { selectedRecords } = props

    const { t } = useTranslation()

    const { fields } = useFieldArray<ApprovalrequestApproveRequest>({ name: 'ApproveList', })

    return <Form>
        {fields.map((field, index) => {

            const request = (selectedRecords || []).find(u => u.Uuid === field.Uuid)

            return <Form.Group widths={'equal'}>
                <Form.Field>
                    <div className='w-full'>
                        <Label content={request?.Message} className='!text-white !bg-primary' />
                    </div>
                    <Form.Group widths={'equal'}>
                        <ApprovalrequestsApproveModalFormAppForm.Input name={`ApproveList.${index}.Comment`} label={t('Pages.Approvalrequests.Columns.Comment')} />
                    </Form.Group>
                </Form.Field>
            </Form.Group>
        })}
    </Form>
}
export default ApprovalrequestsApproveModalForm