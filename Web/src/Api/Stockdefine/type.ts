import { DefaultRequestType } from "@Constant/common";

export interface StockdefineListRequest extends DefaultRequestType {
    Uuid?: string;
}

export interface StockdefineRequest {
    Uuid: string;
}

export interface StockdefineItem {
    Id: number;
    Uuid: string;
    Productname: string;
    Brand: string;
    Model: string;
    Category: string;
    Diameter: string;
    Length: string;
    Material: string;
    Surfacetreatment: string;
    Connectiontype: string;
    Suppliername: string;
    Suppliercontact: string;
    Description: string | null;
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface StockdefineAddRequest {
    Productname: string;
    Brand: string;
    Model: string;
    Category: string;
    Diameter: string;
    Length: string;
    Material: string;
    Surfacetreatment: string;
    Connectiontype: string;
    Suppliername: string;
    Suppliercontact: string;
    Description?: string;
}

export interface StockdefineEditRequest {
    Uuid: string;
    Productname: string;
    Brand: string;
    Model: string;
    Category: string;
    Diameter: string;
    Length: string;
    Material: string;
    Surfacetreatment: string;
    Connectiontype: string;
    Suppliername: string;
    Suppliercontact: string;
    Description?: string;
}

export interface StockdefineDeleteRequest {
    Uuid: string;
}
