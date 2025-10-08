import { DefaultRequestType } from "@Constant/common"

export interface StockItem {
    Id: number
    Uuid: string
    WarehouseID: string
    StockdefineID: string
    TotalAmount: number
}

export interface StockListRequestType extends DefaultRequestType {
    Uuid?: string
    WarehouseID?: string
    StockdefineID?: string
}

export interface StockmovementItem {
    Uuid: string
    StockID: string
    UserID: string
    Type: number
    Amount: number
    Movementtype: number
    Movementdate: Date
    Sourcetype: number
    SourceID: string
}

export interface StockmovementListRequest extends DefaultRequestType {
    Uuid?: string
    StockID?: string
    Type?: number
    Movementtype?: number
    Sourcetype?: number
    SourceID?: string
}

export interface StockCreateRequest {
    WarehouseID: string
    StockdefineID: string
    Sourcetype: number
    SourceID: string
    Amount: number
}

export interface StockUseRequest {
    StockID: string
    Amount: number
    Sourcetype: number
    SourceID: string
}

export interface StockInsertRequest {
    StockID: string
    Amount: number
    Sourcetype: number
    SourceID: string
}

export interface StockDeleteRequest {
    Uuid: string
}

export interface StockDeleteMovementRequest {
    Uuid: string
}