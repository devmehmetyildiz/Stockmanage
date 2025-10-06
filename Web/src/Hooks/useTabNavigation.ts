import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

interface TabNavigationProps {
    additionalTabPrefix?: string
    navigate: any
    tabOrder: string[]
    mainRoute: string
    resetParams?: string[]
}

const useTabNavigation = ({
    additionalTabPrefix,
    navigate,
    tabOrder,
    mainRoute,
    resetParams
}: TabNavigationProps) => {
    const location = useLocation()

    const key = additionalTabPrefix || 'tab'

    const calculateActiveTab = () => {
        const params = new URLSearchParams(location.search)
        const tabIndex = tabOrder.findIndex(u => u === params.get(key))
        return tabIndex >= 0 ? tabIndex : 0
    }

    const [activeTab, setActiveTab] = useState(calculateActiveTab())

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const tabIndex = tabOrder.findIndex(u => u === params.get(key))
        if (activeTab !== tabIndex) {
            params.has(key)
                ? params.set(key, tabOrder[activeTab])
                : params.append(key, tabOrder[activeTab])
            if (resetParams) {
                (resetParams || []).forEach(param => {
                    if (params.has(param)) {
                        params.delete(param)
                    }
                });
            }
            navigate(`/${mainRoute}?${params.toString()}`)
        }
    }, [activeTab, history, tabOrder, location])

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        if (params.has(key)) {
            const tabIndex = tabOrder.findIndex(u => u === params.get(key))
            setActiveTab(tabIndex)
        }
    }, [])

    return {
        activeTab,
        setActiveTab,
    }
}

export default useTabNavigation