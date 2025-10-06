import { LayoutContext, LayoutContextProps } from "@Context/LayoutContext";
import { useContext } from "react";

const useLayout = (): LayoutContextProps => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};

export default useLayout