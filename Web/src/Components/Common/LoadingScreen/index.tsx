import React from 'react'
import { Loader } from 'semantic-ui-react'

interface LoadingScreenProps {
}

const LoadingScreen: React.FC<LoadingScreenProps> = () => {

    return <div className='w-full h-screen flex justify-center items-center'>
        <Loader active />
    </div>
}
export default LoadingScreen