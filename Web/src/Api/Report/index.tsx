import { gatewayApi } from "@Api/api";
import { METHOD_POST, REPORT_DAILYSALES, REPORT_MONTHLYSALES, REPORT_SALEBYDOCTOR, REPORT_SALEBYLOCATION, REPORT_SALEBYUSER, REPORT_VISITPRODUCT } from "@Constant/api";
import { ReportDailySalesItem, ReportMonthlySalesItem, ReportRequest, ReportSaleByDoctorItem, ReportSaleByLocationItem, ReportSaleByUserItem, ReportVisitProductItem, } from "./type";

export const reportQuery = gatewayApi.injectEndpoints({
    endpoints: (builder) => ({
        getReportSaleByDoctor: builder.query<ReportSaleByDoctorItem[], ReportRequest>({
            query: (body) => ({
                url: REPORT_SALEBYDOCTOR,
                method: METHOD_POST,
                body
            }),
        }),
        getReportSaleByLocation: builder.query<ReportSaleByLocationItem[], ReportRequest>({
            query: (body) => ({
                url: REPORT_SALEBYLOCATION,
                method: METHOD_POST,
                body
            }),
        }),
        getReportVisitProduct: builder.query<ReportVisitProductItem[], ReportRequest>({
            query: (body) => ({
                url: REPORT_VISITPRODUCT,
                method: METHOD_POST,
                body
            }),
        }),
        getReportSaleByUser: builder.query<ReportSaleByUserItem[], ReportRequest>({
            query: (body) => ({
                url: REPORT_SALEBYUSER,
                method: METHOD_POST,
                body
            }),
        }),
        getReportDailySales: builder.query<ReportDailySalesItem[], ReportRequest>({
            query: (body) => ({
                url: REPORT_DAILYSALES,
                method: METHOD_POST,
                body
            }),
        }),
        getReportMonthlySales: builder.query<ReportMonthlySalesItem[], ReportRequest>({
            query: (body) => ({
                url: REPORT_MONTHLYSALES,
                method: METHOD_POST,
                body
            }),
        }),
    })
})

export const {
    useGetReportSaleByDoctorQuery,
    useGetReportSaleByLocationQuery,
    useGetReportSaleByUserQuery,
    useGetReportVisitProductQuery,
    useGetReportDailySalesQuery,
    useGetReportMonthlySalesQuery
} = reportQuery;