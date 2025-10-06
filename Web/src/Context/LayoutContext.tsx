import React, { createContext, useState, ReactNode } from 'react';

export interface LayoutContextProps {
    isSidebarOpen: boolean;
    changeSidebar: (state: boolean) => void;
    isNotificationSidebarOpen: boolean;
    changeNotificationSidebar: (state: boolean) => void;
}

export const LayoutContext = createContext<LayoutContextProps | undefined>(undefined);

export const LayoutProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);

    const changeSidebar = (state: boolean) => {
        setIsSidebarOpen(state);
    };

    const changeNotificationSidebar = (state: boolean) => {
        setIsNotificationOpen(state);
    };

    return (
        <LayoutContext.Provider value={{ isSidebarOpen, changeSidebar, isNotificationSidebarOpen: isNotificationOpen, changeNotificationSidebar }}>
            {children}
        </LayoutContext.Provider>
    );
};

