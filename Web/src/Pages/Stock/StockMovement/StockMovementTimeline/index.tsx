import React, { useState } from 'react'
import { FormatFullDate } from '@Utils/FormatDate'
import { Icon, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { UserListItem } from '@Api/User/type'
import { StockmovementItem } from '@Api/Stock/type'
import { STOCK_SOURCETYPE_USER, STOCK_SOURCETYPE_VISIT } from '@Constant/index'
import StockDeleteMovementModal from '@Components/Stock/StockDeleteMovementModal'
import NotfoundScreen from '@Components/Common/NotfoundScreen'
import { VisitListItem } from '@Api/Visit/type'
import { motion, AnimatePresence } from 'framer-motion'

interface StockMovementTimelineProps {
    users: UserListItem[] | undefined
    visits: VisitListItem[] | undefined
    data: StockmovementItem[] | undefined
}

const StockMovementTimeline: React.FC<StockMovementTimelineProps> = (props) => {
    const { users, data, visits } = props
    const { t } = useTranslation()
    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<StockmovementItem | null>(null)

    const movements = data || []

    return (
        <div className="w-full">
            <AnimatePresence>
                {movements.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {movements.map((item, index) => {
                            const isIn = item.Type === 1;
                            const workedUser = users?.find(u => u.Uuid === item.UserID);
                            
                            const getSourceText = () => {
                                if (item.Sourcetype === STOCK_SOURCETYPE_USER) {
                                    const user = users?.find(u => u.Uuid === item.SourceID);
                                    return user ? `${user.Name} ${user.Surname}` : item.SourceID;
                                } else if (item.Sourcetype === STOCK_SOURCETYPE_VISIT) {
                                    const visit = visits?.find(v => v.Uuid === item.SourceID);
                                    return visit ? visit.Visitcode : item.SourceID;
                                }
                                return '-';
                            };

                            return (
                                <motion.div
                                    key={item.Uuid}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="group flex items-center justify-between p-4 hover:bg-blue-50/40 transition-all duration-200"
                                >
                                    {/* Sol: İkon ve Miktar */}
                                    <div className="flex items-center gap-6 min-w-[120px]">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                                            isIn ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                                        }`}>
                                            <Icon name={isIn ? "plus" : "minus"} size="small" className="!m-0" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-lg font-bold text-gray-800 leading-none">
                                                {item.Amount}
                                            </span>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-tight">
                                                {t('Common.Unit')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-grow grid grid-cols-3 gap-8 px-8 border-l border-gray-100 ml-4">
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{t('Common.Source')}</span>
                                            <span className="text-sm font-semibold text-gray-700 truncate">{getSourceText()}</span>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{t('Common.Columns.Createduser')}</span>
                                            <span className="text-sm text-gray-600">{workedUser ? `${workedUser.Name} ${workedUser.Surname}` : '-'}</span>
                                        </div>
                                        <div className="flex flex-col justify-center">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">{t('Pages.Stocks.Columns.Movementdate')}</span>
                                            <span className="text-sm text-gray-500 font-medium">{FormatFullDate(item.Movementdate)}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Popup
                                            content={t('Common.Button.Delete')}
                                            trigger={
                                                <button 
                                                    onClick={() => { setDeleteOpen(true); setRecord(item); }}
                                                    className="p-2 text-gray-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Icon name="trash alternate" size="large" />
                                                </button>
                                            }
                                        />
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-10"><NotfoundScreen text={t('Pages.Stocks.Label.NotFoundMovement')} /></div>
                )}
            </AnimatePresence>

            <StockDeleteMovementModal open={deleteOpen} setOpen={setDeleteOpen} data={record} setData={setRecord} />
        </div>
    );
};

export default StockMovementTimeline;