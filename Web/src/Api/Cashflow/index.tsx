import { gatewayApi } from "@Api/api";
import { CASHFLOW, CASHFLOW_GRAPH, CASHFLOW_TAG, METHOD_GET, METHOD_POST } from "@Constant/api";
import {
    CashflowAddRequest,
    CashflowGraphRequest,
    CashflowGraphResponse,
    CashflowItem,
    CashflowListRequest,
} from "./type";

export const cashflowQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [CASHFLOW_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getCashflows: builder.query<CashflowItem[], CashflowListRequest | void>({
                query: (params) => ({
                    url: CASHFLOW,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [CASHFLOW_TAG],
            }),
            getCashflowGraph: builder.query<CashflowGraphResponse, CashflowGraphRequest>({
                query: (params) => ({
                    url: CASHFLOW_GRAPH,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [CASHFLOW_TAG],
            }),
            addCashflow: builder.mutation<void, CashflowAddRequest>({
                query: (body) => ({
                    url: CASHFLOW,
                    method: METHOD_POST,
                    body,
                }),
                invalidatesTags: (_, error) => error ? [] : [CASHFLOW_TAG],
            }),
        }),
    });

export const {
    useGetCashflowsQuery,
    useGetCashflowGraphQuery,
    useAddCashflowMutation,
} = cashflowQuery;
