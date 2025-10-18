import { DefaultRequestType } from "@Constant/common";

export interface PaymentplanListRequest extends DefaultRequestType {
    Status: number
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
    PaymentplanID: string
    Paymentdate: Date
    Type: number
    Amount: number
    Paymentmethod: string
    Referenceno: string
    Status: boolean
}

export interface PaymentplanItem extends PaymentplanListItem {
    Transactions: PaymentplanTransactionItem[]
}