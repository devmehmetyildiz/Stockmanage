import { DefaultRequestType } from "@Constant/common"

export interface ApprovalrequestListRequestType extends DefaultRequestType {
    Isapproved?: number | boolean
    Isrejected?: number | boolean
}

export interface ApprovalrequestItem {
    Id: number
    Uuid: string
    Service: string
    Message: string
    Table: string
    Record: string
    Detiallink: string
    RequestTime: Date
    RequestUserID: string
    ApproveTime: Date
    ApproveUserID: string
    ApproveRoles: string
    Isapproved: boolean
    Isrejected: boolean
    Comment: string
    Deleteduser: string
    Deletetime: Date
    Isactive: boolean
}

export interface ApprovalrequestApproveRequest {
    ApproveList: {
        Uuid: string
        Comment: string
    }[]
}

export interface ApprovalrequestRejectRequest {
    RejectList: {
        Uuid: string
        Comment: string
    }[]
}