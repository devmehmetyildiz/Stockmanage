import { gatewayApi } from "@Api/api";
import { VISIT, METHOD_GET, METHOD_POST, METHOD_PUT, VISIT_TAG, VISIT_GETCOUNT, VISIT_UPDATE_STOCKS, VISIT_UPDATE_DEFINES } from "@Constant/api";
import { VisitCreateRequest, VisitItem, VisitListItem, VisitListRequest, VisitRequest, VisitUpdateDefinesRequest, VisitUpdateStocksRequest } from "./type";

export const visitQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [VISIT_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getVisits: builder.query<VisitListItem[], VisitListRequest | void>({
                query: (params) => ({
                    url: VISIT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [VISIT_TAG],
            }),
            getVisitsCount: builder.query<number, VisitListRequest | void>({
                query: (params) => ({
                    url: VISIT_GETCOUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [VISIT_TAG],
            }),
            getVisit: builder.query<VisitItem, VisitRequest>({
                query: (req) => ({
                    url: `${VISIT}/${req.Uuid}`,
                    method: METHOD_GET,
                }),
            }),
            createVisit: builder.mutation<void, VisitCreateRequest>({
                query: (body) => ({
                    url: VISIT,
                    method: METHOD_POST,
                    body,
                }),
                invalidatesTags: [VISIT_TAG],
            }),
            editVisitStocks: builder.mutation<void, VisitUpdateStocksRequest>({
                query: (body) => ({
                    url: VISIT_UPDATE_STOCKS,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: [VISIT_TAG],
            }),
            editVisitDefines: builder.mutation<void, VisitUpdateDefinesRequest>({
                query: (body) => ({
                    url: VISIT_UPDATE_DEFINES,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: [VISIT_TAG],
            }),
        }),
    });

export const {
    useLazyGetVisitQuery,
    useGetVisitsQuery,
    useGetVisitsCountQuery,
    useGetVisitQuery,
    useCreateVisitMutation,
    useEditVisitDefinesMutation,
    useEditVisitStocksMutation
} = visitQuery;
