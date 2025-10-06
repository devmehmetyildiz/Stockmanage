import { gatewayApi } from "@Api/api";
import { CASE, CASE_COUNT, CASE_TAG, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT, } from "@Constant/api";
import { CaseAddRequest, CaseDeleteRequest, CaseEditRequest, CaseItem, CaseListRequest, CaseRequest } from "./type";

export const caseQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [CASE_TAG] }).injectEndpoints({
    endpoints: (builder) => ({
        getCases: builder.query<CaseItem[], CaseListRequest | void>({
            query: (params) => ({
                url: CASE,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [CASE_TAG]
        }),
        getCasesCounts: builder.query<number, CaseListRequest | void>({
            query: (params) => ({
                url: CASE_COUNT,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [CASE_TAG]
        }),
        getCase: builder.query<CaseItem, CaseRequest>({
            query: (req) => ({
                url: `${CASE}/${req.Uuid}`,
                method: METHOD_GET,
            }),
        }),
        addCase: builder.mutation<void, CaseAddRequest>({
            query: (body) => ({
                url: CASE,
                method: METHOD_POST,
                body
            }),
            invalidatesTags: [CASE_TAG]
        }),
        editCase: builder.mutation<void, CaseEditRequest>({
            query: (body) => ({
                url: CASE,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: [CASE_TAG]
        }),
        deleteCase: builder.mutation<void, CaseDeleteRequest>({
            query: (body) => ({
                url: `${CASE}/${body.Uuid}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: [CASE_TAG]
        }),
    })
})

export const {
    useLazyGetCaseQuery,
    useGetCasesQuery,
    useGetCasesCountsQuery,
    useGetCaseQuery,
    useAddCaseMutation,
    useEditCaseMutation,
    useDeleteCaseMutation,
} = caseQuery;