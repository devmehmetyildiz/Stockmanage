export interface RuleItem {
    Id: number
    Uuid: string
    Name: string
    Rule: string
    Status: boolean | number
    Isworking: boolean | number
    Info: string
    Createduser: string
    Createtime: Date
    Updateduser: string | null
    Updatetime: string | null
    Deleteduser: string | null
    Deletetime: string | null
    Isactive: boolean
}

export interface RuleLogItem {
    Id: number
    Uuid: string
    RuleID: string
    Log: string
    Date: Date
}

export interface RuleRequest {
    Uuid: string
}

export interface RuleAddRequest {
    Name: string
    Rule: string
    Info: string
    Status: boolean
}

export interface RuleEditRequest {
    Uuid: string
    Name: string
    Rule: string
    Info: string
    Status: boolean
}

export interface RuleStopRequest {
    Uuid: string
}

export interface RuleLogRequest {
    Uuid: string
}

export interface RuleClearRequest {
    Uuid: string
}

export interface RuleDeleteRequest {
    Uuid: string
}