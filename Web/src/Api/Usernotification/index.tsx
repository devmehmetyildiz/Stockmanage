import { gatewayApi } from "@Api/api";
import {
    METHOD_DELETE, METHOD_GET, METHOD_PUT, NOTIFICATION_UPDATE_TAG, USERNOTIFICATION, USERNOTIFICATION_DELETE_BY_USERID, USERNOTIFICATION_DELETE_READ_BY_USERID,
    USERNOTIFICATION_EDIT_RECORD, USERNOTIFICATION_GET_LAST, USERNOTIFICATION_GET_UNREAD, USERNOTIFICATION_GET_UNSHOWED, USERNOTIFICATION_READ_ALL, USERNOTIFICATION_SHOW_ALL
} from "@Constant/api";
import { UserNotificationDeleteByUserRequest, UserNotificationDeleteRequest, UserNotificationEditRequest, UserNotificationGetRequest, UserNotificationItem, UserNotificationRequestType } from "./type";

export const usernotificationQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [NOTIFICATION_UPDATE_TAG] }).injectEndpoints({
    endpoints: (builder) => ({
        getUserNotifications: builder.query<UserNotificationItem[], UserNotificationRequestType>({
            query: (params) => ({
                url: USERNOTIFICATION,
                method: METHOD_GET,
                params
            }),
            providesTags: [NOTIFICATION_UPDATE_TAG]
        }),
        getLastUserNotificationsByUuid: builder.query<UserNotificationItem[], UserNotificationGetRequest>({
            query: (params) => ({
                url: `${USERNOTIFICATION_GET_LAST}/${params.userId}`,
                method: METHOD_GET,
            }),
            providesTags: [NOTIFICATION_UPDATE_TAG]
        }),
        getUnReadNotificationCount: builder.query<number, UserNotificationGetRequest>({
            query: (params) => ({
                url: `${USERNOTIFICATION_GET_UNREAD}/${params.userId}`,
                method: METHOD_GET,
            }),
        }),
        getUnShowNotificationCount: builder.query<number, UserNotificationGetRequest>({
            query: (params) => ({
                url: `${USERNOTIFICATION_GET_UNSHOWED}/${params.userId}`,
                method: METHOD_GET,
            }),
        }),
        readAllNotifications: builder.mutation<void, UserNotificationGetRequest>({
            query: (params) => ({
                url: `${USERNOTIFICATION_READ_ALL}/${params.userId}`,
                method: METHOD_GET,
            }),
            invalidatesTags: [NOTIFICATION_UPDATE_TAG]
        }),
        showAllNotifications: builder.mutation<void, UserNotificationGetRequest>({
            query: (params) => ({
                url: `${USERNOTIFICATION_SHOW_ALL}/${params.userId}`,
                method: METHOD_GET,
            }),
            invalidatesTags: [NOTIFICATION_UPDATE_TAG]
        }),
        editUserNotification: builder.mutation<void, UserNotificationEditRequest[]>({
            query: (body) => ({
                url: `${USERNOTIFICATION_EDIT_RECORD}`,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: [NOTIFICATION_UPDATE_TAG]
        }),
        deleteNotification: builder.mutation<void, UserNotificationDeleteRequest>({
            query: (params) => ({
                url: `${USERNOTIFICATION}/${params.notificationId}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: [NOTIFICATION_UPDATE_TAG]
        }),
        deleteAllNotification: builder.mutation<void, UserNotificationDeleteByUserRequest>({
            query: (params) => ({
                url: `${USERNOTIFICATION_DELETE_BY_USERID}/${params.userId}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: [NOTIFICATION_UPDATE_TAG]
        }),
        deleteReadNotification: builder.mutation<void, UserNotificationDeleteByUserRequest>({
            query: (params) => ({
                url: `${USERNOTIFICATION_DELETE_READ_BY_USERID}/${params.userId}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: [NOTIFICATION_UPDATE_TAG]
        }),
    })
})

export const {
    useGetUserNotificationsQuery,
    useLazyGetLastUserNotificationsByUuidQuery,
    useLazyGetUnReadNotificationCountQuery,
    useLazyGetUnShowNotificationCountQuery,
    useShowAllNotificationsMutation,
    useReadAllNotificationsMutation,
    useEditUserNotificationMutation,
    useDeleteNotificationMutation,
    useDeleteAllNotificationMutation,
    useDeleteReadNotificationMutation
} = usernotificationQuery;