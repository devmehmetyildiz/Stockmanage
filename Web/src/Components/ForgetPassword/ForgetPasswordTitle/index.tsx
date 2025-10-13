import imgs from '@Assets/img'
import React from 'react'
import { useTranslation } from 'react-i18next'


const ForgetPasswordTitle: React.FC = () => {

    const { t } = useTranslation()

    return <div className='flex flex-col justify-center items-center w-full mb-6'>
        <div className='w-full flex justify-start items-start'>
            <div className=' bg-primary w-[20%] pb-[20%] rounded-tl-lg rounded-br-[100%] ' />
        </div>
        <div className='w-full flex justify-center items-center'>
            <img className='h-60 w-60' src={imgs.logo} alt="" />
        </div>
        <div className='-mt-8 w-full flex justify-center items-center  text-lg text-primary font-extrabold'>
            {t('Pages.Passwordforget.Page.Header')}
        </div>
    </div>
}
export default ForgetPasswordTitle