import React from 'react'
import { Form } from 'semantic-ui-react'

interface FormwrapperProps {
    children: React.ReactNode
    direction?: 'horizontal' | 'vertical'
}

const Formwrapper: React.FC<FormwrapperProps> = (props) => {

    const { children, direction } = props

    return <Form className={`flex ${direction === 'horizontal' ? ' flex-row ' : ' flex-col '} justify-center items-center w-full p-4 `}>
        {children}
    </Form>
}
export default Formwrapper