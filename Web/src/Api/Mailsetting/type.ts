export interface MailsettingItem {
    Id: number
    Uuid: string
    Name: string
    User: string
    Password: string
    Smtphost: string
    Smtpport: string
    Mailaddress: string
    Isbodyhtml: boolean
    Issettingactive: boolean
    Createduser: string
    Createtime: Date
    Updateduser: string | null
    Updatetime: string | null
    Deleteduser: string | null
    Deletetime: string | null
    Isactive: boolean
}

export interface MailsettingRequest {
    Uuid: string
}

export interface MailsettingAddRequest {
    Name: string
    User: string
    Password: string
    Smtphost: string
    Smtpport: string
    Mailaddress: string
    Isbodyhtml: boolean
    Issettingactive: boolean
}

export interface MailsettingEditRequest {
    Uuid: string
    Name: string
    User: string
    Password: string
    Smtphost: string
    Smtpport: string
    Mailaddress: string
    Isbodyhtml: boolean
    Issettingactive: boolean
}

export interface MailsettingDeleteRequest {
    Uuid: string
}