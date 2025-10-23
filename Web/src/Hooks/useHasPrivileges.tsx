import { useGetMetaQuery, useGetPrivilegesQuery } from "@Api/Profile"
import privileges from "@Constant/privileges"
import { useMemo } from "react"

const useHasPrivileges = (requiredPivileges: string | string[] | null | undefined) => {

    if (!requiredPivileges) {
        return {
            isSuccess: false,
            isMetaLoading: false,
            isHasPrivilege: false,
        }
    }
    const { data: meta, isFetching: isMetaFetching } = useGetMetaQuery()
    const { data: userPrivileges, isFetching: isPrivilegesFetching } = useGetPrivilegesQuery()

    const isHasPrivilege = useMemo(() => {
        const requiredParams = Array.isArray(requiredPivileges) ? requiredPivileges : [requiredPivileges]
        if (userPrivileges) {
            return requiredParams.every(item => userPrivileges.includes(item)) || userPrivileges.includes(privileges.admin)
        }
        return false

    }, [userPrivileges, requiredPivileges])

    return {
        isSuccess: !!meta && !!userPrivileges,
        isMetaLoading: isMetaFetching || isPrivilegesFetching,
        isHasPrivilege: !isHasPrivilege,
        UserID: meta?.Uuid
    }
}

export default useHasPrivileges