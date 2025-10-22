export interface ReportUserSaleReportItem {
    UserID: string,
    VisitCount: number,
    TotalSales: number,
    Paid: number,
    Unpaid: number,
    CollectionRate: number
}

export interface ReportRequest {
    Startdate: string
    Enddate: string
}