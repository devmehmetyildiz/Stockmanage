import { gatewayApi } from "@Api/api";
import { METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT, STOCK_CREATE_STOCK, STOCK_DELETE_MOVEMENT, STOCK_DELETE_STOCK, STOCK_GET_MOVEMENT, STOCK_GET_STOCK, STOCK_INSERT_STOCK, STOCK_TAG } from "@Constant/api";
import { StockCreateRequest, StockDeleteMovementRequest, StockDeleteRequest, StockInsertRequest, StockItem, StockListRequestType, StockmovementItem, StockmovementListRequest, StockUseRequest } from "./type";

export const stockQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [STOCK_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getStocks: builder.query<StockItem[], StockListRequestType | void>({
                query: (params) => ({
                    url: STOCK_GET_STOCK,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [STOCK_TAG],
            }),
            getStockMovements: builder.query<StockmovementItem[], StockmovementListRequest | void>({
                query: (params) => ({
                    url: STOCK_GET_MOVEMENT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [STOCK_TAG],
            }),
            createStock: builder.mutation<void, StockCreateRequest>({
                query: (body) => ({
                    url: STOCK_CREATE_STOCK,
                    method: METHOD_POST,
                    body
                }),
                invalidatesTags: [STOCK_TAG],
            }),
            useStock: builder.mutation<void, StockUseRequest>({
                query: (body) => ({
                    url: STOCK_CREATE_STOCK,
                    method: METHOD_PUT,
                    body
                }),
                invalidatesTags: [STOCK_TAG],
            }),
            insertStock: builder.mutation<void, StockInsertRequest>({
                query: (body) => ({
                    url: STOCK_INSERT_STOCK,
                    method: METHOD_PUT,
                    body
                }),
                invalidatesTags: [STOCK_TAG],
            }),
            deleteStock: builder.mutation<void, StockDeleteRequest>({
                query: (body) => ({
                    url: `${STOCK_DELETE_STOCK}/${body.Uuid}`,
                    method: METHOD_DELETE,
                }),
                invalidatesTags: [STOCK_TAG],
            }),
            deleteStockMovement: builder.mutation<void, StockDeleteMovementRequest>({
                query: (body) => ({
                    url: `${STOCK_DELETE_MOVEMENT}/${body.Uuid}`,
                    method: METHOD_DELETE,
                }),
                invalidatesTags: [STOCK_TAG],
            }),
        }),
    });

export const {
    useLazyGetStockMovementsQuery,
    useCreateStockMutation,
    useDeleteStockMovementMutation,
    useDeleteStockMutation,
    useGetStockMovementsQuery,
    useGetStocksQuery,
    useInsertStockMutation,
    useUseStockMutation
} = stockQuery;
