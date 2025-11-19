
const DEFAULT_PROPS_ERROR = "Support for defaultProps will be removed from function components"
const FIND_IN_DOME_ERROR = "findDOMNode is deprecated and will be removed in the next major release. Instead, add a ref directly"
const CHECKBOX_VALUE_ERROR = "Warning: Failed %s type: %s%spropInvalid prop `value` supplied to `Checkbox2`, expected one of type [string, number]"
const CONTROLLED_ERROR = "A component is changing an uncontrolled input to be controlled."

const errorClear = () => {

    const Errors = [
        DEFAULT_PROPS_ERROR,
        FIND_IN_DOME_ERROR,
        CHECKBOX_VALUE_ERROR,
        CONTROLLED_ERROR
    ]

    const origError = console.error;
    console.error = (...args) => {
        const suppressedArgs = Object.values(args).join('')
        if (
            typeof suppressedArgs === "string" &&
            Errors.some(err => suppressedArgs.includes(err))
        ) {
            return;
        }
        origError(...args);
    };
}

export default errorClear