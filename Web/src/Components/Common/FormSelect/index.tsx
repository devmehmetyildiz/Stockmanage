import { Controller, Path, RegisterOptions, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Dropdown, DropdownItemProps, Icon, Label, Popup, } from 'semantic-ui-react'


export interface FormSelectProps<T extends object> {
    label?: string
    name: Path<T>
    multiple?: boolean | undefined
    divider?: 'bottom' | 'top'
    rules?: Omit<RegisterOptions<T, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">
    required?: string
    options: DropdownItemProps[] | undefined
    loading?: boolean
    additionalIcon?: React.ReactElement<any> | React.ReactElement<any>[]
    disabled?: boolean | undefined
    additionalOnchange?: () => void
}

const FormSelect = <T extends object>(props: FormSelectProps<T>) => {

    const { control, formState } = useFormContext<T>()

    const { t } = useTranslation()

    const { label, name, divider, rules, required, multiple, options, loading, additionalIcon, disabled, additionalOnchange } = props

    const getErrorFromErrors = (formErrors: any, formKey: string) => {
        if (formKey && formKey.length > 0 && formKey.includes('.')) {
            const splitedNames = formKey.split('.')
            return splitedNames.reduce((prevValue, currentValue) => {
                return prevValue ? prevValue[currentValue] : formErrors[currentValue]
            }, formErrors[formKey])
        }

        return formErrors[formKey]
    }

    const error = getErrorFromErrors(formState.errors, name)

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

    const decoratedAdditionalIcon = additionalIcon ? Array.isArray(additionalIcon) ? additionalIcon : [additionalIcon] : null

    return <div className='w-full block p-2'>
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
                        {decoratedAdditionalIcon ? decoratedAdditionalIcon.map(item => {
                            return item
                        }) : null}
                    </div>
                    <Dropdown
                        disabled={disabled}
                        loading={loading}
                        error={error ? true : undefined}
                        {...field}
                        clearable
                        fluid
                        placeholder={label}
                        options={options}
                        multiple={multiple}
                        selection
                        onChange={(_, data) => {
                            additionalOnchange && additionalOnchange()
                            field.onChange(data.value)
                        }}
                    />
                    {error && error.message ?
                        <div className='ui pointing above prompt label'>
                            {error.message}
                        </div>
                        : null}
                    {divider === 'bottom' && <Divider />}
                </Form.Field>
            }}
            rules={getRules()}
        />
    </div>
}
export default FormSelect