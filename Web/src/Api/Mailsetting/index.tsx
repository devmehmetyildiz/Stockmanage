import { gatewayApi } from "@Api/api";
import { METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT, MAILSETTING, MAILSETTING_TAG } from "@Constant/api";
import { DefaultRequestType } from "@Constant/common";
import { MailsettingAddRequest, MailsettingDeleteRequest, MailsettingEditRequest, MailsettingItem, MailsettingRequest } from "./type";

export const mailsettingQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [MAILSETTING_TAG] }).injectEndpoints({
    endpoints: (builder) => ({
        getMailsettings: builder.query<MailsettingItem[], DefaultRequestType | void>({
            query: (params) => ({
                url: MAILSETTING,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [MAILSETTING_TAG]
        }),
        getMailsetting: builder.query<MailsettingItem, MailsettingRequest>({
            query: (req) => ({
                url: `${MAILSETTING}/${req.Uuid}`,
                method: METHOD_GET,
            }),
        }),
        addMailsetting: builder.mutation<void, MailsettingAddRequest>({
            query: (body) => ({
                url: MAILSETTING,
                method: METHOD_POST,
                body
            }),
            invalidatesTags: (result) => result ? [MAILSETTING_TAG] : [],
        }),
        editMailsetting: builder.mutation<void, MailsettingEditRequest>({
            query: (body) => ({
                url: MAILSETTING,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: (result) => result ? [MAILSETTING_TAG] : [],
        }),
        deleteMailsetting: builder.mutation<void, MailsettingDeleteRequest>({
            query: (body) => ({
                url: `${MAILSETTING}/${body.Uuid}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: (result) => result ? [MAILSETTING_TAG] : [],
        }),
    })
})

export const {
    useGetMailsettingsQuery,
    useLazyGetMailsettingQuery,
    useAddMailsettingMutation,
    useDeleteMailsettingMutation,
    useEditMailsettingMutation,
} = mailsettingQuery;