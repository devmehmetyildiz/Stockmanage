import React, { PropsWithChildren } from 'react'

interface FormFooterProps extends PropsWithChildren {
    transparent?: boolean
}

const FormFooter: React.FC<FormFooterProps> = ({ children, transparent }) => {

    return <div className={`whitespace-nowrap flex flex-row w-full justify-between px-2 py-4  items-center ${!transparent && 'bg-white shadow-md'} rounded-b-lg `}>
        {children}
    </div>
}
export default FormFooter