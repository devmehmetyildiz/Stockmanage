const isFile = function (value: any) {
    return value instanceof File;
}

const isNotNullorEmpty = function (value: any) {
    return !(value === null || value === undefined)
}

const isUUID = function (value: any) {
    return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value);
}
const isObject = function (value: any) {
    return (typeof (value) === 'object' && !Array.isArray(value) && value !== null && Object.keys(value).length > 0 && value?.Id !== 0)
}

const isNumber = function (value: any) {
    return (/[-+]?\d*\.?\d*$/.test(value) && typeof value === 'number' && !isNaN(value));
}

const isPositiveInteger = function (value: any) {
    return (Number.isInteger(value) && value >= 0)
}

const isString = function (value: any) {
    return (typeof (value) === 'string' && value !== '')
}

const isArray = function (value: any) {
    return (Array.isArray(value) && value.length > 0)
}

const isBoolean = function (value: any) {
    if (typeof (value) === 'boolean') {
        return true
    }
    if (typeof (value) === 'number' && (value === 0 || value === 1)) {
        return true
    }
    return false
}

const isBooleanTrue = function (value: any) {
    if (typeof (value) === 'boolean' && value === true) {
        return true
    }
    if (typeof (value) === 'number' && value === 1) {
        return true
    }
    return false
}

const isQueryBoolean = function (value: any) {
    return (value === 'true' || value === 'false')
}

const isObjectId = function (value: any) {
    return /^[0-9a-fA-F]{24}$/.test(value)
}

const isISODate = function (value: any) {
    if (value) {
        const date = new Date(value);
        return !isNaN(date as any);
    } else {
        return false
    }
}

const isEpochTime = function (value: any) {
    return (isNumber(value) && value.length === 13)
}

const isIpAddress = function (value: any) {
    return /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/.test(value)
}

const isValidURL = function (str: any) {
    const pattern = new RegExp('^(https?:\\/\\/)?' +
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
        '((\\d{1,3}\\.){3}\\d{1,3}))' +
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
        '(\\?[;&a-z\\d%_.~+=-]*)?' +
        '(\\#[-a-z\\d_]*)?$', 'i')
    return !!pattern.test(str);
}

const isCountryID = (tcNumber: any) => {
    if (/^[1-9][0-9]{10}$/.test(tcNumber)) {
        const numberArray = tcNumber.split('').map(Number);
        const lastDigit = numberArray.pop();
        const sum = numberArray.reduce((acc: any, current: any) => acc + current, 0);
        const tenthDigit = sum % 10;

        if ((tenthDigit === lastDigit && numberArray[0] !== 0) || (sum % 10 === 0 && lastDigit === 0)) {
            return true;
        }
    }
    return false;
}

const isHavePermission = (role: string, Roles: any) => {
    const roles = (Roles || [])
    return roles.includes('admin') || roles.includes(role)
}

const validator = {
    isValidURL,
    isIpAddress,
    isEpochTime,
    isISODate,
    isObjectId,
    isQueryBoolean,
    isBoolean,
    isArray,
    isString,
    isPositiveInteger,
    isNumber,
    isObject,
    isUUID,
    isCountryID,
    isFile,
    isNotNullorEmpty,
    isHavePermission,
    isBooleanTrue
}

export default validator