import React from 'react'
import styles from './style.module.scss'
import Pagewrapper from '@Components/Common/Pagewrapper'
import { FormProvider, useForm } from 'react-hook-form'
import { LoginRequest } from '@Api/Auth/type'
import { FormInputProps, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Formwrapper from '@Components/Common/Formwrapper'
import FormInput from '@Components/Common/FormInput'
import FormButton from '@Components/Common/FormButton'
import LoginFooter from '@Components/Login/LoginFooter'
import LoginTitle from '@Components/Login/LoginTitle'
import { useLoginMutation } from '@Api/Auth'
import { useDispatch } from 'react-redux'
import { setCredentials } from '@Api/Auth/slice'
import Pushnotification from '@Utils/Pushnotification'
import Paths from '@Constant/path'
import useLayout from '@Hooks/useLayout'
import Changelogs from '@Pages/About/Changelogs'
import config from '@Constant/config'

const Login: React.FC = () => {

    const { t } = useTranslation()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const location = useLocation()

    const methods = useForm<LoginRequest>({
        mode: 'onChange',
        defaultValues: {
            Username: '',
            Password: '',
            grantType: 'password'
        }
    })

    const { setIsNewVersionShowed } = useLayout()
    const [SendLogin, { isLoading }] = useLoginMutation()

    const { formState, getValues } = methods

    const passwordType: FormInputProps = {
        type: 'password'
    }

    const checkVersionIsNew = () => {
        const currentVersion = Changelogs.find(u => u.version === config.version)
        const currentDate = new Date()
        currentDate.setHours(0, 0, 0, 0)
        const versionDate = new Date(currentVersion?.date ?? '')
        versionDate.setDate(versionDate.getDate() + 3)
        return versionDate.getTime() > currentDate.getTime()
    }


    const handleSubmit = () => {
        SendLogin(getValues())
            .unwrap()
            .then((res) => {
                Pushnotification({
                    Type: 'Success',
                    Subject: t('Appname'),
                    Description: t('Pages.Login.Messages.Success')
                })
                dispatch(setCredentials(res))
                const params = new URLSearchParams(location.search);
                const redirecturl = params.get('redirecturl');
                if (checkVersionIsNew()) {
                    setIsNewVersionShowed(true)
                }
                if (redirecturl) {
                    navigate(redirecturl)
                } else {
                    navigate('/')
                }
            })
    }

    const keyPress = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === 'Enter' && formState.isValid && !isLoading) {
            handleSubmit()
        }
    }

    return <Pagewrapper fullscreen className={styles.login}>
        <div className='bg-white rounded-lg min-w-20 w-[24rem] md:w-[28rem] lg:w-[28rem] shadow-sm shadow-white'>
            <div className='w-full flex justify-center items-center flex-col'>
                <LoginTitle />
                <form className='w-full' onKeyDown={(e) => keyPress(e)}>
                    <FormProvider<LoginRequest> {...methods}>
                        <Formwrapper>
                            <FormInput<LoginRequest>
                                name='Username'
                                icon='user'
                                transparent
                                size='large'
                                placeholder={t('Pages.Login.Columns.Username')}
                                divider='bottom'
                                caseSensitvy='lower'
                                required={t('Pages.Login.Messages.UsernameRequired')}
                            />
                            <FormInput<LoginRequest>
                                name='Password'
                                icon='lock'
                                placeholder={t('Pages.Login.Columns.Password')}
                                transparent
                                size='large'
                                divider='bottom'
                                required={t('Pages.Login.Messages.PasswordRequired')}
                                inputProps={passwordType}
                            />
                        </Formwrapper>
                    </FormProvider>
                </form>
                <div className=' w-full flex flex-col justify-end items-end gap-4  px-4'>
                    <Link to={Paths.ForgetPassword} className='text-secondary text-sm whitespace-nowrap'><Icon className='text-primary' name='key' /> {t('Pages.Login.Columns.Passwordforget')}</Link>
                    <FormButton disabled={!formState.isValid} loading={isLoading} text={t('Pages.Login.Columns.Login')} onClick={() => handleSubmit()} />
                </div>
                <LoginFooter isNewVersion={checkVersionIsNew()} />
            </div>
        </div>
    </Pagewrapper >
}
export default Login