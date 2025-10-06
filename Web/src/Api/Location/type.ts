import { DefaultRequestType } from "@Constant/common";

export interface LocationListRequest extends DefaultRequestType { }

export interface LocationRequest {
    Uuid: string;
}

export interface LocationItem {
    Id: number;
    Uuid: string;
    Name: string;
    Description: string | null;
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface LocationAddRequest {
    Name: string;
    Description?: string;
}

export interface LocationEditRequest {
    Uuid: string;
    Name: string;
    Description?: string;
}

export interface LocationDeleteRequest {
    Uuid: string;
}
