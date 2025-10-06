import { FormState } from "react-hook-form"
import Pushnotification from "./Pushnotification"

const CheckForm = <T extends object>(formState: FormState<T>, Subject: string) => {

    const errors = formState.errors as any


    const checkErrorFromObject = (_errors: any) => {
        const errorKeys = Object.keys(_errors).filter(u => u !== 'ref')
        if (errorKeys.length > 0) {
            errorKeys.forEach((errorKey) => {
                const actualError = _errors[errorKey]
                if (actualError && actualError.message) {
                    Pushnotification({
                        Type: 'Error',
                        Subject: Subject,
                        Description: actualError.message
                    })
                } else if (actualError && Object.keys(actualError).length > 0) {
                    return checkErrorFromObject(actualError)
                }
            })
            return false
        } else {
            return true
        }
    }

    return checkErrorFromObject(errors)
}

export default CheckForm