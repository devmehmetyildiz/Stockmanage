import { API_FETCH_ERROR, API_UNAUTHORIZE_ERROR, STORAGE_KEY_PATIENTCARE_LANGUAGE, STORAGE_KEY_PATIENTCARE_REFRESHTOKEN } from "@Constant/index";
import { BaseQueryApi, BaseQueryFn, FetchArgs, fetchBaseQuery, FetchBaseQueryError, FetchBaseQueryMeta, QueryReturnValue } from "@reduxjs/toolkit/query";
import Pushnotification from "@Utils/Pushnotification";
import { RootState } from "./store";
import { logout, setCredentials } from "./Auth/slice";
import Paths from "../Constant/path";
import { Mutex } from "async-mutex";
import { METHOD_POST } from "@Constant/api";
import { LoginResponse } from "./Auth/type";
import validator from "@Utils/Validator";
import RouteKeys from "@Constant/routeKeys";

interface BaseQueryType {
    baseUrl: string;
}

const mutex = new Mutex();

const checkError = async (result: QueryReturnValue<unknown, FetchBaseQueryError, FetchBaseQueryMeta>, api: BaseQueryApi) => {
    if (result.error) {
        if (result.error.status === API_UNAUTHORIZE_ERROR) {
            const data = result.error.data as any;
            const list = data?.list;
            Pushnotification(list.map((item: any) => ({
                Type: 'Error',
                Subject: item.code,
                Description: item.description,
            })));
            if (window.location.pathname !== Paths.Login) {
                setTimeout(() => {
                    api.dispatch(logout());
                }, 1000);
            }
        } else if (result.error.status === API_FETCH_ERROR) {
            Pushnotification({
                Type: 'Error',
                Subject: String(result.error?.status),
                Description: `${result.meta?.request.url} ${String(result.error?.error)}`,
            });
        } else {
            const error = result.error as any
            const data = error?.data as any;

            const list = data?.list;
            if (list && Array.isArray(list)) {
                Pushnotification(list.map((item: any) => ({
                    Type: 'Error',
                    Subject: item.code,
                    Description: item.description,
                })));
            } else {
                if (data?.code && data?.description) {
                    Pushnotification({
                        Type: 'Error',
                        Subject: data.code,
                        Description: `${result.meta?.request.url} ${data.description}`,
                    });
                } else {
                    Pushnotification({
                        Type: 'Error',
                        Subject: "GATEWAY_ERROR",
                        Description: validator.isFile(data) ? "File Download Error" : `${Object.keys(data).length > 0 ? JSON.stringify(data) : data}`,
                    });
                }
            }
        }
    }
}

const getRawBaseQuery = (baseUrl: string) => fetchBaseQuery({
    baseUrl: baseUrl,
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        const language = localStorage.getItem(STORAGE_KEY_PATIENTCARE_LANGUAGE);
        headers.set('Authorization', `Bearer ${token}`);
        headers.set('Language', language ?? 'tr');
        return headers;
    },
});

const customBaseQuery = ({ baseUrl }: BaseQueryType): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
    const rawBaseQuery = getRawBaseQuery(baseUrl);

    return async (args, api, extraOptions) => {
        await mutex.waitForUnlock();

        let result = await rawBaseQuery(args, api, extraOptions);

        const globalRoutes = [
            RouteKeys.Login,
            RouteKeys.ForgetPassword,
            RouteKeys.ResetPassword
        ]

        if (result.error?.status === API_UNAUTHORIZE_ERROR && !(globalRoutes.some(route => location.pathname.includes(route)))) {
            if (!mutex.isLocked()) {
                const release = await mutex.acquire();
                try {
                    const refreshToken = (api.getState() as RootState).auth.refreshToken;

                    const refreshResult = await rawBaseQuery(
                        {
                            url: "/Auth/Oauth/Login",
                            method: METHOD_POST,
                            body: {
                                grant_type: "refresh_token",
                                refreshToken,
                            },
                        },
                        api,
                        extraOptions
                    );

                    if ((refreshResult.data as LoginResponse)?.accessToken) {
                        api.dispatch(setCredentials(refreshResult.data as LoginResponse));

                        const bc = new BroadcastChannel("auth");
                        bc.postMessage({ type: "TOKEN_REFRESHED", credentials: JSON.stringify(refreshResult.data) });
                    } else {
                        api.dispatch(logout());
                    }
                } finally {
                    release();
                }
            } else {
                await mutex.waitForUnlock();
            }

            result = await rawBaseQuery(args, api, extraOptions);
        }

        await checkError(result, api)

        return result
    };
};

export { customBaseQuery };
