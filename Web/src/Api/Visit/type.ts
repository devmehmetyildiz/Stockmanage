export interface VisitListRequest {
    Visitstartdate?: string
    Visitenddate?: string
    Status?: number
    Visittype?: number
    Isactive?: boolean | number
    WorkerUserID?: string
    DoctorID?: string
}

export interface VisitCountByStatusResponse {
    Status: number
    Count: number
}

export interface VisitCountByWaitingWork {
    Count: number
}

export interface VisitRequest {
    Uuid: string;
}

export interface VisitProductItem {
    Id: number;
    Uuid: string;
    VisitID: string
    WarehouseID: string;
    StockID: string
    Amount: number
    Returnedamount: number
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
    Visittype: number,
    Visitcode: string;
    WorkerUserID: string;
    ResponsibleUserID: string;
    DoctorID: string;
    LocationID: string;
    PaymenttypeID: string;
    Visitdate: Date;
    Visitstartdate: Date | null;
    Visitenddate: Date | null;
    Status: number;
    Description: string,
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
    Notes: string[]
}

export interface VisitStockItem {
    Uuid: string
    WarehouseID: string,
    Amount: number
    Description: string
}

export interface VisitCreateRequest {
    Visittype: number,
    Visitcode: string,
    WorkerUserID: string,
    ResponsibleUserID: string,
    DoctorID: string,
    LocationID: string,
    PaymenttypeID: string,
    Visitdate: Date,
    Scheduledpayment: number,
    Stocks: VisitStockItem[]
    Description: string
    Notes: {
        Note: string
    }[]
}

export interface VisitCreateApiRequest extends Omit<VisitCreateRequest, 'Notes'> {
    Notes: string[]
}

export interface VisitCreateFreeVisitRequest {
    Visittype: number,
    Visitcode: string,
    WorkerUserID: string
    ResponsibleUserID: string,
    DoctorID: string,
    WarehouseID: string,
    LocationID: string,
    Visitdate: Date,
    Description: string
    Notes: {
        Note: string
    }[]
}

export interface VisitCreateFreeVisitApiRequest extends Omit<VisitCreateFreeVisitRequest, 'Notes'> {
    Notes: string[]
}

export interface VisitCreatePastVisitRequest {
    Visittype: number,
    WorkerUserID: string
    ResponsibleUserID: string,
    DoctorID: string,
    LocationID: string,
    Visitdate: Date,
    Totalamount: number,
    Description: string
    Notes: {
        Note: string
    }[]
}

export interface VisitCreatePastVisitApiRequest extends Omit<VisitCreatePastVisitRequest, 'Notes'> {
    Notes: string[]
}

export interface VisitUpdateStocksRequest {
    VisitID: string,
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
    Scheduledpayment: number
    PaymenttypeID: string;
    Description: string
    Notes: {
        Note: string
    }[]
}

export interface VisitUpdateDefinesApiRequest extends Omit<VisitUpdateDefinesRequest, 'Notes'> {
    Notes: string[]
}

export interface VisitWorkRequest {
    VisitID: string
}

export interface VisitDeleteRequest {
    Uuid: string
}

export interface VisitCompleteFreeVisitRequest {
    VisitID: string,
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
    Usedproducts: VisitStockItem[]
}

export interface VisitCompleteRequest extends VisitCompleteApiRequest {
    isFullPayment: boolean
    isHavePrepayment: boolean
    WarehouseID: string
}

export interface VisitSendApproveRequest {
    VisitID: string,
    Comment: string
}

