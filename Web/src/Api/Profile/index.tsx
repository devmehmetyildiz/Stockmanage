import { gatewayApi } from "@Api/api";
import { METHOD_DELETE, METHOD_GET, METHOD_POST, PROFILE_DELETE_TABLEMETA, PROFILE_GET_TABLEMETA, PROFILE_META, PROFILE_USER_PRIVILEGES, PROFILE_SAVE_TABLEMETA, TABLE_CONFIG_TAG, PROFILE_CHANGEPASSWORD, META_TAG } from "@Constant/api";
import { ProfileChangePasswordRequest, ProfileMetaResponse, TableMetaDeleteRequest, TableMetaGetRequest, TableMetaSaveRequest, } from "./type";

export const profileQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [TABLE_CONFIG_TAG, META_TAG] }).injectEndpoints({
    overrideExisting: false,
    endpoints: (builder) => ({
        getMeta: builder.query<ProfileMetaResponse, void>({
            query: () => ({
                url: PROFILE_META,
                method: METHOD_GET,
            }),
            providesTags: [META_TAG]
        }),
        getPrivileges: builder.query<string[], void>({
            query: () => ({
                url: PROFILE_USER_PRIVILEGES,
                method: METHOD_GET,
            }),
            providesTags: [META_TAG]
        }),
        getTableMeta: builder.query<any, TableMetaGetRequest>({
            query: (params) => ({
                url: PROFILE_GET_TABLEMETA,
                method: METHOD_GET,
                params: params
            }),
            providesTags: [TABLE_CONFIG_TAG]
        }),
        saveTableMeta: builder.mutation<any, TableMetaSaveRequest>({
            query: (body) => ({
                url: PROFILE_SAVE_TABLEMETA,
                method: METHOD_POST,
                body: body
            }),
            invalidatesTags: [TABLE_CONFIG_TAG]
        }),
        changePassword: builder.mutation<any, ProfileChangePasswordRequest>({
            query: (body) => ({
                url: PROFILE_CHANGEPASSWORD,
                method: METHOD_POST,
                body: body
            }),
        }),
        deleteTableMeta: builder.mutation<any, TableMetaDeleteRequest>({
            query: (body) => ({
                url: PROFILE_DELETE_TABLEMETA,
                method: METHOD_DELETE,
                body: body
            }),
            invalidatesTags: [TABLE_CONFIG_TAG]
        }),
    })
})

export const {
    useGetMetaQuery,
    useGetPrivilegesQuery,
    useGetTableMetaQuery,
    useSaveTableMetaMutation,
    useDeleteTableMetaMutation,
    useChangePasswordMutation
} = profileQuery;