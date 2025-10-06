export interface LogItem {
    Id: number
    Service: string
    UserID: string
    Requesttype: string
    Requesturl: string
    Requestip: string
    Status: string
    Requestdata: string
    Responsedata: string
    Createtime: Date
}

export interface LogRequest {
    Startdate: string,
    Enddate: string,
    Status: string,
    Service: string,
    UserID: string,
    Requesturl: string,
    Requesttype: string
}
export interface LogAppReportRequest {
    Startdate: string,
    Enddate: string,
}

export interface LogUsageCountItem {
    UserID: string,
    UsageCount: number
}

export interface LogProcessCountItem {
    UserID: string,
    Requesttype: string,
    Count: number
}

export interface LogServiceUsageItem {
    Service: string,
    Requesttype: string,
    Count: number
}

export interface LogUserUsageCount {
    key: string,
    value: LogUserUsageCountDetail[]
}

export interface LogUserUsageCountDetail {
    UserID: string,
    Count: number
}
