import { gatewayApi } from "@Api/api";
import { METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT, ROLE, ROLE_PRIVILEGE, ROLE_PRIVILEGEGROUPS, ROLE_TAG } from "@Constant/api";
import { DefaultRequestType } from "@Constant/common";
import { RoleAddRequest, RoleDeleteRequest, RoleEditRequest, RoleItem, RolePrivilegesItem, RolePrivilegeTextType, RoleRequest } from "./type";

export const roleQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [ROLE_TAG] }).injectEndpoints({
    endpoints: (builder) => ({
        getRoles: builder.query<RoleItem[], DefaultRequestType | void>({
            query: (params) => ({
                url: ROLE,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [ROLE_TAG]
        }),
        getRole: builder.query<RoleItem, RoleRequest>({
            query: (req) => ({
                url: `${ROLE}/${req.Uuid}`,
                method: METHOD_GET,
            }),
        }),
        getPrivilegeDefines: builder.query<RolePrivilegesItem[], void>({
            query: () => ({
                url: ROLE_PRIVILEGE,
                method: METHOD_GET,
            }),
        }),
        getPrivilegeGroupDefines: builder.query<RolePrivilegeTextType[], void>({
            query: () => ({
                url: ROLE_PRIVILEGEGROUPS,
                method: METHOD_GET,
            }),
        }),
        addRole: builder.mutation<void, RoleAddRequest>({
            query: (body) => ({
                url: ROLE,
                method: METHOD_POST,
                body
            }),
            invalidatesTags: (result) => result ? [ROLE_TAG] : [],
        }),
        editRole: builder.mutation<void, RoleEditRequest>({
            query: (body) => ({
                url: ROLE,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: (result) => result ? [ROLE_TAG] : [],
        }),
        deleteRole: builder.mutation<void, RoleDeleteRequest>({
            query: (body) => ({
                url: `${ROLE}/${body.Uuid}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: (result) => result ? [ROLE_TAG] : [],
        }),
    })
})

export const {
    useGetRolesQuery,
    useGetPrivilegeDefinesQuery,
    useGetPrivilegeGroupDefinesQuery,
    useLazyGetRoleQuery,
    useAddRoleMutation,
    useDeleteRoleMutation,
    useEditRoleMutation,
} = roleQuery;