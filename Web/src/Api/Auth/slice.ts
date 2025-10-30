import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
    token_type: string | null
    accessToken: string | null
    refreshToken: string | null
    ExpiresAt: Date | null
    RefreshtokenexpiresAt: Date | null
    redirect: string | null
}

const initialState: AuthState = {
    accessToken: null,
    refreshToken: null,
    ExpiresAt: null,
    redirect: null,
    RefreshtokenexpiresAt: null,
    token_type: null
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<AuthState>) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.ExpiresAt = action.payload.ExpiresAt;
            state.redirect = action.payload.redirect;
            state.RefreshtokenexpiresAt = action.payload.RefreshtokenexpiresAt;
            state.token_type = action.payload.token_type;
        },
        getCredentials: (state) => {
            return state
        },
        logout: (state) => {
            //eslint-disable-next-line
            state = initialState
            const params = new URLSearchParams(window.location.search);
            const redirecturl = params.get('redirecturl');
            if (redirecturl) {
                params.set('redirecturl', window.location.pathname)
            } else {
                params.append('redirecturl', window.location.pathname)
            }
            window.location.assign(`/Login?${params.toString().replace(/%2F/g, '/')}`)
        },
        logoutByUser: (state) => {
            //eslint-disable-next-line
            state = initialState
            window.location.assign(`/Login`)
        },
    },
});

export const { setCredentials, logout, getCredentials, logoutByUser } = authSlice.actions;
export default authSlice.reducer;
