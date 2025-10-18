import { gatewayApi } from "@Api/api";
import { METHOD_GET, PAYMENTPLAN_TAG, PAYMENTPLAN, PAYMENTPLAN_COUNT, } from "@Constant/api";
import { PaymentplanItem, PaymentplanListItem, PaymentplanListRequest, PaymentplanRequest } from "./type";

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
} = paymentplanQuery;
