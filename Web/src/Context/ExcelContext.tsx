import React, { createContext, useState, ReactNode } from 'react';

export interface ExcelContextProps {
    excelData: any[] | null
    setExcelData: React.Dispatch<React.SetStateAction<any[] | null>>
}

export const ExcelContext = createContext<ExcelContextProps | undefined>(undefined);

export const ExcelProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [excelData, setExcelData] = useState<any[] | null>(null)

    return (
        <ExcelContext.Provider value={{ excelData, setExcelData }}>
            {children}
        </ExcelContext.Provider>
    );
};

