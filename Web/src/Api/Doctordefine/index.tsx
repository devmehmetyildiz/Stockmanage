import { gatewayApi } from "@Api/api";
import { DOCTORDEFINE, DOCTORDEFINE_COUNT, DOCTORDEFINE_TAG, METHOD_DELETE, METHOD_GET, METHOD_POST, METHOD_PUT } from "@Constant/api";
import {
    DoctordefineAddRequest,
    DoctordefineDeleteRequest,
    DoctordefineEditRequest,
    DoctordefineItem,
    DoctordefineListRequest,
    DoctordefineRequest
} from "./type";

export const doctordefineQuery = gatewayApi
    .enhanceEndpoints({ addTagTypes: [DOCTORDEFINE_TAG] })
    .injectEndpoints({
        endpoints: (builder) => ({
            getDoctordefines: builder.query<DoctordefineItem[], DoctordefineListRequest | void>({
                query: (params) => ({
                    url: DOCTORDEFINE,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [DOCTORDEFINE_TAG],
            }),
            getDoctordefinesCount: builder.query<number, DoctordefineListRequest | void>({
                query: (params) => ({
                    url: DOCTORDEFINE_COUNT,
                    method: METHOD_GET,
                    params: params || undefined,
                }),
                providesTags: [DOCTORDEFINE_TAG],
            }),
            getDoctordefine: builder.query<DoctordefineItem, DoctordefineRequest>({
                query: (req) => ({
                    url: `${DOCTORDEFINE}/${req.Uuid}`,
                    method: METHOD_GET,
                }),
            }),
            addDoctordefine: builder.mutation<void, DoctordefineAddRequest>({
                query: (body) => ({
                    url: DOCTORDEFINE,
                    method: METHOD_POST,
                    body,
                }),
                invalidatesTags: (result) => result ? [DOCTORDEFINE_TAG] : [],
            }),
            editDoctordefine: builder.mutation<void, DoctordefineEditRequest>({
                query: (body) => ({
                    url: DOCTORDEFINE,
                    method: METHOD_PUT,
                    body,
                }),
                invalidatesTags: (result) => result ? [DOCTORDEFINE_TAG] : [],
            }),
            deleteDoctordefine: builder.mutation<void, DoctordefineDeleteRequest>({
                query: (body) => ({
                    url: `${DOCTORDEFINE}/${body.Uuid}`,
                    method: METHOD_DELETE,
                }),
                invalidatesTags: (result) => result ? [DOCTORDEFINE_TAG] : [],
            }),
        }),
    });

export const {
    useLazyGetDoctordefineQuery,
    useGetDoctordefinesQuery,
    useGetDoctordefinesCountQuery,
    useGetDoctordefineQuery,
    useAddDoctordefineMutation,
    useEditDoctordefineMutation,
    useDeleteDoctordefineMutation,
} = doctordefineQuery;
