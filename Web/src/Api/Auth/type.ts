export interface LoginRequest {
    grantType: string
    Username: string
    Password: string
}

export interface LogoutRequest {
    accessToken: string
}

export interface LoginResponse {
    token_type: string
    accessToken: string
    refreshToken: string
    ExpiresAt: Date
    RefreshtokenexpiresAt: Date
    redirect: string
}
export interface PasswordForgetRequest {
    email: string
}

export interface PasswordResetRequest {
    Password: string,
    RequestId: string
}

export interface PasswordResetRequestForm {
    Password: string,
    PasswordRe: string,
    RequestId: string
}

export interface PasswordResetUserRequest {
    requestId: string
}