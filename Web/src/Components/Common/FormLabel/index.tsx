import React, { PropsWithChildren } from 'react'
import { Label, LabelProps } from 'semantic-ui-react'

interface FormLabelProps extends LabelProps {
}

const FormLabel: React.FC<PropsWithChildren<FormLabelProps>> = ({ children, ...rest }) => {

    return <Label className='!bg-primary !text-white' {...rest}>
        {children}
    </Label>
}
export default FormLabel