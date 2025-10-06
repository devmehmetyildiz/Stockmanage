import React, { PropsWithChildren } from 'react'

interface DataTableWrapperProps {
}

const DataTableWrapper: React.FC<PropsWithChildren<DataTableWrapperProps>> = ({ children }) => {

    return <div className='mt-4 w-full flex flex-col gap-4 justify-start items-start'>
        {children}
    </div>
}
export default DataTableWrapper