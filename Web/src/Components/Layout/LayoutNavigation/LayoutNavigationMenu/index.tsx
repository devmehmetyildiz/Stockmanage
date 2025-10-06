import React from 'react'
import { Icon } from 'semantic-ui-react'

interface LayoutNavigationMenuProps {
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const LayoutNavigationMenu: React.FC<LayoutNavigationMenuProps> = ({ setVisible }) => {

    return <div className='cursor-pointer' onClick={() => setVisible(prev => !prev)}>
        <Icon name='bars' className='text-white' size='large' />
    </div>
}
export default LayoutNavigationMenu