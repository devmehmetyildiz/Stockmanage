import React, { PropsWithChildren } from 'react'
import { Dimmer, DimmerDimmable, Loader, Modal, Transition } from 'semantic-ui-react'

interface AppModalProps {
    open: boolean
    onOpen: () => void
    onClose: () => void
    trigger?: React.ReactNode
    size?: "small" | "mini" | "tiny" | "large" | "fullscreen" | undefined
    isLoading?: boolean
}

const AppModal: React.FC<PropsWithChildren<AppModalProps>> = ({ children, open, onOpen, onClose, trigger, size, isLoading }) => {

    return <Transition
        onHide={() => onClose()}
        visible={open}
        animation='scale'
        duration={500}
    >
        <Modal
            className='p-2'
            trigger={trigger}
            onClose={() => onClose()}
            onOpen={() => onOpen()}
            open={open}
            size={size}
        >
            {isLoading ?
                <Modal.Content>
                    <DimmerDimmable blurring dimmed>
                        <Dimmer active inverted>
                            <Loader active inverted />
                        </Dimmer>
                        {children}
                    </DimmerDimmable>
                </Modal.Content>
                : children}
        </Modal>
    </Transition>

}
export default AppModal