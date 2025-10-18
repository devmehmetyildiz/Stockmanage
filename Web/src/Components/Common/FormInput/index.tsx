import validator from '@Utils/Validator'
import React, { useState } from 'react'
import { Controller, Path, RegisterOptions, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { FormInputProps as SemanticFormInputProps, Divider, Form, SemanticICONS, Popup, Icon, Label, Input, } from 'semantic-ui-react'


export interface FormInputProps<T extends object> {
    label?: string
    placeholder?: string
    name: Path<T>
    icon?: SemanticICONS
    transparent?: boolean
    size?: "big" | "small" | "mini" | "large" | "huge" | "massive" | undefined
    divider?: 'bottom' | 'top'
    rules?: Omit<RegisterOptions<T, Path<T>>, "valueAsNumber" | "valueAsDate" | "setValueAs" | "disabled">
    required?: string
    inputProps?: SemanticFormInputProps
    type?: string | undefined
    disableFullWidth?: boolean
    inputClassName?: string | undefined
    additionalIcon?: React.ReactElement<any> | React.ReactElement<any>[]
    step?: string
    showPriceIcon?: boolean
}

//TODO NUMBER INPUTLARDA 0 YAZILAMIYOR
const FormInput = <T extends object>(props: FormInputProps<T>) => {

    const { control, formState } = useFormContext<T>()

    const { t } = useTranslation()

    const { label, icon, name, transparent, divider, rules, required, inputProps, placeholder, type, size, disableFullWidth, inputClassName, additionalIcon, step, showPriceIcon } = props

    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    const isPasswordField = name === 'Password' || inputProps?.type === 'password';

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

    const decoratedAdditionalIcon = additionalIcon ? Array.isArray(additionalIcon) ? additionalIcon : [additionalIcon] : null

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

    return <div className={`${disableFullWidth ? '' : 'w-full'} block p-2`}>
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                return <Form.Field className='w-full' control={Input} error={error ? { content: error.message } : undefined}>
                    <div className='w-full'>
                        {divider === 'top' && <Divider />}
                        <div className='flex flex-row gap-2 justify-start items-center mb-2'>
                            {label && <label className='!text-[#000000DE]'>{label}</label>}
                            {(label && (required || rules)) && <Popup
                                trigger={<div><Icon color='black' className='cursor-pointer' name='attention' /></div>}
                                content={<Label color='red' ribbon>{t('Common.Attention')}</Label>}
                                on='click'
                                hideOnScroll
                                position='left center'
                            />}
                            {decoratedAdditionalIcon ? decoratedAdditionalIcon.map(item => {
                                return item
                            }) : null}
                        </div>
                        <div className='flex flex-row flex-nowrap'>
                            <div className='w-full relative'>
                                <Input
                                    fluid
                                    className={inputClassName}
                                    error={error ? { content: error.message } : undefined}
                                    {...inputProps}
                                    type={isPasswordField ? (isPasswordVisible ? 'text' : 'password') : type}
                                    {...field}
                                    placeholder={placeholder || label}
                                    icon={icon ?? undefined}
                                    step={step}
                                    iconPosition={icon ? 'left' : undefined}
                                    transparent={transparent}
                                    size={size}
                                    autoComplete={isPasswordField ? 'current-password' : 'off'}
                                    label={showPriceIcon ? { content: ' TL' } : undefined}
                                    labelPosition={showPriceIcon ? 'right' : undefined}
                                    onChange={(e) => {
                                        if (type === 'datetime-local') {
                                            field.onChange(e.target.value)
                                        } else if (type === 'number') {
                                            field.onChange(validator.isNumber(e.target.value) ? Number(e.target.value) : e.target.value)
                                        } else {
                                            field.onChange(e.target.value)
                                        }
                                    }}
                                >
                                </Input>
                                {inputProps?.type === 'password' &&
                                    <div className={`flex justify-center items-center cursor-pointer absolute ${transparent ? 'right-1 top-0 bottom-5' : 'right-1 top-0 bottom-1'}`}
                                        onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                    >
                                        <Icon className='!opacity-60' name={isPasswordVisible ? 'eye slash' : 'eye'} />
                                    </div>
                                }
                            </div>
                        </div>
                        {divider === 'bottom' && <Divider />}
                    </div>
                </Form.Field>
            }}
            rules={getRules()}
        />
    </div >
}
export default FormInput