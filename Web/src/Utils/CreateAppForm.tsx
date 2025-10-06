import FormCheckbox, { FormCheckboxProps } from "@Components/Common/FormCheckbox";
import FormInput, { FormInputProps } from "@Components/Common/FormInput";
import FormSelect, { FormSelectProps } from "@Components/Common/FormSelect";

export function createAppForm<T extends object>() {
    return {
        Input: (props: FormInputProps<T>) => <FormInput<T> {...props} />,
        Checkbox: (props: FormCheckboxProps<T>) => <FormCheckbox<T> {...props} />,
        Select: (props: FormSelectProps<T>) => <FormSelect<T> {...props} />,
    }
}