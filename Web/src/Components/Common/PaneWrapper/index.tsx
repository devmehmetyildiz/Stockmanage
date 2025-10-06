import React, { PropsWithChildren } from 'react'
import { Transition } from 'semantic-ui-react'

interface PaneWrapperProps {
}

const PaneWrapper: React.FC<PropsWithChildren<PaneWrapperProps>> = ({ children }) => {

    return <Transition transitionOnMount animation='fade right' duration={500}>
        {children}
    </Transition>
}
export default PaneWrapper