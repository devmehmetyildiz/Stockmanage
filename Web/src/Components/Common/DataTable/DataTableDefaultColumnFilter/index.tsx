import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Popup, Icon, Form } from 'semantic-ui-react';

interface DataTableDefaultColumnFilterProps {
    column: any
    dataLength: number
}

const DataTableDefaultColumnFilter: React.FC<DataTableDefaultColumnFilterProps> = ({ column, dataLength }) => {
    const [isOpen, setIsOpen] = useState(false);

    const { t } = useTranslation()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        column.setFilterValue(e.target.value)
    }

    const iconColor = column.getFilterValue() && String(column.getFilterValue()).length > 0 ? 'text-primary' : 'text-tableHeaderIcon'

    const trigger = <div>
        <Icon className={`${iconColor} cursor-pointer`} name="filter" onClick={() => setIsOpen(!isOpen)} />
    </div>

    return (
        <Popup
            trigger={trigger}
            open={isOpen}
            on={'click'}
            onClose={() => setIsOpen(false)}
            onOpen={() => setIsOpen(true)}
            position="bottom center"
        >
            <div className='gap-2 flex flex-col'>
                <label className='font-bold'>{t('Components.Datatable.Label.FilterLabel')}</label>
                <Form.Input
                    placeholder={`${dataLength} ${t('Components.Datatable.Label.FilterPlaceholder')}`}
                    value={column.getFilterValue() || ''}
                    onChange={handleChange}
                />
            </div>
        </Popup>
    );
};

export default DataTableDefaultColumnFilter;
