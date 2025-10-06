import { gatewayApi } from "@Api/api";
import { LOCATION, LOCATION_COUNT, LOCATION_TAG, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from "@Constant/api";
import { LocationAddRequest, LocationDeleteRequest, LocationEditRequest, LocationItem, LocationListRequest, LocationRequest } from "./type";

export const locationQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [LOCATION_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getLocations: builder.query<LocationItem[], LocationListRequest | void>({
                query: (params) => ({
                    url: LOCATION,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [LOCATION_TAG],
            }),
            getLocationsCount: builder.query<number, LocationListRequest | void>({
                query: (params) => ({
                    url: LOCATION_COUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [LOCATION_TAG],
            }),
            getLocation: builder.query<LocationItem, LocationRequest>({
                query: (req) => ({
                    url: `${LOCATION}/${req.Uuid}`,
                    method: METHOD_GET,
                }),
            }),
            addLocation: builder.mutation<void, LocationAddRequest>({
                query: (body) => ({
                    url: LOCATION,
                    method: METHOD_POST,
                    body,
                }),
                invalidatesTags: [LOCATION_TAG],
            }),
            editLocation: builder.mutation<void, LocationEditRequest>({
                query: (body) => ({
                    url: LOCATION,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: [LOCATION_TAG],
            }),
            deleteLocation: builder.mutation<void, LocationDeleteRequest>({
                query: (body) => ({
                    url: `${LOCATION}/${body.Uuid}`,
                    method: METHOD_DELETE,
                }),
                invalidatesTags: [LOCATION_TAG],
            }),
        }),
    });

export const {
    useLazyGetLocationQuery,
    useGetLocationsQuery,
    useGetLocationsCountQuery,
    useGetLocationQuery,
    useAddLocationMutation,
    useEditLocationMutation,
    useDeleteLocationMutation,
} = locationQuery;
