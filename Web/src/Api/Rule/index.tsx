import { gatewayApi } from "@Api/api";
import { METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT, RULE, RULE_CLEAR, RULE_GETLOG, RULE_LOG_TAG, RULE_STOP, RULE_TAG } from "@Constant/api";
import { DefaultRequestType } from "@Constant/common";
import { RuleAddRequest, RuleClearRequest, RuleDeleteRequest, RuleEditRequest, RuleItem, RuleLogItem, RuleLogRequest, RuleRequest, RuleStopRequest } from "./type";

export const ruleQuery = gatewayApi.enhanceEndpoints({ addTagTypes: [RULE_TAG, RULE_LOG_TAG] }).injectEndpoints({
    endpoints: (builder) => ({
        getRules: builder.query<RuleItem[], DefaultRequestType | void>({
            query: (params) => ({
                url: RULE,
                method: METHOD_GET,
                params: params || undefined
            }),
            providesTags: [RULE_TAG]
        }),
        getRule: builder.query<RuleItem, RuleRequest>({
            query: (req) => ({
                url: `${RULE}/${req.Uuid}`,
                method: METHOD_GET,
            }),
        }),
        getRuleLog: builder.query<RuleLogItem[], RuleLogRequest>({
            query: (req) => ({
                url: `${RULE_GETLOG}/${req.Uuid}`,
                method: METHOD_GET,
            }),
            providesTags: [RULE_LOG_TAG]
        }),
        addRule: builder.mutation<void, RuleAddRequest>({
            query: (body) => ({
                url: RULE,
                method: METHOD_POST,
                body
            }),
            invalidatesTags: (result) => result ? [RULE_TAG] : [],
        }),
        editRule: builder.mutation<void, RuleEditRequest>({
            query: (body) => ({
                url: RULE,
                method: METHOD_PUT,
                body
            }),
            invalidatesTags: (result) => result ? [RULE_TAG] : [],
        }),
        clearRuleLog: builder.mutation<void, RuleClearRequest>({
            query: (body) => ({
                url: `${RULE_CLEAR}/${body.Uuid}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: (result) => result ? [RULE_LOG_TAG] : [],
        }),
        stopRule: builder.mutation<void, RuleStopRequest>({
            query: (body) => ({
                url: `${RULE_STOP}/${body.Uuid}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: (result) => result ? [RULE_TAG] : [],
        }),
        deleteRule: builder.mutation<void, RuleDeleteRequest>({
            query: (body) => ({
                url: `${RULE}/${body.Uuid}`,
                method: METHOD_DELETE,
            }),
            invalidatesTags: (result) => result ? [RULE_TAG] : [],
        }),
    })
})

export const {
    useGetRulesQuery,
    useGetRuleQuery,
    useLazyGetRuleQuery,
    useAddRuleMutation,
    useDeleteRuleMutation,
    useEditRuleMutation,
    useClearRuleLogMutation,
    useStopRuleMutation,
    useGetRuleLogQuery,
} = ruleQuery;