import React, { createContext, ReactNode, useEffect, useRef, useState } from 'react';
import { Location, useLocation } from 'react-router-dom';

export interface PreviousUrlContextProps {
    previousLocation: Location<any> | null
    previousUrl: string | null
    calculateRedirectUrl: ({ url, usePrev }: CalculateRedirectUrlProps) => string
    checkPreviousUrl: (path: string, searchParam: string | string[]) => boolean
}

interface CalculateRedirectUrlProps {
    url: string
    usePrev: boolean
}

export const PreviousUrlContext = createContext<PreviousUrlContextProps | undefined>(undefined);

const PreviousUrlProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

    const [previousLocation, setPreviousLocation] = useState<Location<any> | null>(null);
    const location = useLocation();
    const currentLocationRef = useRef(location);

    const getPreviousUrl = () => {
        if (previousLocation?.pathname) {
            if (previousLocation?.search) {
                return location?.pathname !== previousLocation?.pathname && location?.search !== previousLocation?.search
                    ? `${previousLocation?.pathname}${previousLocation?.search}`
                    : null
            }
            return location?.pathname !== previousLocation?.pathname
                ? `${previousLocation?.pathname}`
                : null
        }
        return null
    }

    const checkPreviousUrl = (path: string, searchParam: string | string[]) => {
        const searchParams = Array.isArray(searchParam) ? searchParam : [searchParam];
        const prevUrl = getPreviousUrl();
        if (!prevUrl) return false;

        const urlObj = new URL(prevUrl, window.location.origin);
        if (urlObj.pathname !== path) return false;

        return searchParams.every(param => urlObj.searchParams.has(param));
    }

    const calculateRedirectUrl = ({ url, usePrev }: CalculateRedirectUrlProps) => {
        if (usePrev) {
            return getPreviousUrl() || url
        }
        return url
    }

    useEffect(() => {
        setPreviousLocation(currentLocationRef.current);
        currentLocationRef.current = location;
    }, [location]);

    return (
        <PreviousUrlContext.Provider value={{
            previousLocation,
            previousUrl: getPreviousUrl(),
            calculateRedirectUrl,
            checkPreviousUrl
        }}>
            {children}
        </PreviousUrlContext.Provider>
    )
}

export default PreviousUrlProvider