import validator from "./Validator"

export const countryIdValidation = (value: any, message: string) => {
    if (validator.isCountryID(value)) {
        return true
    } else {
        return message
    }
}