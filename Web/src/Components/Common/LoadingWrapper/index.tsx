import React, { PropsWithChildren } from 'react'
import { Dimmer, DimmerDimmable, Loader } from 'semantic-ui-react'

interface LoadingWrapperProps {
    loading: boolean
}

const LoadingWrapper: React.FC<PropsWithChildren<LoadingWrapperProps>> = ({ loading, children }) => {

    return <DimmerDimmable className={`w-full ${loading ? 'border-none rounded-md opacity-65' : ''}`} blurring dimmed={loading}>
        <Dimmer active={loading} inverted>
            <Loader />
        </Dimmer>
        {children}
    </DimmerDimmable>
}
export default LoadingWrapper