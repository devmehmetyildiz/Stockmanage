import { useGetReportMonthlySalesQuery } from '@Api/Report';
import { ReportRequest } from '@Api/Report/type';
import LoadingWrapper from '@Components/Common/LoadingWrapper';
import { ApexOptions } from 'apexcharts';
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTranslation } from 'react-i18next';

interface OrganizationMonthlyBalanceChartProps {
  filters: ReportRequest
}

const OrganizationMonthlyBalanceChart: React.FC<OrganizationMonthlyBalanceChartProps> = (props) => {
  const { filters } = props
  const { t } = useTranslation()

  const { data: sales = [], isFetching: isSalesFetching } = useGetReportMonthlySalesQuery(filters, { skip: !filters.Startdate || !filters.Enddate })

  const chartOptions: ApexOptions = {
    chart: {
      height: 350,
      type: 'line',
      dropShadow: {
        enabled: true,
        color: '#000',
        top: 18,
        left: 7,
        blur: 10,
        opacity: 0.5
      },
      zoom: {
        enabled: false
      },
      toolbar: {
        show: false
      }
    },
    colors: ['#77B6EA', '#545454'],
    dataLabels: {
      enabled: true,
    },
    stroke: {
      curve: 'smooth'
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['#f3f3f3', 'transparent'],
        opacity: 0.5
      },
    },
    markers: {
      size: 1
    },
    xaxis: {
      categories: sales.map(u => u.SalesMonth),
      title: {
        text: t('Pages.Organisation.MonthlySales.Categories'),
      }
    },
    yaxis: {
      title: {
        text: t('Pages.Organisation.MonthlySales.Value'),
      },

    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      floating: true,
      offsetY: -25,
      offsetX: -5
    },
    tooltip: {
      y: { formatter: val => `${val} ₺` }
    },
  }

  const series = [
    { name: t('Pages.Organisation.MonthlySales.Sales'), data: sales.map(i => i.TotalPayment) }
  ];

  return (<LoadingWrapper loading={isSalesFetching}>
    <div className="bg-white rounded-2xl shadow p-6 mt-6">
      <div className="text-lg font-semibold mb-3 text-gray-800">{t('Pages.Organisation.MonthlySales.Title')}</div>
      <ReactApexChart options={chartOptions} series={series} type="line" height={250} />
    </div>
  </LoadingWrapper>
  );
}
export default OrganizationMonthlyBalanceChart
