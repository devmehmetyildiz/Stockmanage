import { gatewayApi, } from "@Api/api";
import { LOG_GETBYQUERY, LOG_GETBYUSER, LOG_PROCESSCOUNT, LOG_SERVICEUSAGECOUNT, LOG_SERVICEUSAGECOUNT_DAILY, LOG_USAGECOUNT_MONTHLY, METHOD_GET, METHOD_POST, } from "@Constant/api";
import { LogAppReportRequest, LogItem, LogProcessCountItem, LogRequest, LogServiceUsageItem, LogUsageCountItem, LogUserUsageCount,  } from "./type";

export const logQuery = gatewayApi.injectEndpoints({
    endpoints: (builder) => ({
        getLogGetByQuery: builder.query<LogItem[], LogRequest>({
            query: (body) => ({
                url: LOG_GETBYQUERY,
                method: METHOD_POST,
                body
            }),
        }),
        usageCountByUserMontly: builder.query<LogUsageCountItem[], LogAppReportRequest>({
            query: (params) => ({
                url: LOG_USAGECOUNT_MONTHLY,
                method: METHOD_GET,
                params
            }),
        }),
        processCount: builder.query<LogProcessCountItem[], LogAppReportRequest>({
            query: (params) => ({
                url: LOG_PROCESSCOUNT,
                method: METHOD_GET,
                params
            }),
        }),
        serviceUsageCount: builder.query<LogServiceUsageItem[], LogAppReportRequest>({
            query: (params) => ({
                url: LOG_SERVICEUSAGECOUNT,
                method: METHOD_GET,
                params
            }),
        }),
        serviceUsageCountDaily: builder.query<LogServiceUsageItem[], LogAppReportRequest>({
            query: (params) => ({
                url: LOG_SERVICEUSAGECOUNT_DAILY,
                method: METHOD_GET,
                params
            }),
        }),
        logByUser: builder.query<LogUserUsageCount[], LogAppReportRequest>({
            query: (params) => ({
                url: LOG_GETBYUSER,
                method: METHOD_GET,
                params
            }),
        }),
    })
})

export const {
    useGetLogGetByQueryQuery,
    useUsageCountByUserMontlyQuery,
    useLogByUserQuery,
    useProcessCountQuery,
    useServiceUsageCountDailyQuery,
    useServiceUsageCountQuery,
    useLazyUsageCountByUserMontlyQuery,
    useLazyLogByUserQuery,
    useLazyProcessCountQuery,
    useLazyServiceUsageCountDailyQuery,
    useLazyServiceUsageCountQuery,
} = logQuery;