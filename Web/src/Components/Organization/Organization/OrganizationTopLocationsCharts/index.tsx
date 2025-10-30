import { useGetLocationsQuery } from '@Api/Location'
import { useGetReportSaleByLocationQuery } from '@Api/Report'
import { ReportRequest } from '@Api/Report/type'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import { TransposeCurreny } from '@Utils/Transposer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from 'semantic-ui-react'

interface OrganizationTopLocationsChartsProps {
    filters: ReportRequest
}

const OrganizationTopLocationsCharts: React.FC<OrganizationTopLocationsChartsProps> = (props) => {
    const { filters } = props
    const { t } = useTranslation()

    const { data: regionSales = [], isFetching: isRegionSalesFetching } = useGetReportSaleByLocationQuery(filters, { skip: !filters.Startdate || !filters.Enddate })
    const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })

    return <LoadingWrapper loading={isRegionSalesFetching || isLocationsFetching}>
        <div className="bg-white rounded-2xl shadow p-6 mt-6">
            <div className="text-lg font-semibold mb-3 text-gray-800">{t('Pages.Organisation.TopLocations.Title')}</div>
            <ul className="divide-y">
                {regionSales.map((locationData, i) => {
                    const location = (locations || []).find(u => u.Uuid === locationData.LocationID)
                    const name = location ? location.Name : t('Common.NoDataFound')
                    return <li key={i} className="py-2 flex items-center gap-3">
                        <Icon name="map marker alternate" circular className="text-primary !shadow-none" />
                        <span className="flex-1">{name}</span>
                        <span className="font-bold">{TransposeCurreny(locationData.TotalPayment)}</span>
                    </li>
                })}
            </ul>
        </div>
    </LoadingWrapper>
}
export default OrganizationTopLocationsCharts