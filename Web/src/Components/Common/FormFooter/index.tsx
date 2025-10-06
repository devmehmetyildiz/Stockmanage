import React, { PropsWithChildren } from 'react'

interface FormFooterProps extends PropsWithChildren {
}

const FormFooter: React.FC<FormFooterProps> = ({ children }) => {

    return <div className='flex flex-row w-full justify-between px-2 py-4  items-center bg-white rounded-b-lg shadow-md'>
        {children}
    </div>
}
export default FormFooter