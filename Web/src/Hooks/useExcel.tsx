import { ExcelContext, ExcelContextProps } from "@Context/ExcelContext";
import { useContext } from "react";

const useExcel = (): ExcelContextProps | null => {
    const context = useContext(ExcelContext);
    if (!context) {
        return null
    }
    return context;
};

export default useExcel