import config from '@Constant/config'
import React from 'react'

const LoginFooter: React.FC = () => {

    return <div className='mt-4 flex flex-col justify-center items-center text-center py-2'>
        <p className='text-[#777] text-sm '>
            <span>V{config.version}</span><br />
            <span>{`ARMSTeknoloji ${new Date().getFullYear()}`}</span>
        </p>
    </div>
}
export default LoginFooter