import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import DataTable, { ColumnType } from '@Components/Common/DataTable'
import { useTranslation } from 'react-i18next'
import privileges from '@Constant/privileges'
import { CellContext } from '@tanstack/react-table'
import { FormatFullDate } from '@Utils/FormatDate'
import { useGetTableMetaQuery } from '@Api/Profile'
import FormatTableMeta from '@Utils/FormatTableMeta'
import { ExcelProvider } from '@Context/ExcelContext'
import { DoctordefineItem } from '@Api/Doctordefine/type'
import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import DoctordefineDeleteModal from '@Components/Doctordefine/DoctordefineDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, EditCellHandler } from '@Components/Common/CellHandler'
import { useGetLocationsQuery } from '@Api/Location'
import { loaderCellhandler } from '@Utils/CellHandler'

const Doctordefine: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<DoctordefineItem | null>(null)

    const { data, isFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'doctordefine' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as DoctordefineItem
        return <EditCellHandler url={`/${RouteKeys.Doctordefines}/${data.Uuid}/edit`} />
    }

    const locationCellhandler = (value: string) => {
        const location = (locations || []).find(u => u.Uuid === value)
        return location ? location.Name : t('Common.NoDataFound')
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as DoctordefineItem
        return (
            <DeleteCellHandler
                onClick={() => {
                    setRecord(data)
                    setDeleteOpen(true)
                }}
            />
        )
    }

    const boolCellhandler = (value: any) => {
        return value !== null && (value === 1 ? t('Common.Yes') : t('Common.No'))
    }

    const columns: ColumnType<DoctordefineItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Doctordefines.Columns.Name'), accessorKey: 'Name', isMobile: true },
        { header: t('Pages.Doctordefines.Columns.Surname'), accessorKey: 'Surname' },
        { header: t('Pages.Doctordefines.Columns.CountryID'), accessorKey: 'CountryID' },
        { header: t('Pages.Doctordefines.Columns.Address'), accessorKey: 'Address' },
        { header: t('Pages.Doctordefines.Columns.LocationID'), accessorKey: 'LocationID', accessorFn: row => locationCellhandler(row?.LocationID), cell: wrapper => loaderCellhandler(wrapper, isLocationsFetching) },
        { header: t('Pages.Doctordefines.Columns.Gender'), accessorKey: 'Gender' },
        { header: t('Pages.Doctordefines.Columns.Phonenumber1'), accessorKey: 'Phonenumber1' },
        { header: t('Pages.Doctordefines.Columns.Phonenumber2'), accessorKey: 'Phonenumber2' },
        { header: t('Pages.Doctordefines.Columns.Email'), accessorKey: 'Email' },
        { header: t('Pages.Doctordefines.Columns.Specialization'), accessorKey: 'Specialization' },
        { header: t('Pages.Doctordefines.Columns.Status'), accessorKey: 'Status', accessorFn: row => boolCellhandler(row.Status) },
        { header: t('Pages.Doctordefines.Columns.Role'), accessorKey: 'Role' },
        { header: t('Pages.Doctordefines.Columns.Description'), accessorKey: 'Description' },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.doctordefineupdate, cell: (wrapper) => editCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.doctordefinedelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 },
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    const tableKey = `${isLocationsFetching}`

    return (
        <Pagewrapper isLoading={isFetching || isLocationsFetching} direction='vertical' gap={4} alignTop>
            <ExcelProvider>
                <Title
                    PageName={t('Pages.Doctordefines.Page.Header')}
                    PageUrl={Paths.Doctordefines}
                    excelExportName={t('Pages.Doctordefines.Page.Header')}
                    create={{
                        Pagecreateheader: t('Pages.Doctordefines.Page.CreateHeader'),
                        Pagecreatelink: Paths.DoctordefinesCreate
                    }}
                />
                <DataTable
                    key={tableKey}
                    columns={columns}
                    data={data}
                    config={initialConfig}
                />
            </ExcelProvider>
            <DoctordefineDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                data={record}
                setData={setRecord}
            />
        </Pagewrapper>
    )
}

export default Doctordefine
