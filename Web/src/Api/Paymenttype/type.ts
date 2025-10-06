import { DefaultRequestType } from "@Constant/common";

export interface PaymenttypeListRequest extends DefaultRequestType {}

export interface PaymenttypeRequest {
    Uuid: string;
}

export interface PaymenttypeItem {
    Id: number;
    Uuid: string;
    Name: string;
    Description: string | null;
    Type: number;
    Installmentcount: number;
    Installmentinterval: number;
    Duedays: number;
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface PaymenttypeAddRequest {
    Name: string;
    Description?: string;
    Type: number;
    Installmentcount: number;
    Installmentinterval: number;
    Duedays: number;
}

export interface PaymenttypeEditRequest {
    Uuid: string;
    Name: string;
    Description?: string;
    Type: number;
    Installmentcount: number;
    Installmentinterval: number;
    Duedays: number;
}

export interface PaymenttypeDeleteRequest {
    Uuid: string;
}
