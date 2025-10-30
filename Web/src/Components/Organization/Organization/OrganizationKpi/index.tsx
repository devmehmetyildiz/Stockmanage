import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import { useGetReportSaleByDoctorQuery, useGetReportSaleByLocationQuery, useGetReportSaleByUserQuery } from '@Api/Report'
import { ReportRequest } from '@Api/Report/type'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { TransposeCurreny } from '@Utils/Transposer'
import { useGetLocationsQuery } from '@Api/Location'

interface OrganizationKpiProps {
    filters: ReportRequest
}

const OrganizationKpi: React.FC<OrganizationKpiProps> = ({ filters }) => {

    const { t } = useTranslation()

    const { data: doctordefines, isFetching: isDoctordefinesFetching } = useGetDoctordefinesQuery({ isActive: 1 })
    const { data: locations, isFetching: isLocationsFetching } = useGetLocationsQuery({ isActive: 1 })
    const { data: userSales = [], isFetching: isSaleByUserFetching } = useGetReportSaleByUserQuery(filters, { skip: !filters.Startdate || !filters.Enddate })
    const { data: doctorSales = [], isFetching: isSaleByDoctorFetching } = useGetReportSaleByDoctorQuery(filters, { skip: !filters.Startdate || !filters.Enddate })
    const { data: locationSales = [], isFetching: isSaleByLocationFetching } = useGetReportSaleByLocationQuery(filters, { skip: !filters.Startdate || !filters.Enddate })

    const totalSales = userSales.reduce((acc, item) => acc + (item.TotalPayment || 0), 0)
    const topDoctor = doctorSales.sort((a, b) => (b.TotalPayment || 0) - (a.TotalPayment || 0))[0]?.DoctorID
    const topLocation = locationSales.sort((a, b) => (b.TotalPayment || 0) - (a.TotalPayment || 0))[0]?.LocationID

    const findDoctor = (Id: string) => {
        const doctor = (doctordefines || []).find(u => u.Uuid === Id)
        return doctor ? `${doctor.Name} ${doctor.Surname}` : t('Common.NoDataFound')
    }

    const findLocation = (Id: string) => {
        const location = (locations || []).find(u => u.Uuid === Id)
        return location ? location.Name : t('Common.NoDataFound')
    }

    const pageLoading = isDoctordefinesFetching || isLocationsFetching || isSaleByUserFetching || isSaleByDoctorFetching || isSaleByLocationFetching

    const kpiItems = [
        {
            label: t('Pages.Organisation.Kpi.TotalPayment'),
            value: TransposeCurreny(totalSales),
            icon: <Icon name='money bill alternate' className='text-primary' size='large' />,
        },
        {
            label: t('Pages.Organisation.Kpi.TopDoctor'),
            value: findDoctor(topDoctor),
            icon: <Icon name='user md' className='text-primary' size='large' />,
        },
        {
            label: t('Pages.Organisation.Kpi.TopLocation'),
            value: findLocation(topLocation),
            icon: <Icon name='map marker alternate' className='text-primary' size='large' />,
        },
    ];

    return <LoadingWrapper loading={pageLoading}>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
            {kpiItems.map((item, idx) => (
                <motion.div
                    key={idx}
                    whileHover={{ scale: 1.03, transitionDuration: "0.5s", boxShadow: "0 8px 32px rgba(0,0,0,.13)" }}
                    className={`cursor-pointer rounded-2xl shadow p-5 flex items-center gap-5 bg-white border-b-primary border-b-4`}
                >
                    <div className="flex-shrink-0">{item.icon}</div>
                    <div>
                        <div className="font-semibold text-gray-500">{item.label}</div>
                        <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                    </div>
                </motion.div>
            ))}
        </div>
    </LoadingWrapper>
}
export default OrganizationKpi