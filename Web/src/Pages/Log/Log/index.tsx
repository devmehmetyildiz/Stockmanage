import React, { useMemo, useState } from 'react'

import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'

import { useTranslation } from 'react-i18next'
import { DropdownItemProps, Form, Icon, } from 'semantic-ui-react'
import { LogItem, LogRequest } from '@Api/Log/type'
import { FormatFullDate, SuppressDate } from '@Utils/FormatDate'
import { ExcelProvider } from '@Context/ExcelContext'
import { useGetUsersListQuery } from '@Api/User'
import Contentwrapper from '@Components/Common/Contentwrapper'
import { FormProvider, useForm } from 'react-hook-form'
import { createAppForm } from '@Utils/CreateAppForm'
import FormButton from '@Components/Common/FormButton'
import { useGetLogGetByQueryQuery } from '@Api/Log'
import { CellContext } from '@tanstack/react-table'
import LogDeleteModal from '@Components/Log/LogDetailModal'

const LogAppForm = createAppForm<LogRequest>()

const Log: React.FC = () => {

    const { t } = useTranslation()

    const defaultStartDate = useMemo(() => {
        const date = new Date()
        date.setHours(date.getHours() - 1)
        return date
    }, [])
    const defaultEndDate = useMemo(() => {
        const date = new Date()
        return date
    }, [])

    const [detailOpen, setDetailOpen] = useState<boolean>(false)
    const [record, setRecord] = useState<string | null>(null)
    const [request, setRequest] = useState<LogRequest>({
        Startdate: SuppressDate(defaultStartDate, true),
        Enddate: SuppressDate(defaultEndDate, true)
    } as LogRequest)

    const { data, isFetching } = useGetLogGetByQueryQuery(request)

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 })


    const methods = useForm<LogRequest>({
        mode: 'onChange',
        defaultValues: {
            Startdate: SuppressDate(defaultStartDate, true),
            Enddate: SuppressDate(defaultEndDate, true),
        }
    })

    const { getValues, } = methods

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const requestCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as LogItem

        return <Icon link size='large' name='file' onClick={() => {
            setRecord(data.Requestdata)
            setDetailOpen(true)
        }} />
    }

    const responseCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as LogItem

        return <Icon link size='large' name='file' onClick={() => {
            setRecord(data.Responsedata)
            setDetailOpen(true)
        }} />
    }

    const userOption: DropdownItemProps[] = useMemo(() => {
        return (users || []).map(user => {
            return {
                value: user.Uuid,
                text: `${user.Name} ${user.Surname}`,
            }
        })
    }, [users])

    const ReqOptions: DropdownItemProps[] = [
        { text: "GET", value: "GET" },
        { text: "POST", value: "POST" },
        { text: "PUT", value: "PUT" },
        { text: "DELETE", value: "DELETE" },
    ]

    const ServiceOptions: DropdownItemProps[] = [
        { text: "Auth", value: "Auth" },
        { text: "Business", value: "Business" },
        { text: "Setting", value: "Setting" },
        { text: "System", value: "System" },
        { text: "Userrole", value: "Userrole" },
        { text: "Warehouse", value: "Warehouse" },
        { text: "File", value: "File" },
    ]

    const columns: ColumnType<LogItem>[] = [
        { header: t('Common.Columns.Id'), accessorKey: 'Id' },
        { header: t('Pages.Log.Columns.Service'), accessorKey: 'Service' },
        { header: t('Pages.Log.Columns.User'), accessorKey: 'UserID' },
        { header: t('Pages.Log.Columns.Requesttype'), accessorKey: 'Requesttype', },
        { header: t('Pages.Log.Columns.Requesturl'), accessorKey: 'Requesturl', isMobile: true },
        { header: t('Pages.Log.Columns.Requestip'), accessorKey: 'Requestip', },
        { header: t('Pages.Log.Columns.Status'), accessorKey: 'Status', },
        { header: t('Common.Columns.Createtime'), accessorFn: row => dateCellhandler(row?.Createtime), },
        { header: t('Pages.Log.Columns.Requestdata'), accessorKey: 'RequestdataHolder', cell: wrapper => requestCellhandler(wrapper), isIcon: true, },
        { header: t('Pages.Log.Columns.Responsedata'), accessorKey: 'ResponsedataHolder', cell: wrapper => responseCellhandler(wrapper), isIcon: true, },
    ]


    return <Pagewrapper isLoading={isFetching || isUsersFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Log.Page.Header')}
                PageUrl={Paths.Logs}
                excelExportName={t('Pages.Log.Page.Header')}
            />
            <Contentwrapper className='z-10'>
                <Title
                    PageName={t('Pages.Log.Page.FilterHeader')}
                />
                <FormProvider<LogRequest> {...methods}>
                    <Form>
                        <Form.Group widths='equal'>
                            <LogAppForm.Input name='Startdate' label={t('Pages.Log.Label.Startdate')} type='datetime-local' />
                            <LogAppForm.Input name='Enddate' label={t('Pages.Log.Label.Enddate')} type='datetime-local' />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <LogAppForm.Input name='Status' label={t('Pages.Log.Label.Status')} />
                            <LogAppForm.Select name='Service' label={t('Pages.Log.Label.Service')} options={ServiceOptions} />
                            <LogAppForm.Select name='UserID' label={t('Pages.Log.Label.User')} options={userOption} />
                            <LogAppForm.Input name='Requesturl' label={t('Pages.Log.Label.Targeturl')} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <LogAppForm.Select name='Requesttype' label={t('Pages.Log.Label.Requesttype')} options={ReqOptions} />
                        </Form.Group>
                        <Form.Group widths={'equal'}>
                            <Form.Field>
                                <FormButton
                                    onClick={() => setRequest(getValues())}
                                    text={t('Pages.Log.Label.Filter')}
                                />
                            </Form.Field>
                        </Form.Group>
                    </Form>
                </FormProvider>
            </Contentwrapper>
            {data?.length ?
                <DataTable
                    columns={columns}
                    data={data}
                /> : null
            }
        </ExcelProvider>
        <LogDeleteModal
            data={record}
            open={detailOpen}
            setOpen={setDetailOpen}
            setData={setRecord}
        />
    </Pagewrapper>
}
export default Log