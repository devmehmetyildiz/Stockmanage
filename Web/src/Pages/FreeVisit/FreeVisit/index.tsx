import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import { useGetLocationsQuery } from '@Api/Location'
import { useGetTableMetaQuery } from '@Api/Profile'
import { useGetUsersListQuery } from '@Api/User'
import { useGetVisitsQuery } from '@Api/Visit'
import { VisitListItem, VisitListRequest } from '@Api/Visit/type'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import FreeVisitCommonListFilter from '@Components/FreeVisit/FreeVisitCommonListFilter'
import FreeVisitCompleteModal from '@Components/FreeVisit/FreeVisitCompleteModal'
import FreeVisitWorkModal from '@Components/FreeVisit/FreeVisitWorkModal'
import VisitDeleteModal from '@Components/Visit/VisitDeleteModal'
import { VISIT_STATU_CLOSED, VISIT_STATU_COMPLETED, VISIT_STATU_ON_APPROVE, VISIT_STATU_PLANNED, VISIT_STATU_WORKING, VISIT_TYPE_FREEVISIT } from '@Constant/index'
import Paths from '@Constant/path'
import privileges from '@Constant/privileges'
import { ExcelProvider } from '@Context/ExcelContext'
import useHasPrivileges from '@Hooks/useHasPrivileges'
import { CellContext } from '@tanstack/react-table'
import { loaderCellhandler } from '@Utils/CellHandler'
import { FormatDate, SuppressDate } from '@Utils/FormatDate'
import FormatTableMeta from '@Utils/FormatTableMeta'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button, Icon, Label, Popup, SemanticCOLORS } from 'semantic-ui-react'

const FreeVisit: React.FC = () => {

    const { t } = useTranslation()

    const { isHasPrivilege, isMetaLoading, UserID } = useHasPrivileges(privileges.visitmanageall)
    const { isHasPrivilege: canDelete } = useHasPrivileges(privileges.visitdelete)
    const { isHasPrivilege: canUpdate } = useHasPrivileges(privileges.visitupdate)
    const [openedPopupId, setOpenedPopupId] = useState<string | null>(null)
    const [completeOpen, setCompleteOpen] = useState(false)
    const [workOpen, setWorkOpen] = useState(false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<VisitListItem | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()


    const getDefaultValues = (): VisitListRequest => {
        const start = new Date()
        const end = new Date()
        start.setHours(0, 0, 0, 0)
        end.setHours(0, 0, 0, 0)
        start.setDate(start.getDate() - 14)
        end.setDate(end.getDate() + 1)
        return {
            Isactive: true,
            Status: undefined,
            Visitenddate: SuppressDate(end),
            Visitstartdate: SuppressDate(start),
            Visittype: VISIT_TYPE_FREEVISIT,
            WorkerUserID: UserID,
        }
    }

    const [reqBody, setReqBody] = useState<VisitListRequest | null>(() => {
        const urlStatus = searchParams.get('status')
        const urlStart = searchParams.get('start')
        const urlEnd = searchParams.get('end')

        if (urlStatus || urlStart || urlEnd) {
            return {
                ...getDefaultValues(),
                Status: urlStatus ? Number(urlStatus) : undefined,
                Visitstartdate: urlStart ?? undefined,
                Visitenddate: urlEnd ?? undefined,
            }
        }
        return getDefaultValues()
    })

    const methods = useForm<VisitListRequest>({
        mode: 'onChange',
        defaultValues: reqBody || getDefaultValues()
    })

    const { data, isFetching } = useGetVisitsQuery(reqBody ?? getDefaultValues())

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 })
    const { data: doctordefines, isFetching: isDoctordefinesFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'freevizit' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatDate(value)
    }

    const userCellhandler = (value: string) => {
        const user = (users || []).find(u => u.Uuid === value)
        return user ? `${user.Name} ${user.Surname}` : value
    }

    const doctordefineCellhandler = (value: string) => {
        const doctordefine = (doctordefines || []).find(u => u.Uuid === value)
        return doctordefine ? `${doctordefine.Name} ${doctordefine.Surname}` : t('Common.NoDataFound')
    }

    const locationCellhandler = (value: string) => {
        const location = (locations || []).find(u => u.Uuid === value)
        return location?.Name ?? t('Common.NoDataFound')
    }


    const statusCellhandler = (value: any) => {
        const status = [
            { name: t('Option.VisitStatu.Planned'), value: VISIT_STATU_PLANNED },
            { name: t('Option.VisitStatu.Working'), value: VISIT_STATU_WORKING },
            { name: t('Option.VisitStatu.Onapprove'), value: VISIT_STATU_ON_APPROVE },
            { name: t('Option.VisitStatu.Completed'), value: VISIT_STATU_COMPLETED },
            { name: t('Option.VisitStatu.Closed'), value: VISIT_STATU_CLOSED },
        ]
        return (status || []).find(u => u.value === value)?.name ?? value
    }

    const statusDecoratedCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem

        const status = [
            { color: 'red', name: t('Option.VisitStatu.Planned'), value: VISIT_STATU_PLANNED },
            { color: 'blue', name: t('Option.VisitStatu.Working'), value: VISIT_STATU_WORKING },
            { color: 'orange', name: t('Option.VisitStatu.Onapprove'), value: VISIT_STATU_ON_APPROVE },
            { color: 'green', name: t('Option.VisitStatu.Completed'), value: VISIT_STATU_COMPLETED },
            { color: 'grey', name: t('Option.VisitStatu.Closed'), value: VISIT_STATU_CLOSED },
        ]

        const foundedData = (status || []).find(u => u.value === data.Status)

        return <Label className='!whitespace-nowrap' as='a' tag color={(foundedData?.color as SemanticCOLORS) ?? 'grey'}>
            {foundedData?.name ?? data.Status}
        </Label>
    }

    const processCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as VisitListItem
        const buttons: React.ReactNode[] = []

        if (data.Status !== VISIT_STATU_COMPLETED && !canDelete) {
            buttons.push(
                <Button size='small' color='red' onClick={() => {
                    setOpenedPopupId(null)
                    setDeleteOpen(true)
                    setRecord(data)
                }}>
                    <div className='flex justify-start items-start w-full gap-2'>
                        <Icon name='trash' />
                        <div>
                            {t('Common.Columns.delete')}
                        </div>
                    </div>
                </Button>
            )
        }

        if (data.Status === VISIT_STATU_PLANNED && !canUpdate) {
            buttons.push(
                <Button size='small' color='blue' onClick={() => {
                    setOpenedPopupId(null)
                    setWorkOpen(true)
                    setRecord(data)
                }}>
                    <div className='flex justify-start items-start w-full gap-2'>
                        <Icon name='share' />
                        <div>
                            {t('Common.Columns.work')}
                        </div>
                    </div>
                </Button>
            )
        }

        if (data.Status === VISIT_STATU_WORKING && !canUpdate) {
            buttons.push(
                <Button size='small' color='green' onClick={() => {
                    setOpenedPopupId(null)
                    setCompleteOpen(true)
                    setRecord(data)
                }}>
                    <div className='flex justify-start items-start w-full gap-2'>
                        <Icon name='check' />
                        <div>
                            {t('Common.Columns.complete')}
                        </div>
                    </div>
                </Button>
            )
        }

        return buttons.length > 0 ? <Popup
            open={openedPopupId === data.Visitcode}
            onClose={() => setOpenedPopupId(null)}
            on={'click'}
            position='bottom left'
            trigger={
                <div className='cursor-pointer' onClick={() => setOpenedPopupId(data.Visitcode)}>
                    <Icon name='pencil' size='large' className={`${!(data.Status === VISIT_STATU_CLOSED || data.Status === VISIT_STATU_COMPLETED) ? 'animate-pulse' : ''}`} />
                </div>
            }
        >
            <div className='flex flex-col gap-4'>
                {buttons.map(item => item)}
            </div>
        </Popup > : null
    }

    const columns: ColumnType<VisitListItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Visits.Columns.Status'), accessorKey: 'Status', accessorFn: row => statusCellhandler(row.Status), cell: wrapper => statusDecoratedCellhandler(wrapper), },
        { header: t('Pages.Visits.Columns.Visitcode'), accessorKey: 'Visitcode', isMobile: true },
        { header: t('Pages.Visits.Columns.WorkerUserID'), accessorKey: 'WorkerUserID', accessorFn: row => userCellhandler(row.WorkerUserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching) },
        { header: t('Pages.Visits.Columns.ResponsibleUserID'), accessorKey: 'ResponsibleUserID', accessorFn: row => userCellhandler(row.ResponsibleUserID), cell: wrapper => loaderCellhandler(wrapper, isUsersFetching) },
        { header: t('Pages.Visits.Columns.DoctorID'), accessorKey: 'DoctorID', accessorFn: row => doctordefineCellhandler(row.DoctorID), cell: wrapper => loaderCellhandler(wrapper, isDoctordefinesFetching), isMobile: true },
        { header: t('Pages.Visits.Columns.LocationID'), accessorKey: 'LocationID', accessorFn: row => locationCellhandler(row.LocationID), cell: wrapper => loaderCellhandler(wrapper, isLocationsFetching), },
        { header: t("Pages.Visits.Columns.Visitdate"), accessorKey: 'Visitdate', accessorFn: row => dateCellhandler(row.Visitdate) },
        { header: t('Pages.Visits.Columns.Description'), accessorKey: 'Description', },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Pages.Visits.Columns.Process"), accessorKey: 'process', isIcon: true, pinned: true, cell: (wrapper) => processCellhandler(wrapper), size: 45 },
    ]

    const tableKey = `${isUsersFetching}-${isDoctordefinesFetching}-${isLocationsFetching}-${isUsersFetching}-${isDoctordefinesFetching}-${isLocationsFetching}`

    useEffect(() => {
        if (!isHasPrivilege && reqBody?.WorkerUserID) {
            setReqBody((prev) => {
                return {
                    ...prev,
                    WorkerUserID: undefined
                }
            })
        }
    }, [isHasPrivilege, reqBody, setReqBody])

    useEffect(() => {
        if (reqBody) {
            const params: Record<string, string> = {};

            if (reqBody.Status !== undefined && reqBody.Status !== null) {
                params.status = String(reqBody.Status);
            }

            if (reqBody.Visitstartdate) {
                params.start = reqBody.Visitstartdate;
            }

            if (reqBody.Visitenddate) {
                params.end = reqBody.Visitenddate;
            }

            setSearchParams(params, { replace: true });
        }
    }, [reqBody, setSearchParams]);

    return <Pagewrapper isLoading={isFetching || isMetaLoading} direction='vertical' gap={4} alignTop>
        <FormProvider<VisitListRequest> {...methods}>
            <ExcelProvider>
                <Title
                    PageName={t('Pages.FreeVisits.Page.Header')}
                    PageUrl={Paths.FreeVisits}
                    excelExportName={t('Pages.FreeVisits.Page.Header')}
                    create={{
                        Pagecreateheader: t('Pages.FreeVisits.Page.CreateHeader'),
                        Pagecreatelink: Paths.FreeVisitsCreate,
                        role: privileges.visitadd
                    }}
                />
                <ExcelProvider>
                    <FreeVisitCommonListFilter
                        reqBody={reqBody}
                        setReqBody={setReqBody}
                        pageTitle={t('Pages.FreeVisits.Page.Header')}
                        filterOptions
                    />
                    <DataTable
                        key={tableKey}
                        columns={columns}
                        data={data}
                        config={initialConfig}
                    />
                </ExcelProvider>
                <FreeVisitWorkModal
                    open={workOpen}
                    setOpen={setWorkOpen}
                    data={record}
                    setData={setRecord}
                />
                <VisitDeleteModal
                    open={deleteOpen}
                    setOpen={setDeleteOpen}
                    data={record}
                    setData={setRecord}
                />
                <FreeVisitCompleteModal
                    open={completeOpen}
                    setOpen={setCompleteOpen}
                    data={record}
                    setData={setRecord}
                />
            </ExcelProvider>
        </FormProvider>
    </Pagewrapper>
}
export default FreeVisit