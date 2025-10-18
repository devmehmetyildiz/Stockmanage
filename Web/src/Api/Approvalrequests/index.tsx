import { gatewayApi } from "@Api/api";
import { METHOD_GET, METHOD_PUT, APPROVALREQUEST_TAG, APPROVALREQUEST_APPROVE, APPROVALREQUEST_REJECT, APPROVALREQUEST, APPROVALREQUEST_COUNT } from "@Constant/api";
import { ApprovalrequestApproveRequest, ApprovalrequestItem, ApprovalrequestListRequestType, ApprovalrequestRejectRequest } from "./type";

export const approvalrequestQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [APPROVALREQUEST_TAG] }).injectEndpoints({
    endpoints: (builder) => ({
        getApprovalrequests: builder.query<ApprovalrequestItem[], ApprovalrequestListRequestType | void>({
            query: (params) => ({
                url: APPROVALREQUEST,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [APPROVALREQUEST_TAG]
        }),
        getApprovalrequestCounts: builder.query<number, ApprovalrequestListRequestType | void>({
            query: (params) => ({
                url: APPROVALREQUEST_COUNT,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [APPROVALREQUEST_TAG]
        }),
        approveApprovalRequests: builder.mutation<void, ApprovalrequestApproveRequest>({
            query: (body) => ({
                url: APPROVALREQUEST_APPROVE,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: (result) => result ? [APPROVALREQUEST_TAG] : [],
        }),
        rejectApprovalRequests: builder.mutation<void, ApprovalrequestRejectRequest>({
            query: (body) => ({
                url: APPROVALREQUEST_REJECT,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: (result) => result ? [APPROVALREQUEST_TAG] : [],
        }),

    })
})

export const {
    useGetApprovalrequestCountsQuery,
    useGetApprovalrequestsQuery,
    useApproveApprovalRequestsMutation,
    useRejectApprovalRequestsMutation
} = approvalrequestQuery;