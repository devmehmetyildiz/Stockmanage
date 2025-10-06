import { CellContext } from "@tanstack/react-table"
import { Loader } from "semantic-ui-react"

export const loaderCellhandler = (wrapper: CellContext<any, unknown>, loadingState: boolean) => {
    if (loadingState) {
        return <Loader size='small' active inline='centered' />
    }
    return wrapper.renderValue()
}