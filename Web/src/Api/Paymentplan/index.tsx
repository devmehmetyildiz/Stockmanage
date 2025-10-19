import { gatewayApi } from "@Api/api";
import { METHOD_GET, PAYMENTPLAN_TAG, PAYMENTPLAN, PAYMENTPLAN_COUNT, PAYMENTPLAN_TRANSACTION_COUNT, PAYMENTPLAN_TRANSACTION, } from "@Constant/api";
import { PaymentplanItem, PaymentplanListItem, PaymentplanListRequest, PaymentplanRequest, PaymentplanTransactionListRequest } from "./type";

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
            getPaymentplantransactions: builder.query<PaymentplanTransactionListRequest[], PaymentplanTransactionListRequest | void>({
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
        }),
    });

export const {
    useLazyGetPaymentplanQuery,
    useGetPaymentplansQuery,
    useGetPaymentplansCountQuery,
    useGetPaymentplanQuery,
    useGetPaymentplantransactionsQuery,
    useGetPaymentplantransactionCountsQuery
} = paymentplanQuery;
