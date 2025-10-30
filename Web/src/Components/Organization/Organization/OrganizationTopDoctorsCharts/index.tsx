import { useGetDoctordefinesQuery } from '@Api/Doctordefine'
import { useGetReportSaleByDoctorQuery } from '@Api/Report'
import { ReportRequest } from '@Api/Report/type'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import { TransposeCurreny } from '@Utils/Transposer'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from 'semantic-ui-react'

interface OrganizationTopDoctorsChartsProps {
  filters: ReportRequest
}

const OrganizationTopDoctorsCharts: React.FC<OrganizationTopDoctorsChartsProps> = (props) => {
  const { filters } = props
  const { t } = useTranslation()

  const { data: doctorSales = [], isFetching: isSaleByDoctorFetching } = useGetReportSaleByDoctorQuery(filters, { skip: !filters.Startdate || !filters.Enddate })
  const { data: doctordefines, isFetching: isDoctordefinesFetching } = useGetDoctordefinesQuery({ isActive: 1 })

  return <LoadingWrapper loading={isSaleByDoctorFetching || isDoctordefinesFetching}>
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <div className="text-lg font-semibold mb-3 text-gray-800">{t('Pages.Organisation.TopDoctors.Title')}</div>
      <ul className="divide-y">
        {doctorSales.map((doctorData, i) => {
          const doctor = (doctordefines || []).find(u => u.Uuid === doctorData.DoctorID)
          const name = doctor ? `${doctor.Name} ${doctor.Surname}` : t('Common.NoDataFound')
          return <li key={i} className="py-2 flex items-center gap-3">
            <Icon name="user md" circular className="text-primary !shadow-none" />
            <span className="flex-1">{name}</span>
            <span className="font-bold">{TransposeCurreny(doctorData.TotalPayment)}</span>
          </li>
        })}
      </ul>
    </div>
  </LoadingWrapper>
}
export default OrganizationTopDoctorsCharts