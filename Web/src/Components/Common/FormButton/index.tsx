import { useGetPrivilegesQuery } from '@Api/Profile'
import privileges from '@Constant/privileges'
import React, { PropsWithChildren } from 'react'
import { Button, ButtonProps } from 'semantic-ui-react'

interface FormButtonProps extends ButtonProps {
    text: string
    secondary?: boolean
    className?: string
    showChildren?: boolean
    role?: string
}

const FormButton: React.FC<PropsWithChildren<FormButtonProps>> = (props) => {

    const { role, text, secondary, className, onClick, disabled, loading, children, showChildren, ...rest } = props

    const { data: userPrivileges, isFetching } = useGetPrivilegesQuery()

    if (role && (!(userPrivileges || []).includes(role)) && !(userPrivileges || []).includes(privileges.admin)) {
        return null
    }

    const getColor = () => {
        if (secondary) {
            return '!bg-secondary !text-white'
        } else {
            return '!bg-primary !text-white'
        }
    }

    return <Button floated='right' size='medium' disabled={showChildren ? undefined : disabled || isFetching} loading={loading} className={`${getColor()} ${showChildren && disabled ? 'opacity-30' : ''}  ${className || ''}`} {...rest} onClick={disabled || loading ? undefined : onClick}>
        {showChildren ? children : text}
    </Button>
}
export default FormButton