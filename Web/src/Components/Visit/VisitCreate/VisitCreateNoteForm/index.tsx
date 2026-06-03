import { VisitCreateRequest } from '@Api/Visit/type'
import Title from '@Components/Common/Title'
import { createAppForm } from '@Utils/CreateAppForm'
import React from 'react'
import { useFieldArray, } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form, Icon } from 'semantic-ui-react'

const VisitAppForm = createAppForm<VisitCreateRequest>()

const VisitCreateNoteForm: React.FC = () => {

    const { t } = useTranslation()

    const { fields, append, remove } = useFieldArray<VisitCreateRequest>({ name: 'Notes' })

    return <>
        <Title
            PageName={t('Pages.Visits.Label.NoteTitle')}
            additionalButtons={[{
                name: t('Pages.Visits.Label.AddNote'),
                onClick: () => append({
                    Note: ''
                }),
            }]}
        />
        <Form>
            {fields.map((field, index) => {
                return <Form.Group key={field.id} widths={'equal'} className='!my-0'>
                    <VisitAppForm.Input name={`Notes.${index}.Note`} label={index === 0 ? t('Pages.Visits.Columns.Note') : undefined} />
                    <Form.Field className='!w-auto'>
                        {index === 0 ? <label className='!text-[#000000DE]'>{t('Common.Columns.delete')}</label> : null}
                        <div
                            onClick={() => remove(index)}
                            className='flex justify-center items-center cursor-pointer  !mt-6'>
                            <Icon name='remove' color='red' circular />
                        </div>
                    </Form.Field>
                </Form.Group>
            })}
        </Form>
    </>
}
export default VisitCreateNoteForm