import { createApi } from '@reduxjs/toolkit/query/react';
import { customBaseQuery } from './baseApi';
import config from '@Constant/config';

export const gatewayApi = createApi({
    reducerPath: 'gatewayApi',
    baseQuery: customBaseQuery({ baseUrl: config.backendUrl }),
    endpoints: () => ({}),
    keepUnusedDataFor: 0
});