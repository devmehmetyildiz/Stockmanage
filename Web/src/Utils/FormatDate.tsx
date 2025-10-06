import validator from "@Utils/Validator"

export const FormatDate = (value: any) => {
    if (validator.isISODate(value)) {
        return new Date(value).toLocaleDateString('tr')
    } else {
        return value
    }
}

export const FormatFullDate = (value: any) => {
    if (validator.isISODate(value)) {
        const date = new Date(value)
        return `${date.toLocaleDateString('tr')} ${date.toLocaleTimeString('tr')}`
    } else {
        return value
    }
}

export const FormatHour = (value: any) => {
    if (validator.isISODate(value)) {
        const date = new Date(value)
        return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
    } else {
        return value
    }
}

export const SuppressDate = (date: Date | string, ishavetime = false) => {
    const occuredDate = new Date(date)
    const pad = (n: number) => n.toString().padStart(2, '0')
    const occuredTimeStr = `${occuredDate.getFullYear()}-${pad(occuredDate.getMonth() + 1)}-${pad(occuredDate.getDate())}T${pad(occuredDate.getHours())}:${pad(occuredDate.getMinutes())}`
    const occuredDateStr = `${occuredDate.getFullYear()}-${pad(occuredDate.getMonth() + 1)}-${pad(occuredDate.getDate())}`
    return ishavetime ? occuredTimeStr : occuredDateStr
}
