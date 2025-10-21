import { DefaultRequestType } from "@Constant/common";

export interface PaymentplanListRequest extends DefaultRequestType {
    Status?: number
    VisitID?: string
}
export interface PaymentplanTransactionListRequest extends DefaultRequestType {
    Status?: number
    PaymentplanID?: string
}

export interface PaymentplanRequest {
    Uuid: string
}

export interface PaymentplanListItem {
    Id: number;
    Uuid: string;
    VisitID: string
    PaymenttypeID: string
    Totalamount: number
    Prepaymentamount: number
    Remainingvalue: number
    Installmentcount: number
    Installmentinterval: number
    Duedays: number
    Startdate: Date
    Enddate: Date
    Status: number
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface PaymentplanTransactionItem {
    Id: number;
    Uuid: string;
    PaymentplanID: string
    Paymentdate: Date
    Type: number
    Amount: number
    Paymentmethod: number
    Referenceno: string
    Status: boolean
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface PaymentplanItem extends PaymentplanListItem {
    Transactions: PaymentplanTransactionItem[]
}

export interface PaymentplanApproveTransactionRequest {
    TransactionID: string,
    Paymentmethod: number,
    Description: string
}