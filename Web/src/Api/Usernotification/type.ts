import { DefaultRequestType } from "@Constant/common"

export interface UserNotificationRequestType extends DefaultRequestType {
    UserID?: string
    Isactive?: number | boolean
}

export interface UserNotificationItem {
    Id: number,
    Uuid: string
    UserID: string
    Notificationtype: string
    Notificationtime: string
    Subject: string
    Message: string
    Isshowed: boolean
    Showedtime?: Date
    Isreaded: boolean
    Readtime?: Date
    Pushurl: string
    Createduser: string
    Createtime: Date
    Updateduser: string | null
    Updatetime: string | null
    Deleteduser: string | null
    Deletetime: string | null
    Isactive: boolean
}

export interface UserNotificationGetRequest {
    userId: string
}

export interface UserNotificationDeleteRequest {
    notificationId: string
}

export interface UserNotificationDeleteByUserRequest {
    userId: string
}

export interface UserNotificationEditRequest {
    Uuid: string,
    Readtime: Date,
    Isreaded: boolean
}