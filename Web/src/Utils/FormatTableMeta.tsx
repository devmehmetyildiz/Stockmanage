import validator from "@Utils/Validator"

export interface ConfigType {
    order: number
    isVisible: boolean
    name: string
    key: string
    isGroup: boolean
    sorting: string

}

export interface OptionType {
    hiddenColumns?: string[]
    columnOrder?: string[]
    groupBy?: string[]
}

export interface TableMetaType {
    hiddenColumns: string[];
    columnOrder: string[];
    groupBy: string[];
    sortBy: {
        id: string;
        desc: boolean;
    }[];
}

const FormatTableMeta = (rawConfig: string | undefined, options: OptionType = {}): TableMetaType => {

    const additionalHiddenColumns = options?.hiddenColumns as string[] || null
    const additionalColumnOrder = options?.columnOrder as string[] || null
    const additionalGroupBy = options?.groupBy as string[] || null

    const Config = rawConfig && validator.isString(rawConfig) ? JSON.parse(rawConfig) as ConfigType[] : null

    const initialConfig = {
        hiddenColumns: Config ? Config.filter(u => u.isVisible === false).map(item => {
            return item.key
        }) : additionalHiddenColumns || ["Id", "Uuid", "Createduser", "Updateduser", "Createtime", "Updatetime"],
        columnOrder: Config ? Config.sort((a, b) => a.order - b.order).map(item => {
            return item.key
        }) : additionalColumnOrder || [],
        groupBy: Config ? Config.filter(u => u.isGroup === true).map(item => {
            return item.key
        }) : additionalGroupBy || [],
        sortBy: [...(Config ? Config.filter(u => u.isVisible && u.sorting && u.sorting !== 'None').map(u => {
            return u?.sorting === 'Asc' ? { id: u.key, desc: false } : { id: u.key, desc: true }
        }) : [])]
    };
    return initialConfig
}


export default FormatTableMeta