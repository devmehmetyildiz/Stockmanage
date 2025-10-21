import { gatewayApi } from "@Api/api";
import { METHOD_GET, PAYMENTPLAN_TAG, PAYMENTPLAN, PAYMENTPLAN_COUNT, PAYMENTPLAN_TRANSACTION_COUNT, PAYMENTPLAN_TRANSACTION, PAYMENTPLAN_APPROVE_TRANSACTION, METHOD_PUT, } from "@Constant/api";
import { PaymentplanApproveTransactionRequest, PaymentplanItem, PaymentplanListItem, PaymentplanListRequest, PaymentplanRequest, PaymentplanTransactionItem, PaymentplanTransactionListRequest } from "./type";

export const paymentplanQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [PAYMENTPLAN_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getPaymentplans: builder.query<PaymentplanListItem[], PaymentplanListRequest | void>({
                query: (params) => ({
                    url: PAYMENTPLAN,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [PAYMENTPLAN_TAG],
            }),
            getPaymentplantransactions: builder.query<PaymentplanTransactionItem[], PaymentplanTransactionListRequest | void>({
                query: (params) => ({
                    url: PAYMENTPLAN_TRANSACTION,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [PAYMENTPLAN_TAG],
            }),
            getPaymentplantransactionCounts: builder.query<number, PaymentplanTransactionListRequest | void>({
                query: (params) => ({
                    url: PAYMENTPLAN_TRANSACTION_COUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [PAYMENTPLAN_TAG],
            }),
            getPaymentplansCount: builder.query<number, PaymentplanListRequest | void>({
                query: (params) => ({
                    url: PAYMENTPLAN_COUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [PAYMENTPLAN_TAG],
            }),
            getPaymentplan: builder.query<PaymentplanItem, PaymentplanRequest>({
                query: (req) => ({
                    url: `${PAYMENTPLAN}/${req.Uuid}`,
                    method: METHOD_GET,
                }),
            }),
            approvePaymentplanTransaction: builder.mutation<void, PaymentplanApproveTransactionRequest>({
                query: (body) => ({
                    url: PAYMENTPLAN_APPROVE_TRANSACTION,
                    method: METHOD_PUT,
                    body
                }),
                invalidatesTags: (result) => result ? [PAYMENTPLAN_TAG] : [],
            }),
        }),
    });

export const {
    useLazyGetPaymentplanQuery,
    useGetPaymentplansQuery,
    useGetPaymentplansCountQuery,
    useGetPaymentplanQuery,
    useGetPaymentplantransactionsQuery,
    useGetPaymentplantransactionCountsQuery,
    useApprovePaymentplanTransactionMutation,
} = paymentplanQuery;
