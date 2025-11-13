import { RoleItem } from "@Api/Role/type"

export interface TableMetaSaveRequest {
    Meta: string
    Config: string
}

export interface TableMetaResetRequest {
    metaKey: string
}

export interface TableMetaGetRequest {
    Key: string
}

export interface TableMetaSaveRequest {
    Key: string
    Config: string
}

export interface TableMetaDeleteRequest {
    Key: string
}

export interface ProfileMetaResponse {
    Id: number
    Uuid: string
    Username: string
    Name: string
    Surname: string
    Email: string
    PasswordHash: string
    Language: string
    Config: string
    Defaultpage: string
    Isworker: boolean
    Workstarttime: Date
    Workendtime: Date
    Leftinfo: string
    Isworking: boolean
    ShiftdefineID: string
    ProfessionID: string
    Includeshift: boolean
    Dateofbirth: Date
    Phonenumber: string
    Bloodgroup: string
    Foreignlanguage: string
    Graduation: string
    Contactnumber: string
    Chronicillness: string
    Covid: string
    City: string
    Roles: RoleItem[]
    Town: string
    Adress: string
    CountryID: string
    Gender: string
    Createduser: string
    Createtime: Date
    Updateduser: string
    Updatetime: Date
    Deleteduser: string
    Deletetime: Date
    Isactive: boolean
}

export interface ProfileChangePasswordRequest {
    Oldpassword: string
    Newpassword: string
    Newpasswordre: string
}