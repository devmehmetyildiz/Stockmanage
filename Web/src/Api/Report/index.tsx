import { gatewayApi } from "@Api/api";
import { METHOD_POST, REPORT_USERSALE } from "@Constant/api";
import { ReportRequest, ReportUserSaleReportItem } from "./type";

export const reportQuery = gatewayApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserSaleReport: builder.query<ReportUserSaleReportItem[], ReportRequest>({
            query: (body) => ({
                url: REPORT_USERSALE,
                method: METHOD_POST,
                body
            }),
        }),
    })
})

export const {
    useGetUserSaleReportQuery,
    useLazyGetUserSaleReportQuery
} = reportQuery;