import { gatewayApi } from "@Api/api";
import { STOCKDEFINE, STOCKDEFINE_COUNT, STOCKDEFINE_TAG, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from "@Constant/api";
import {
    StockdefineAddRequest,
    StockdefineDeleteRequest,
    StockdefineEditRequest,
    StockdefineItem,
    StockdefineListRequest,
    StockdefineRequest
} from "./type";

export const stockdefineQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [STOCKDEFINE_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getStockdefines: builder.query<StockdefineItem[], StockdefineListRequest | void>({
                query: (params) => ({
                    url: STOCKDEFINE,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [STOCKDEFINE_TAG],
            }),
            getStockdefinesCount: builder.query<number, StockdefineListRequest | void>({
                query: (params) => ({
                    url: STOCKDEFINE_COUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [STOCKDEFINE_TAG],
            }),
            getStockdefine: builder.query<StockdefineItem, StockdefineRequest>({
                query: (req) => ({
                    url: `${STOCKDEFINE}/${req.Uuid}`,
                    method: METHOD_GET,
                }),
            }),
            addStockdefine: builder.mutation<void, StockdefineAddRequest>({
                query: (body) => ({
                    url: STOCKDEFINE,
                    method: METHOD_POST,
                    body,
                }),
                invalidatesTags: (result) => result ? [STOCKDEFINE_TAG] : [],
            }),
            editStockdefine: builder.mutation<void, StockdefineEditRequest>({
                query: (body) => ({
                    url: STOCKDEFINE,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: (result) => result ? [STOCKDEFINE_TAG] : [],
            }),
            deleteStockdefine: builder.mutation<void, StockdefineDeleteRequest>({
                query: (body) => ({
                    url: `${STOCKDEFINE}/${body.Uuid}`,
                    method: METHOD_DELETE,
                }),
                invalidatesTags: (result) => result ? [STOCKDEFINE_TAG] : [],
            }),
        }),
    });

export const {
    useLazyGetStockdefineQuery,
    useGetStockdefinesQuery,
    useGetStockdefinesCountQuery,
    useGetStockdefineQuery,
    useAddStockdefineMutation,
    useEditStockdefineMutation,
    useDeleteStockdefineMutation,
} = stockdefineQuery;
