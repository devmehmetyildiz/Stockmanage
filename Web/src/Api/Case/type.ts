import { DefaultRequestType } from "@Constant/common";

export interface CaseListRequest extends DefaultRequestType {

}

export interface CaseRequest {
    Uuid: string
}

export interface CaseItem {
    Id: number
    Uuid: string
    Name: string
    Color: string
    Type: number
    Isdefault: boolean
    Description: string
    Createduser: string
    Createtime: Date
    Updateduser: string | null
    Updatetime: string | null
    Deleteduser: string | null
    Deletetime: string | null
    Isactive: boolean
}

export interface CaseAddRequest {
    Name: string
    Color: string
    Type: number
    Isdefault: boolean
    Description: string
}

export interface CaseEditRequest {
    Uuid: string
    Name: string
    Color: string
    Type: number
    Isdefault: boolean
    Description: string
}

export interface CaseDeleteRequest {
    Uuid: string
}