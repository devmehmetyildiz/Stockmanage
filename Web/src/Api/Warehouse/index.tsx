import { gatewayApi } from "@Api/api";
import { WAREHOUSE, WAREHOUSE_COUNT, WAREHOUSE_TAG, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from "@Constant/api";
import { WarehouseAddRequest, WarehouseDeleteRequest, WarehouseEditRequest, WarehouseItem, WarehouseListRequest, WarehouseRequest } from "./type";

export const warehouseQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [WAREHOUSE_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getWarehouses: builder.query<WarehouseItem[], WarehouseListRequest | void>({
                query: (params) => ({
                    url: WAREHOUSE,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [WAREHOUSE_TAG],
            }),
            getWarehousesCount: builder.query<number, WarehouseListRequest | void>({
                query: (params) => ({
                    url: WAREHOUSE_COUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [WAREHOUSE_TAG],
            }),
            getWarehouse: builder.query<WarehouseItem, WarehouseRequest>({
                query: (req) => ({
                    url: `${WAREHOUSE}/${req.Uuid}`,
                    method: METHOD_GET,
                }),
            }),
            addWarehouse: builder.mutation<void, WarehouseAddRequest>({
                query: (body) => ({
                    url: WAREHOUSE,
                    method: METHOD_POST,
                    body,
                }),
                invalidatesTags: [WAREHOUSE_TAG],
            }),
            editWarehouse: builder.mutation<void, WarehouseEditRequest>({
                query: (body) => ({
                    url: WAREHOUSE,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: [WAREHOUSE_TAG],
            }),
            deleteWarehouse: builder.mutation<void, WarehouseDeleteRequest>({
                query: (body) => ({
                    url: `${WAREHOUSE}/${body.Uuid}`,
                    method: METHOD_DELETE,
                }),
                invalidatesTags: [WAREHOUSE_TAG],
            }),
        }),
    });

export const {
    useLazyGetWarehouseQuery,
    useGetWarehousesQuery,
    useGetWarehousesCountQuery,
    useGetWarehouseQuery,
    useAddWarehouseMutation,
    useEditWarehouseMutation,
    useDeleteWarehouseMutation,
} = warehouseQuery;
