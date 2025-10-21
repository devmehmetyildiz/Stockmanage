import { gatewayApi } from "@Api/api";
import { VISIT, METHOD_GET, METHOD_POST, METHOD_PUT, VISIT_TAG, VISIT_GETCOUNT, VISIT_UPDATE_STOCKS, VISIT_UPDATE_DEFINES, VISIT_WORK, METHOD_DELETE, VISIT_UPDATE_PAYMENTDEFINE, VISIT_COMPLETE, VISIT_SEND_APPROVE, PAYMENTPLAN_TAG } from "@Constant/api";
import { VisitCompleteApiRequest, VisitCreateRequest, VisitDeleteRequest, VisitItem, VisitListItem, VisitListRequest, VisitRequest, VisitSendApproveRequest, VisitUpdateDefinesRequest, VisitUpdatePaymentdefineRequest, VisitUpdateStocksRequest, VisitWorkRequest } from "./type";

export const visitQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [VISIT_TAG, PAYMENTPLAN_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getVisits: builder.query<VisitListItem[], VisitListRequest | void>({
                query: (params) => ({
                    url: VISIT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [VISIT_TAG, PAYMENTPLAN_TAG],
            }),
            getVisitsCount: builder.query<number, VisitListRequest | void>({
                query: (params) => ({
                    url: VISIT_GETCOUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [VISIT_TAG, PAYMENTPLAN_TAG],
            }),
            getVisit: builder.query<VisitItem, VisitRequest>({
                query: (req) => ({
                    url: `${VISIT}/${req.Uuid}`,
                    method: METHOD_GET,
                }),
                providesTags: [VISIT_TAG, PAYMENTPLAN_TAG],
            }),
            createVisit: builder.mutation<void, VisitCreateRequest>({
                query: (body) => ({
                    url: VISIT,
                    method: METHOD_POST,
                    body,
                }),
                invalidatesTags: (result) => result ? [VISIT_TAG] : [],
            }),
            editVisitStocks: builder.mutation<void, VisitUpdateStocksRequest>({
                query: (body) => ({
                    url: VISIT_UPDATE_STOCKS,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: (result) => result ? [VISIT_TAG] : [],
            }),
            editVisitDefines: builder.mutation<void, VisitUpdateDefinesRequest>({
                query: (body) => ({
                    url: VISIT_UPDATE_DEFINES,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: (result) => result ? [VISIT_TAG] : [],
            }),
            workVisit: builder.mutation<void, VisitWorkRequest>({
                query: (body) => ({
                    url: VISIT_WORK,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: (result) => result ? [VISIT_TAG] : [],
            }),
            editPaymentdefineVisit: builder.mutation<void, VisitUpdatePaymentdefineRequest>({
                query: (body) => ({
                    url: VISIT_UPDATE_PAYMENTDEFINE,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: (result) => result ? [VISIT_TAG] : [],
            }),
            sendApproveVisit: builder.mutation<void, VisitSendApproveRequest>({
                query: (body) => ({
                    url: VISIT_SEND_APPROVE,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: (result) => result ? [VISIT_TAG] : [],
            }),
            completeVisit: builder.mutation<void, VisitCompleteApiRequest>({
                query: (body) => ({
                    url: VISIT_COMPLETE,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: (result) => result ? [VISIT_TAG] : [],
            }),
            deleteVisit: builder.mutation<void, VisitDeleteRequest>({
                query: (param) => ({
                    url: `${VISIT}/${param.Uuid}`,
                    method: METHOD_DELETE,
                }),
                invalidatesTags: (result) => result ? [VISIT_TAG] : [],
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
    useEditVisitStocksMutation,
    useWorkVisitMutation,
    useDeleteVisitMutation,
    useEditPaymentdefineVisitMutation,
    useCompleteVisitMutation,
    useSendApproveVisitMutation
} = visitQuery;
