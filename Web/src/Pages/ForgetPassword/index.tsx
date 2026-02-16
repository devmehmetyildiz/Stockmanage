import Pagewrapper from '@Components/Common/Pagewrapper'
import React from 'react'
import styles from './style.module.scss'
import ForgetPasswordTitle from '@Components/ForgetPassword/ForgetPasswordTitle'
import { useTranslation } from 'react-i18next'
import { FormProvider, useForm } from 'react-hook-form'
import { PasswordForgetRequest } from '@Api/Auth/type'
import Formwrapper from '@Components/Common/Formwrapper'
import FormButton from '@Components/Common/FormButton'
import FormInput from '@Components/Common/FormInput'
import { usePasswordForgetMutation } from '@Api/Auth'
import Pushnotification from '@Utils/Pushnotification'
import LoginFooter from '@Components/Login/LoginFooter'
import { useNavigate } from 'react-router-dom'

const ForgetPassword: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const [SendForgetRequest, { isLoading }] = usePasswordForgetMutation()

    const methods = useForm<PasswordForgetRequest>({
        mode: 'onChange',
        defaultValues: {
            email: ''
        }
    })

    const { formState, getValues } = methods

    const handleSubmit = () => {
        SendForgetRequest(getValues())
            .unwrap()
            .then(() => {
                Pushnotification({
                    Type: 'Success',
                    Subject: t('Appname'),
                    Description: t('Pages.Passwordforget.Messages.Success')
                })
                setTimeout(() => {
                    navigate('/Login')
                }, 1000)
            })
    }

    const keyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && formState.isValid && !isLoading) {
            handleSubmit()
        }
    }

    return <Pagewrapper fullscreen className={styles.login}>
        <div className='bg-white rounded-lg min-w-20 w-[28rem] shadow-sm shadow-white'>
            <div className='w-full flex justify-center items-center flex-col'>
                <ForgetPasswordTitle />
                <form className='w-full' onKeyDown={(e) => keyPress(e)}>
                    <FormProvider<PasswordForgetRequest> {...methods}>
                        <Formwrapper>
                            <FormInput<PasswordForgetRequest>
                                name='email'
                                icon='mail'
                                transparent
                                size='large'
                                placeholder={t('Pages.Passwordforget.Columns.Email')}
                                divider='bottom'
                                required={t('Pages.Passwordforget.Messages.EmailRequired')}
                            />
                        </Formwrapper>
                    </FormProvider>
                </form>
                <div className=' w-full flex flex-col justify-end items-end gap-4  px-4'>
                    <FormButton disabled={!formState.isValid} loading={isLoading} text={t('Pages.Passwordforget.Columns.Send')} onClick={() => handleSubmit()} />
                </div>
                <LoginFooter isNewVersion={false} />
            </div>
        </div>
    </Pagewrapper>
}
export default ForgetPassword