import { Controller, Path, RegisterOptions, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Checkbox, Icon, Label, Popup, } from 'semantic-ui-react'


export interface FormCheckboxProps<T extends object> {
    label?: string
    name: Path<T>
    divider?: 'bottom' | 'top'
    rules?: Omit<RegisterOptions<T, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">
    required?: string
    disableForm?: {
        onChange: (value: boolean) => void
        value: boolean
    }
}

const FormCheckbox = <T extends object>(props: FormCheckboxProps<T>) => {
    const { label, name, divider, rules, required, disableForm } = props

    const { control } = !disableForm ? useFormContext<T>() : {}

    const { t } = useTranslation()

    const getRules = () => {
        if (rules) {
            return rules
        } else if (required) {
            return {
                required: required
            }
        } else {
            return undefined
        }
    }

    return <div className='w-full block p-2'>
        {!disableForm ?
            <Controller
                control={control}
                name={name}
                render={({ field }) => {
                    return <Form.Field>
                        {divider === 'top' && <Divider />}
                        <div className='flex flex-row gap-2 justify-start items-center mb-2'>
                            {label && <label className=''>{label}</label>}
                            {(label && (required || rules)) && <Popup
                                trigger={<div><Icon className='cursor-pointer' name='attention' /></div>}
                                content={<Label color='red' ribbon>{t('Common.Attention')}</Label>}
                                on='click'
                                hideOnScroll
                                position='left center'
                            />}
                        </div>
                        <Checkbox toggle className='m-2'
                            {...field}
                            checked={field.value}
                            onChange={(_, data) => {
                                field.onChange(data.checked)
                            }}
                        />
                        {divider === 'bottom' && <Divider />}
                    </Form.Field>
                }}
                rules={getRules()}
            />
            : <Form.Field>
                {divider === 'top' && <Divider />}
                <div className='flex flex-row gap-2 justify-start items-center mb-2'>
                    {label && <label className=''>{label}</label>}
                    {(label && (required || rules)) && <Popup
                        trigger={<div><Icon className='cursor-pointer' name='attention' /></div>}
                        content={<Label color='red' ribbon>{t('Common.Attention')}</Label>}
                        on='click'
                        hideOnScroll
                        position='left center'
                    />}
                </div>
                <Checkbox toggle className='m-2'
                    checked={disableForm.value}
                    onChange={(_, data) => {
                        disableForm.onChange(data.checked ? true : false)
                    }}
                />
                {divider === 'bottom' && <Divider />}
            </Form.Field>
        }
    </div>
}
export default FormCheckbox