import { DefaultRequestType } from "@Constant/common";

export interface VisitListRequest extends DefaultRequestType {
    Status?: number;
    UserID?: string
}

export interface VisitRequest {
    Uuid: string;
}

export interface VisitProductItem {
    Id: number;
    Uuid: string;
    VisitID: string
    StockID: string
    Amount: number
    Istaken: boolean
    IsReturned: boolean
    Description: string
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface VisitListItem {
    Id: number;
    Uuid: string;
    Visitcode: string;
    WorkerUserID: string;
    ResponsibleUserID: string;
    DoctorID: string;
    LocationID: string;
    PaymenttypeID: string;
    WarehouseID: string;
    Visitdate: Date;
    Visitstartdate: Date | null;
    Visitenddate: Date | null;
    Status: number;
    Description: string,
    Notes: string;
    Scheduledpayment: number
    Finalpayment: number
    Isapproved: boolean
    Isrejected: boolean
    ApprovedUserID: string
    RejectedUserID: string
    ApproveDescription: string
    RejectDescription: string
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface VisitItem extends VisitListItem {
    Products: VisitProductItem[]
}

export interface VisitStockItem {
    Uuid: string
    Amount: number
    Description: string
}

export interface VisitCreateRequest {
    Visitcode: string,
    WorkerUserID: string,
    ResponsibleUserID: string,
    DoctorID: string,
    WarehouseID: string,
    LocationID: string,
    PaymenttypeID: string,
    Visitdate: Date,
    Scheduledpayment: number,
    Notes: string,
    Stocks: VisitStockItem[]
    Description: string
}

export interface VisitUpdateStocksRequest {
    VisitID: string,
    WarehouseID: string,
    Stocks: VisitStockItem[]
}

export interface VisitUpdatePaymentdefineRequest {
    VisitID: string,
    PaymenttypeID: string,
    Scheduledpayment: number,
}

export interface VisitUpdateDefinesRequest {
    VisitID: string,
    Visitcode: string,
    WorkerUserID: string,
    ResponsibleUserID: string,
    DoctorID: string,
    LocationID: string,
    Visitdate: string | Date,
    Notes: string,
    Scheduledpayment: number
    PaymenttypeID: string;
    Description: string
}

export interface VisitWorkRequest {
    VisitID: string
}

export interface VisitDeleteRequest {
    Uuid: string
}

export interface VisitCompleteApiRequest {
    VisitID: string,
    Totalamount: number,
    Installmentcount: number,
    Installmentinterval: number,
    Duedays: number,
    Startdate: string | Date,
    Prepaymentamount: number,
    Prepaymenttype: number
    Returnedproducts: VisitStockItem[]
}

export interface VisitCompleteRequest extends VisitCompleteApiRequest {
    isFullPayment: boolean
    isHavePrepayment: boolean
}

export interface VisitSendApproveRequest {
    VisitID: string,
    Comment: string
}

