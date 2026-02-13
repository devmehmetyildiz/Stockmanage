import { DefaultRequestType } from "@Constant/common";

export interface CashflowListRequest extends DefaultRequestType {
    startDate: string
    endDate: string
}

export interface CashflowItem {
    Id: number;
    Uuid: string;
    Type: number
    Parenttype: number
    ParentID: string
    TransactionID: string
    Paymenttype: number
    Processdate: Date
    Amount: number
    Info: number
    Createduser: string;
    Createtime: Date;
    Updateduser: string | null;
    Updatetime: string | null;
    Deleteduser: string | null;
    Deletetime: string | null;
    Isactive: boolean;
}

export interface CashflowAddRequest {
    Type: number
    Paymenttype: number,
    Processdate: string,
    Amount: number,
    Info: string,
}

export interface CashflowGraphRequest {
    startDate: string
    endDate: string
}

export interface CashflowGraphResponse {
    summary: CashflowGraphResponseSummery
    details: CashflowGraphResponseDetail[]
}

export interface CashflowGraphResponseSummery {
    GrandTotalIncome: number
    GrandTotalExpense: number
    GrandNetProfit: number
}

export interface CashflowGraphResponseDetail {
    Date: string
    TotalIncome: number
    TotalExpense: number
    NetChange: number
}