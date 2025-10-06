import React, { PropsWithChildren } from 'react'


interface ContentwrapperProps extends PropsWithChildren {
    className?: string
    fullscreen?: boolean
    bottomRounded?: boolean
    children: React.ReactNode
}

const Contentwrapper: React.FC<ContentwrapperProps> = ({ children, className, fullscreen, bottomRounded }) => {

    return <div
        className={`w-full ${fullscreen ? '' : 'max-'}h-[calc(80vh-59px-2rem)] z-0 bg-white px-4 pt-2 pb-4 rounded-t-lg ${bottomRounded ? 'rounded-b-lg' : ''} shadow-md outline outline-[1px] outline-gray-200 ${className ?? ''}`}>
        {children}
    </div>
}
export default Contentwrapper