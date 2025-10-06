export interface RolePrivilegeTextType {
    en: string
    tr: string
}
export interface RolePrivilegesItem {
    code: string
    text: RolePrivilegeTextType
    group: RolePrivilegeTextType
}

export interface RoleItem {
    Id: number
    Uuid: string
    Name: string
    Privileges: RolePrivilegesItem[]
    Createduser: string
    Createtime: Date
    Updateduser: string | null
    Updatetime: string | null
    Deleteduser: string | null
    Deletetime: string | null
    Isactive: boolean
}

export interface RoleRequest {
    Uuid: string
}

export interface RoleAddRequest {
    Name: string
    Privileges: string[]
}

export interface RoleAddRequestForm {
    Name: string
    Privileges: RolePrivilegesItem[]
}

export interface RoleEditRequest {
    Uuid: string
    Name: string
    Privileges: string[]
}

export interface RoleEditRequestForm {
    Uuid: string
    Name: string
    Privileges: RolePrivilegesItem[]
}

export interface RoleDeleteRequest {
    Uuid: string
}