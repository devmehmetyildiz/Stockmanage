
export interface ChangeLogItem {
    version: string
    changes?: ChangeLogItemChangeItem[]
    bugs?: ChangeLogItemChangeItem[]
    features?: ChangeLogItemChangeItem[]
    withoutIssues?: ChangeLogItemChangeItem[]
}

export interface ChangeLogItemChangeItem {
    title: string
    commits: string[]
}

const version1_0_0_0_preAlpha: ChangeLogItem = {
    version: "1.0.0.0-preAlpha",
}

export default
    [
        version1_0_0_0_preAlpha,
    ] as ChangeLogItem[]
