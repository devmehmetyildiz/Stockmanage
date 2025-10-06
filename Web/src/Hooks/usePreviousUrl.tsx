import { PreviousUrlContext } from "@Context/PreviousContext";
import { useContext } from "react"

const usePreviousUrl = () => {
    const context = useContext(PreviousUrlContext);
    if (!context) {
        throw new Error('usePreviousContext Not Found');
    }
    return context;
}

export default usePreviousUrl