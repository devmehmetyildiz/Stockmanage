import { DefaultRequestType } from "@Constant/common";

export interface DoctordefineListRequest extends DefaultRequestType { }

export interface DoctordefineRequest {
    Uuid: string;
}

export interface DoctordefineItem {
    Id: number;
    Uuid: string;
    Name: string;
    Surname: string;
    CountryID: string | null;
    Address: string | null;
    LocationID: string;
    Gender: number | null;
    Phonenumber1: string | null;
    Phonenumber2: string | null;
    Email: string | null;
    Specialization: string | null;
    Status: boolean;
    Role: string | null;
    Description: string | null;
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface DoctordefineAddRequest {
    Name: string;
    Surname: string;
    CountryID?: string;
    Address?: string;
    LocationID: string;
    Gender?: number;
    Phonenumber1?: string;
    Phonenumber2?: string;
    Email?: string;
    Specialization?: string;
    Status?: boolean;
    Role?: string;
    Description?: string;
}

export interface DoctordefineEditRequest {
    Uuid: string;
    Name: string;
    Surname: string;
    CountryID?: string;
    Address?: string;
    LocationID: string;
    Gender?: number;
    Phonenumber1?: string;
    Phonenumber2?: string;
    Email?: string;
    Specialization?: string;
    Status?: boolean;
    Role?: string;
    Description?: string;
}

export interface DoctordefineDeleteRequest {
    Uuid: string;
}
