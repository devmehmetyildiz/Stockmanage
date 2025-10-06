import { gatewayApi } from "@Api/api";
import { PAYMENTTYPE, PAYMENTTYPE_COUNT, PAYMENTTYPE_TAG, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from "@Constant/api";
import {
    PaymenttypeAddRequest,
    PaymenttypeDeleteRequest,
    PaymenttypeEditRequest,
    PaymenttypeItem,
    PaymenttypeListRequest,
    PaymenttypeRequest
} from "./type";

export const paymenttypeQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [PAYMENTTYPE_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getPaymenttypes: builder.query<PaymenttypeItem[], PaymenttypeListRequest | void>({
                query: (params) => ({
                    url: PAYMENTTYPE,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [PAYMENTTYPE_TAG],
            }),
            getPaymenttypesCount: builder.query<number, PaymenttypeListRequest | void>({
                query: (params) => ({
                    url: PAYMENTTYPE_COUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [PAYMENTTYPE_TAG],
            }),
            getPaymenttype: builder.query<PaymenttypeItem, PaymenttypeRequest>({
                query: (req) => ({
                    url: `${PAYMENTTYPE}/${req.Uuid}`,
                    method: METHOD_GET,
                }),
            }),
            addPaymenttype: builder.mutation<void, PaymenttypeAddRequest>({
                query: (body) => ({
                    url: PAYMENTTYPE,
                    method: METHOD_POST,
                    body,
                }),
                invalidatesTags: [PAYMENTTYPE_TAG],
            }),
            editPaymenttype: builder.mutation<void, PaymenttypeEditRequest>({
                query: (body) => ({
                    url: PAYMENTTYPE,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: [PAYMENTTYPE_TAG],
            }),
            deletePaymenttype: builder.mutation<void, PaymenttypeDeleteRequest>({
                query: (body) => ({
                    url: `${PAYMENTTYPE}/${body.Uuid}`,
                    method: METHOD_DELETE,
                }),
                invalidatesTags: [PAYMENTTYPE_TAG],
            }),
        }),
    });

export const {
    useLazyGetPaymenttypeQuery,
    useGetPaymenttypesQuery,
    useGetPaymenttypesCountQuery,
    useGetPaymenttypeQuery,
    useAddPaymenttypeMutation,
    useEditPaymenttypeMutation,
    useDeletePaymenttypeMutation,
} = paymenttypeQuery;
