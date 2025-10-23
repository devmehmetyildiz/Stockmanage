import React from 'react'
import { TitleAdditionalButtonType } from '..'
import { Button, Icon } from 'semantic-ui-react'
import FormButton from '@Components/Common/FormButton'
import { useGetPrivilegesQuery } from '@Api/Profile'
import privileges from '@Constant/privileges'

interface TitleAdditonalButtonsProps {
    additionalButtons: TitleAdditionalButtonType[]
    leftAling?: boolean
}

const TitleAdditonalButtons: React.FC<TitleAdditonalButtonsProps> = (props) => {

    const { additionalButtons, leftAling } = props

    const { data: userPrivileges, isFetching: isPrivilegesFetching } = useGetPrivilegesQuery()

    if (!userPrivileges || isPrivilegesFetching) {
        return null
    }

    const checkUserHasPrivileges = (role?: string) => {
        return role && (userPrivileges.includes(role) || userPrivileges.includes(privileges.admin))
    }

    return additionalButtons.map((buttonMeta, index) => {

        if (buttonMeta.role && !checkUserHasPrivileges(buttonMeta.role)) {
            return null
        }

        if (buttonMeta.iconOnly) {

            return <div
                key={index}
                className={`w-full flex ${leftAling ? 'justify-center' : 'justify-end'} items-center cursor-pointer`}
                onClick={() => {
                    buttonMeta.onClick()
                }}>
                <div>
                    <Icon size='small' name={buttonMeta.icon} className='text-[#2355a0]' />
                </div>
            </div>
        }

        return buttonMeta.hidden ? null :
            buttonMeta.disabled && !!buttonMeta.disabledCouseText
                ? <FormButton secondary={buttonMeta.secondary} disabled animated='fade' text='' showChildren>
                    <Button.Content visible>{buttonMeta.name ?? ''}</Button.Content>
                    <Button.Content hidden>{buttonMeta.disabledCouseText ?? ''}</Button.Content>
                </FormButton>
                : <FormButton
                    secondary={buttonMeta.secondary}
                    disabled={buttonMeta.disabled}
                    text={buttonMeta.name ?? ''}
                    onClick={() => buttonMeta.onClick()}
                    icon={buttonMeta.icon}
                    key={index}
                />
    })
}
export default TitleAdditonalButtons