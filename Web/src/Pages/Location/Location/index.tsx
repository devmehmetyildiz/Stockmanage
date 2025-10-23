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
import { LocationItem } from '@Api/Location/type'
import { useGetLocationsQuery } from '@Api/Location'
import LocationDeleteModal from '@Components/Location/LocationDeleteModal'
import RouteKeys from '@Constant/routeKeys'
import { DeleteCellHandler, EditCellHandler } from '@Components/Common/CellHandler'

const Location: React.FC = () => {

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<LocationItem | null>(null)

    const { data, isFetching } = useGetLocationsQuery({ isActive: 1 })

    const TableQuery = useGetTableMetaQuery({ Key: 'location' })

    const initialConfig = FormatTableMeta(TableQuery.data)

    const dateCellhandler = (value: any) => {
        return FormatFullDate(value)
    }

    const editCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as LocationItem

        return <EditCellHandler url={`/${RouteKeys.Locations}/${data.Uuid}/edit`} />
    }

    const deleteCellhandler = (wrapper: CellContext<any, unknown>) => {
        const data = wrapper.row.original as LocationItem

        return <DeleteCellHandler onClick={() => {
            setRecord(data)
            setDeleteOpen(true)
        }} />
    }

    const columns: ColumnType<LocationItem>[] = [
        { header: t("Common.Columns.Id"), accessorKey: 'Id', isIcon: true },
        { header: t("Common.Columns.Uuid"), accessorKey: 'Uuid' },
        { header: t('Pages.Locations.Columns.Name'), accessorKey: 'Name', isMobile: true },
        { header: t('Pages.Locations.Columns.Description'), accessorKey: 'Description' },
        { header: t("Common.Columns.Createduser"), accessorKey: 'Createduser' },
        { header: t("Common.Columns.Createtime"), accessorKey: 'Createtime', accessorFn: row => dateCellhandler(row?.Createtime) },
        { header: t("Common.Columns.Updateduser"), accessorKey: 'Updateduser' },
        { header: t("Common.Columns.Updatetime"), accessorKey: 'Updatetime', accessorFn: row => dateCellhandler(row?.Updatetime) },
        { header: t("Common.Columns.edit"), accessorKey: 'edit', isIcon: true, pinned: true, role: privileges.locationupdate, cell: (wrapper) => editCellhandler(wrapper), size: 45 },
        { header: t("Common.Columns.delete"), accessorKey: 'delete', isIcon: true, pinned: true, role: privileges.locationdelete, cell: (wrapper) => deleteCellhandler(wrapper), size: 45 }
    ]

    useEffect(() => {
        if (!deleteOpen) {
            setRecord(null)
        }
    }, [deleteOpen, setRecord])

    return (
        <Pagewrapper isLoading={isFetching} direction='vertical' gap={4} alignTop>
            <ExcelProvider>
                <Title
                    PageName={t('Pages.Locations.Page.Header')}
                    PageUrl={Paths.Locations}
                    excelExportName={t('Pages.Locations.Page.Header')}
                    create={{
                        Pagecreateheader: t('Pages.Locations.Page.CreateHeader'),
                        Pagecreatelink: Paths.LocationsCreate,
                        role:privileges.locationadd
                    }}
                />
                <DataTable
                    columns={columns}
                    data={data}
                    config={initialConfig}
                />
            </ExcelProvider>
            <LocationDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                data={record}
                setData={setRecord}
            />
        </Pagewrapper>
    )
}

export default Location
