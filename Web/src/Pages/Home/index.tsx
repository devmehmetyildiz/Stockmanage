import { useGetMetaQuery } from '@Api/Profile'
import { useGetVisitByStatusQuery, useGetVisitCountByWaitingWorkQuery, useGetVisitCountFreeVisitCompletedQuery } from '@Api/Visit'
import Pagewrapper from '@Components/Common/Pagewrapper'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from 'semantic-ui-react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    VISIT_STATU_CLOSED,
    VISIT_STATU_COMPLETED,
    VISIT_STATU_ON_APPROVE,
    VISIT_STATU_PLANNED,
    VISIT_STATU_WORKING
} from '@Constant/index'
import { useNavigate } from 'react-router-dom'
import RouteKeys from '@Constant/routeKeys'

const Home: React.FC = () => {
    const { t } = useTranslation()

    const navigate = useNavigate()
    const { data: meta, isFetching: isMetaFetching } = useGetMetaQuery()
    const { data: countData } = useGetVisitByStatusQuery()
    const { data: waitingWorkCount } = useGetVisitCountByWaitingWorkQuery()
    const { data: freeVisitCompletedCount } = useGetVisitCountFreeVisitCompletedQuery()
    const statusConfigs = [
        { label: t('Option.VisitStatu.Planned'), value: VISIT_STATU_PLANNED, color: '#3B82F6', gradient: 'from-blue-500 to-blue-600', icon: 'calendar check' },
        { label: t('Option.VisitStatu.Working'), value: VISIT_STATU_WORKING, color: '#F59E0B', gradient: 'from-amber-400 to-orange-500', icon: 'setting' },
        { label: t('Option.VisitStatu.Onapprove'), value: VISIT_STATU_ON_APPROVE, color: '#10B981', gradient: 'from-emerald-400 to-teal-500', icon: 'hourglass start' },
        { label: t('Option.VisitStatu.Completed'), value: VISIT_STATU_COMPLETED, color: '#6366F1', gradient: 'from-indigo-500 to-purple-600', icon: 'check circle' },
        { label: t('Option.VisitStatu.Closed'), value: VISIT_STATU_CLOSED, color: '#6B7280', gradient: 'from-gray-500 to-slate-600', icon: 'archive' },
    ]

    return (
        <Pagewrapper gap={20} className='pt-20' isLoading={isMetaFetching}>
            <div className="min-h-screen w-full p-4 md:p-10 font-sans text-slate-900">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">
                            {t('Label.Welcome')}, <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{meta?.Name}</span> 👋
                        </h1>
                        <p className="text-slate-500 mt-2 text-lg font-medium">
                            {t('Pages.Home.Messages.Subtitle')}
                        </p>
                    </div>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    <AnimatePresence>
                        {statusConfigs.map((status, i) => {
                            const count = countData?.find((item) => item.Status === status.value)?.Count || 0;
                            return (
                                <motion.div
                                    key={status.value}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                    className="relative group cursor-pointer"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10 rounded-3xl"
                                        style={{ backgroundColor: `${status.color}20` }} />

                                    <div className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${status.gradient} flex items-center justify-center mb-6 shadow-lg shadow-inherit`}>
                                            <Icon name={status.icon as any} size="large" inverted className="!m-0" />
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-slate-400 text-xs uppercase font-bold tracking-widest leading-none">
                                                {status.label}
                                            </h3>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                                                    {count}
                                                </span>
                                                <span className="text-slate-400 text-sm font-medium">{t('Pages.Visits.Label.Unit')}</span>
                                            </div>
                                        </div>
                                        <div onClick={() => navigate(RouteKeys.Visits)} className="mt-4 pt-4 border-t border-slate-50 flex items-center text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
                                            {t('Pages.Home.Messages.Showdetail')} <Icon name="arrow right" className="ml-2" size="small" />
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {[
                        {
                            title: t('Pages.Home.Messages.WaitingWorkVisitTitle'),
                            count: waitingWorkCount?.[0]?.Count || 0,
                            icon: 'briefcase',
                            color: 'from-violet-500 to-purple-600',
                            desc: t('Pages.Home.Messages.YouHaveWaitingWorkVisit')
                        },
                        {
                            title: t('Pages.Home.Messages.FreeVisitTitle'),
                            count: freeVisitCompletedCount?.[0]?.Count || 0,
                            icon: 'gift',
                            color: 'from-cyan-500 to-blue-500',
                            desc: t('Pages.Home.Messages.YouHaveFreeVisit')
                        }
                    ].map((card, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx === 0 ? -30 : 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/60 backdrop-blur-md border border-white p-8 rounded-[2.5rem] shadow-sm flex items-center justify-between group hover:bg-white transition-all duration-500"
                        >
                            <div className="flex items-center gap-6">
                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform`}>
                                    <Icon name={card.icon as any} size="large" inverted />
                                </div>
                                <div>
                                    <h4 className="text-slate-800 font-bold text-xl">{card.title}</h4>
                                    <p className="text-slate-500 font-medium">{card.desc}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-5xl font-black bg-gradient-to-br from-slate-700 to-slate-900 bg-clip-text text-transparent">
                                    {card.count}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </Pagewrapper>
    )
}

export default Home