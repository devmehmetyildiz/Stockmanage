import useMobile from '@Hooks/useMobile';
import React from 'react'
import { Input } from 'semantic-ui-react';


interface DataTableGlobalFilterProps {
    globalFilter: string
    setGlobalFilter: React.Dispatch<React.SetStateAction<string>>
}

const DataTableGlobalFilter: React.FC<DataTableGlobalFilterProps> = ({ globalFilter, setGlobalFilter }) => {

    const { isTablet } = useMobile()

    return (
        <div className={`w-full flex justify-start items-center my-2 ${isTablet ? 'pl-2' : ''}`}>
            <Input
                icon='search'
                iconPosition='left'
                placeholder='Arama...'
                onChange={(e) => setGlobalFilter(e.target.value)}
                value={globalFilter}
            />
        </div>
    )
}
export default DataTableGlobalFilter