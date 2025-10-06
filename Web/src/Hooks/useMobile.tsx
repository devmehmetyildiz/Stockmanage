import { MEDIA_BREAKDOWN_POINT, MEDIA_BREAKDOWN_POINT_MOBILE_LARGE } from "@Constant/index";
import { useMediaQuery } from "react-responsive";

const useMobile = (breakpoint?: number) => {
    const isTablet = useMediaQuery({ maxWidth: MEDIA_BREAKDOWN_POINT })
    const isMobileLarge = useMediaQuery({ maxWidth: MEDIA_BREAKDOWN_POINT_MOBILE_LARGE })
    const isSmallerThanBreakpoint = useMediaQuery({ maxWidth: breakpoint ?? 0 })
    return {
        isTablet,
        isMobileLarge,
        isSmallerThanBreakpoint
    }
};

export default useMobile