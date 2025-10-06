import { useGetPrivilegesQuery } from '@Api/Profile'
import LoadingScreen from '@Components/Common/LoadingScreen'
import NotAuhenticationScreen from '@Components/Common/NotAuhenticationScreen'
import React, { PropsWithChildren } from 'react'

interface ProtectedRouteProps {
    requiredRole?: string[]
}

const ProtectedRoute: React.FC<PropsWithChildren<ProtectedRouteProps>> = (props) => {

    const { requiredRole, children } = props
    const { data: userPrivileges, isFetching } = useGetPrivilegesQuery()

    if (isFetching) {
        return <LoadingScreen />
    } else if (requiredRole) {
        if (requiredRole.every(role => (userPrivileges || []).includes(role)) || (userPrivileges || []).includes('admin')) {
            return children
        } else {
            return <NotAuhenticationScreen />
        }
    } else {
        return children
    }
}
export default ProtectedRoute