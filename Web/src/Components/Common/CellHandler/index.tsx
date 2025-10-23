import { useGetPrivilegesQuery } from '@Api/Profile'
import privileges from '@Constant/privileges'
import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, SemanticICONS } from 'semantic-ui-react'

interface EditCellHandlerProps {
    url: string
    icon?: SemanticICONS
    role?: string
}

const EditCellHandler: React.FC<EditCellHandlerProps> = ({ url, icon, role }) => {
    const { data: userPrivileges, isFetching } = useGetPrivilegesQuery()

    if (role && (!(userPrivileges || []).includes(role)) && !(userPrivileges || []).includes(privileges.admin)) {
        return null
    }

    return isFetching
        ? <Icon size='large' color='grey' name={icon ?? 'edit'} />
        : <Link to={url} ><Icon size='large' className='!text-primary' name={icon ?? 'edit'} /></Link>
}

interface MovementCellHandlerProps {
    url: string
}

const MovementCellHandler: React.FC<MovementCellHandlerProps> = ({ url }) => {

    return <Link to={url} ><Icon size='large' className='!text-primary' name='exchange' /></Link>
}

interface DefineCellHandlerProps {
    url: string
}

const DefineCellHandlerProps: React.FC<DefineCellHandlerProps> = ({ url }) => {

    return <Link to={url} ><Icon size='large' color='red' className='row-edit' name='address book' /></Link>
}

interface DetailCellHandlerProps {
    url: string
}

const DetailCellHandler: React.FC<DetailCellHandlerProps> = ({ url }) => {

    return <Link to={url} ><Icon link size='large' color='grey' name='history' /></Link>
}

interface PatientDetailCellHandlerProps {
    url: string
}

const PatientDetailCellHandler: React.FC<PatientDetailCellHandlerProps> = ({ url }) => {

    return <Link to={url} ><Icon link size='large' className='!text-primary' name='angle double right' /></Link>
}

interface DetailModalCellHandlerProps {
    onClick: () => void
}

const DetailModalCellHandler: React.FC<DetailModalCellHandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='grey' name='history' onClick={onClick} />
}

interface DeleteCellHandlerProps {
    onClick: () => void
    disabled?: boolean
    role?: string
}

const DeleteCellHandler: React.FC<DeleteCellHandlerProps> = ({ onClick, disabled, role }) => {

    const { data: userPrivileges, isFetching } = useGetPrivilegesQuery()

    if (role && (!(userPrivileges || []).includes(role)) && !(userPrivileges || []).includes(privileges.admin)) {
        return null
    }

    return disabled || isFetching
        ? <Icon link size='large' color='grey' name='trash' />
        : <Icon link size='large' color='red' name='trash' onClick={onClick} />
}
interface ExcelCellHandlerProps {
    onClick: () => void
}

const ExcelCellHandler: React.FC<ExcelCellHandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='blue' name='file excel' onClick={onClick} />
}

interface RemoveCellHandlerProps {
    onClick: () => void
}

const RemoveCellHandler: React.FC<RemoveCellHandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='red' name='recycle' onClick={onClick} />
}

interface DeactivateCellhandlerProps {
    onClick: () => void
}

const DeactivateCellhandler: React.FC<DeactivateCellhandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='blue' name='hand point right' onClick={onClick} />
}

interface ActivateCellhandlerProps {
    onClick: () => void
}

const ActivateCellhandler: React.FC<ActivateCellhandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='blue' name='hand point left' onClick={onClick} />
}

interface ApproveCellhandlerProps {
    onClick: () => void
}

const ApproveCellhandler: React.FC<ApproveCellhandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='blue' name='hand point up' onClick={onClick} />
}

interface OnpreviewCellhandlerProps {
    onClick: () => void
}

const OnpreviewCellhandler: React.FC<OnpreviewCellhandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='green' name='save' onClick={onClick} />
}

interface PreviewCellhandlerProps {
    onClick: () => void
}

const PreviewCellhandler: React.FC<PreviewCellhandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='blue' name='file' onClick={onClick} />
}

interface StopCellhandlerProps {
    onClick: () => void
}

const StopCellhandler: React.FC<StopCellhandlerProps> = ({ onClick }) => {

    return <Icon link size='large' color='red' name='stop circle' onClick={onClick} />
}

interface WorkCellhandlerProps {
    onClick: () => void
    disabled?: boolean
}

const WorkCellhandler: React.FC<WorkCellhandlerProps> = ({ onClick, disabled }) => {

    return disabled
        ? <Icon link size='large' color='grey' name='share' />
        : <Icon link size='large' color='blue' name='share' onClick={onClick} />
}

interface CompleteCellhandlerProps {
    onClick?: () => void
    url?: string
}

const CompleteCellhandler: React.FC<CompleteCellhandlerProps> = ({ onClick, url }) => {

    if (url) {
        return <Link to={url} ><Icon link size='large' color='blue' name='share' /></Link>
    }
    return <Icon link size='large' color='blue' name='share' onClick={onClick} />
}

export {
    EditCellHandler,
    DeleteCellHandler,
    DeactivateCellhandler,
    ActivateCellhandler,
    ApproveCellhandler,
    OnpreviewCellhandler,
    PreviewCellhandler,
    StopCellhandler,
    DetailCellHandler,
    DetailModalCellHandler,
    CompleteCellhandler,
    WorkCellhandler,
    DefineCellHandlerProps,
    PatientDetailCellHandler,
    RemoveCellHandler,
    ExcelCellHandler,
    MovementCellHandler
}