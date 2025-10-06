import { gatewayApi } from "@Api/api";
import { LOGIN, LOGOUT, META_TAG, METHOD_GET, METHOD_POST, PASSWORD_FORGETREQUEST, PASSWORD_GET_RESETUSER, PASSWORD_RESETREQUEST } from "@Constant/api";
import { LoginRequest, LoginResponse, LogoutRequest, PasswordForgetRequest, PasswordResetRequest, PasswordResetUserRequest } from "./type";
import { UserItem } from "@Api/User/type";

export const authQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [META_TAG] }).injectEndpoints({
    endpoints: (builder) => ({
        getPasswordResetUser: builder.query<UserItem, PasswordResetUserRequest>({
            query: (body) => ({
                url: `${PASSWORD_GET_RESETUSER}/${body.requestId}`,
                method: METHOD_GET,
            }),
        }),
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (body) => ({
                url: LOGIN,
                method: METHOD_POST,
                body
            }),
            invalidatesTags: [META_TAG]
        }),
        logout: builder.mutation<void, LogoutRequest>({
            query: (body) => ({
                url: LOGOUT,
                method: METHOD_POST,
                body
            }),
        }),
        passwordForget: builder.mutation<void, PasswordForgetRequest>({
            query: (body) => ({
                url: `${PASSWORD_FORGETREQUEST}/${body.email}`,
                method: METHOD_GET,
            }),
        }),
        passwordReset: builder.mutation<void, PasswordResetRequest>({
            query: (body) => ({
                url: PASSWORD_RESETREQUEST,
                method: METHOD_POST,
                body
            }),
        }),
    })
})

export const {
    useLoginMutation,
    useLogoutMutation,
    usePasswordForgetMutation,
    usePasswordResetMutation,
    useLazyGetPasswordResetUserQuery
} = authQuery;