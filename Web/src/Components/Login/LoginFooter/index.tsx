import config from '@Constant/config'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Label } from 'semantic-ui-react'

interface LoginFooterProps {
    isNewVersion: boolean
}

const LoginFooter: React.FC<LoginFooterProps> = ({ isNewVersion }) => {

    const { t } = useTranslation()

    return <div className='mt-4 flex flex-col justify-center items-center text-center py-2'>
        <p className='text-[#777] text-sm '>
            <div className='flex relative justify-center  items-center flex-row '>
                <span className='relative pt-2'>
                    V{config.version}
                    {isNewVersion ?
                        <Label floating className='!left-[130%]' color='red' size='mini'>
                            {t('Pages.Login.Messages.NewVersion')}
                        </Label>
                        : null}
                </span><br />
            </div>
            <span>{`ARMSTeknoloji ${new Date().getFullYear()}`}</span>
        </p>
    </div>
}
export default LoginFooter