import { gatewayApi } from "@Api/api";
import {
    METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT, USER, USER_COUNT, USER_LIST,
    USER_REMOVE, USER_TAG,
} from "@Constant/api";
import {
    UserAddApiRequest, UserDeleteRequest, UserEditApiRequest,
    UserItem, UserListItem, UserListRequestType, UserListResponse,
    UserRemoveRequest, UserRequest
} from "./type";

export const userQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [USER_TAG] }).injectEndpoints({
    endpoints: (builder) => ({
        getUsersCount: builder.query<UserListResponse, UserListRequestType | void>({
            query: (params) => ({
                url: USER_COUNT,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [USER_TAG]
        }),
        getUsersList: builder.query<UserListItem[], UserListRequestType | void>({
            query: (params) => ({
                url: USER_LIST,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [USER_TAG]
        }),
        getUsers: builder.query<UserListResponse, UserListRequestType | void>({
            query: (params) => ({
                url: USER,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [USER_TAG]
        }),
        getUser: builder.query<UserItem, UserRequest>({
            query: (req) => ({
                url: `${USER}/${req.Uuid}`,
                method: METHOD_GET,
            }),
            providesTags: [USER_TAG]
        }),
        addUser: builder.mutation<UserListResponse, UserAddApiRequest>({
            query: (body) => ({
                url: USER,
                method: METHOD_POST,
                body
            }),
            invalidatesTags: [USER_TAG]
        }),
        editUser: builder.mutation<UserListResponse, UserEditApiRequest>({
            query: (body) => ({
                url: USER,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: [USER_TAG]
        }),
        removeUser: builder.mutation<void, UserRemoveRequest>({
            query: (body) => ({
                url: USER_REMOVE,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: [USER_TAG]
        }),
        deleteUser: builder.mutation<void, UserDeleteRequest>({
            query: (body) => ({
                url: `${USER}/${body.Uuid}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: [USER_TAG]
        }),
    })
})

export const {
    useGetUsersListQuery,
    useGetUsersQuery,
    useGetUsersCountQuery,
    useLazyGetUserQuery,
    useGetUserQuery,
    useAddUserMutation,
    useDeleteUserMutation,
    useEditUserMutation,
    useRemoveUserMutation,
} = userQuery;