import React from 'react'
import Chart from 'react-apexcharts'
import { Icon, SemanticICONS } from 'semantic-ui-react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { CashflowGraphRequest, CashflowGraphResponse } from '@Api/Cashflow/type'
import { TransposeCurreny } from '@Utils/Transposer'
import { FormatDate } from '@Utils/FormatDate'

interface CashflowDashboardProps {
    data: CashflowGraphResponse
    reqBody: CashflowGraphRequest
}

const CashflowDashboard: React.FC<CashflowDashboardProps> = ({ data, reqBody }) => {
    const { t } = useTranslation()
    const { summary, details } = data || { summary: {}, details: [] }

    const chartOptions: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            stacked: false,
            toolbar: {
                show: true,
                tools: {
                    download: false,
                    selection: true,
                    zoom: true,
                    zoomin: true,
                    zoomout: true,
                    pan: true,
                    reset: true
                }
            },
            zoom: {
                enabled: true,
                type: 'x',
                autoScaleYaxis: true
            },
            locales: [{
                name: 'tr',
                options: {
                    months: [
                        t('Option.Month.January'), t('Option.Month.February'), t('Option.Month.March'),
                        t('Option.Month.April'), t('Option.Month.May'), t('Option.Month.June'),
                        t('Option.Month.July'), t('Option.Month.August'), t('Option.Month.September'),
                        t('Option.Month.October'), t('Option.Month.November'), t('Option.Month.December'),
                    ],
                    shortMonths: [
                        t('Option.SortMonth.January'), t('Option.SortMonth.February'), t('Option.SortMonth.March'),
                        t('Option.SortMonth.April'), t('Option.SortMonth.May'), t('Option.SortMonth.June'),
                        t('Option.SortMonth.July'), t('Option.SortMonth.August'), t('Option.SortMonth.September'),
                        t('Option.SortMonth.October'), t('Option.SortMonth.November'), t('Option.SortMonth.December'),
                    ],
                    days: [
                        t('Option.Day.Sunday'), t('Option.Day.Monday'), t('Option.Day.Tuesday'),
                        t('Option.Day.Wednesday'), t('Option.Day.Thursday'), t('Option.Day.Friday'), t('Option.Day.Saturday'),
                    ],
                    shortDays: [
                        t('Option.SortDay.Sunday'), t('Option.SortDay.Monday'), t('Option.SortDay.Tuesday'),
                        t('Option.SortDay.Wednesday'), t('Option.SortDay.Thursday'), t('Option.SortDay.Friday'), t('Option.SortDay.Saturday'),
                    ],
                    toolbar: {
                        selection: t('Option.Selection'),
                        selectionZoom: t('Option.SelectionZoom'),
                        zoomIn: t('Option.ZoomIn'),
                        zoomOut: t('Option.ZoomOut'),
                        pan: t('Option.Pan'),
                        reset: t('Option.Reset'),
                    }
                }
            }],
            defaultLocale: 'tr'
        },
        colors: ['#10b981', '#ef4444', '#3b82f6'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: [3, 3, 2] },
        xaxis: {
            categories: details.map((d) => d.Date),
            type: 'datetime',
            labels: {
                style: { colors: '#94a3b8' },
                datetimeFormatter: {
                    year: 'yyyy',
                    month: 'MMM \'yy',
                    day: 'dd MMM',
                    hour: 'HH:mm'
                }
            }
        },
        yaxis: {
            labels: {
                style: { colors: '#94a3b8' },
                formatter: (val) => TransposeCurreny(val)
            }
        },
        tooltip: {
            x: { format: 'dd MMMM yyyy' },
            y: {
                formatter: (val) => TransposeCurreny(val)
            }
        },
        fill: {
            type: 'gradient',
            gradient: { opacityFrom: 0.4, opacityTo: 0.1 }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetY: 0,
            labels: {
                colors: '#64748b'
            },
        },
        grid: {
            borderColor: '#f1f5f9',
            xaxis: { lines: { show: true } }
        }
    }

    const chartSeries = [
        { name: t('Pages.CashflowReport.Income'), data: details.map((d) => d.TotalIncome) },
        { name: t('Pages.CashflowReport.Expense'), data: details.map((d) => d.TotalExpense) },
        { name: t('Pages.CashflowReport.NetChange'), data: details.map((d) => d.NetChange) }
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full space-y-6 mt-6"
        >
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white/40 backdrop-blur-md border border-slate-200 p-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                        <Icon name="calendar alternate" className="!m-0 text-indigo-600" />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-slate-700 leading-none">
                            {t('Pages.CashflowReport.ReportPeriod')}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                            {t('Pages.CashflowReport.ShowingDataForSelectedRange')}
                        </p>
                    </div>
                </div>

                <div className="mt-3 md:mt-0 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-inner">
                    <span className="text-sm font-medium text-slate-600">{FormatDate(reqBody.startDate)}</span>
                    <Icon name="arrow right" size="small" className="text-slate-300" />
                    <span className="text-sm font-medium text-slate-600">{FormatDate(reqBody.endDate)}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title={t('Pages.CashflowReport.Label.TotalIncome')}
                    value={summary.GrandTotalIncome}
                    icon="arrow up"
                    gradient="from-emerald-50 to-teal-50"
                    iconBg="bg-emerald-500"
                    textColor="text-emerald-700"
                />
                <SummaryCard
                    title={t('Pages.CashflowReport.Label.TotalExpense')}
                    value={summary.GrandTotalExpense}
                    icon="arrow down"
                    gradient="from-rose-50 to-orange-50"
                    iconBg="bg-rose-500"
                    textColor="text-rose-700"
                />
                <SummaryCard
                    title={t('Pages.CashflowReport.Label.NetBalance')}
                    value={summary.GrandNetProfit}
                    icon="rocket"
                    gradient="from-indigo-50 to-blue-50"
                    iconBg="bg-indigo-500"
                    textColor="text-indigo-700"
                />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-gray-700">{t('Pages.CashflowReport.GraphTitle')}</h3>
                    <div className="text-xs text-gray-400">{t('Pages.CashflowReport.MovementDaily')}</div>
                </div>
                <Chart
                    options={chartOptions}
                    series={chartSeries}
                    type="area"
                    height={350}
                />
            </div>
        </motion.div>
    )
}

const SummaryCard = ({ title, value, icon, gradient, iconBg, textColor }: any) => {
    const { t } = useTranslation();
    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.01 }}
            className={`relative cursor-pointer overflow-hidden rounded-[2rem] p-6 bg-gradient-to-br ${gradient} border border-white/60 shadow-lg shadow-slate-200/40`}
        >
            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                    <div className={`${iconBg} p-3 rounded-2xl shadow-lg shadow-black/5`}>
                        <Icon name={icon as SemanticICONS} className="!m-0 !text-white" size="large" />
                    </div>
                    <div className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' })}
                    </div>
                </div>

                <div>
                    <p className={`text-sm font-semibold uppercase tracking-tight opacity-70 ${textColor}`}>
                        {title}
                    </p>
                    <h3 className={`text-3xl font-black mt-1 tracking-tight ${textColor}`}>
                        {TransposeCurreny(value || 0)}
                    </h3>
                </div>
            </div>

            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
        </motion.div>
    )
}

export default CashflowDashboard