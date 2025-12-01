export interface ReportSaleByDoctorItem {
    DoctorID: string
    VisitCount: number
    TotalPayment: number
    TotalRealPayment: number
    TotalRemaining: number
}

export interface ReportSaleByLocationItem {
    LocationID: string
    VisitCount: number
    TotalPayment: number
    TotalRealPayment: number
    TotalRemaining: number

}
export interface ReportVisitProductItem {
    StockID: string
    SoldAmount: number
    ReturnedAmount: number
}

export interface ReportSaleByUserItem {
    ResponsibleUserID: string
    VisitCount: number
    TotalPayment: number
    AvgPaymentPerVisit: number
}

export interface ReportDailySalesItem {
    SalesDate: string
    VisitCount: number
    TotalPayment: number
}

export interface ReportMonthlySalesItem {
    SalesMonth: string
    VisitCount: number
    TotalPayment: number
}

export interface ReportRequest {
    Startdate: string
    Enddate: string
}