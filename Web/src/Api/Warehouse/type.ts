import { DefaultRequestType } from "@Constant/common";

export interface WarehouseListRequest extends DefaultRequestType { }

export interface WarehouseRequest {
    Uuid: string;
}

export interface WarehouseItem {
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

export interface WarehouseAddRequest {
    Name: string;
    Description?: string;
}

export interface WarehouseEditRequest {
    Uuid: string;
    Name: string;
    Description?: string;
}

export interface WarehouseDeleteRequest {
    Uuid: string;
}
