import { RoleItem } from "@Api/Role/type"
import { DefaultRequestType } from "@Constant/common"

export interface UserRoleItem {
    RoleID: string
}


export interface UserListItem {
    Uuid: string
    Username: string
    Name: string
    Surname: string
    Email: string
    Workstarttime: string
    Workendtime: string
    Leftinfo: string
    Gender: string
}

export interface UserItem {
    Id: number
    Uuid: string
    Username: string
    Name: string
    Surname: string
    Email: string
    Roleuuids: UserRoleItem[]
    Language: string
    Config: string
    Defaultpage: string
    Isworker: boolean
    Workstarttime: string
    Workendtime: string
    Leftinfo: string
    Isworking: boolean
    Dateofbirth: string
    Phonenumber: string
    Bloodgroup: string
    Foreignlanguage: string
    Graduation: string
    Contactnumber: string
    Chronicillness: string
    Covid: string
    City: string
    Town: string
    Adress: string
    CountryID: string
    Gender: string
    Createduser: string
    Createtime: Date
    Updateduser: string | null
    Updatetime: string | null
    Deleteduser: string | null
    Deletetime: string | null
    Isactive: boolean
}

export interface UserListResponse {
    data?: UserItem
    list?: UserItem[]
}

export interface UserRequest {
    Uuid: string
}

export interface UserFormRequest {
    Username: string
    Name: string
    Surname: string
    Email: string
    Language: string
    Defaultpage: string
    Isworker: boolean
    Workstarttime?: string
    Workendtime: string
    Leftinfo: string
    Isworking: boolean
    Dateofbirth: string
    Phonenumber: string
    Bloodgroup: string
    Foreignlanguage: string
    Graduation: string
    Contactnumber: string
    Chronicillness: string
    Covid: string
    City: string
    Town: string
    Adress: string
    CountryID: string
    Gender: string
}

export interface UserAddRequest extends UserFormRequest {
    Password: string,
    PasswordRe: string,
    Roles: string[],
    Position: string
    Duration: number
}

export interface UserEditRequest extends UserFormRequest {
    Uuid: string
    Roles: string[],
    Position: string
    Duration: number
}

export interface UserAddApiRequest extends UserFormRequest {
    Password: string,
    PasswordRe: string,
    Roles: RoleItem[],
    Config: string
}

export interface UserEditApiRequest extends UserFormRequest {
    Uuid: string
    Roles: RoleItem[],
    Config: string
}

export interface UserRemoveRequest {
    Uuid: string,
    Workendtime: Date,
    Leftinfo: string
}

export interface UserDeleteRequest {
    Uuid: string
}

export interface UserListRequestType extends DefaultRequestType {
    Isworker?: number | boolean
    Isworking?: number | boolean
}