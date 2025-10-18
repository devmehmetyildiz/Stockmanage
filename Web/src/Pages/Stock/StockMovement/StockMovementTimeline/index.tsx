import React, { useState } from 'react'
import { FormatFullDate } from '@Utils/FormatDate'
import {
    VerticalTimeline,
    VerticalTimelineElement,
} from 'react-vertical-timeline-component'
import 'react-vertical-timeline-component/style.min.css'
import { Icon, Label, LabelDetail } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { UserListItem } from '@Api/User/type'
import { StockmovementItem } from '@Api/Stock/type'
import { STOCK_SOURCETYPE_USER, STOCK_SOURCETYPE_VISIT } from '@Constant/index'
import Title from '@Components/Common/Title'
import StockDeleteMovementModal from '@Components/Stock/StockDeleteMovementModal'
import NotfoundScreen from '@Components/Common/NotfoundScreen'
import { VisitListItem } from '@Api/Visit/type'

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

    const sourceTypeOpiton = [
        { value: STOCK_SOURCETYPE_USER, text: t('Option.StockSourceType.User') },
        { value: STOCK_SOURCETYPE_VISIT, text: t('Option.StockSourceType.Visit') },
    ]

    return <>
        {movements.length > 0 ?
            <VerticalTimeline lineColor="#d1d5db">
                {movements.map((item) => {
                    const isIn = item.Type === 1;

                    const sourceTypeText = `${sourceTypeOpiton.find(u => u.value === item.Sourcetype)?.text} ${isIn ? t('Option.In') : t('Option.Out')}`

                    const getSourceValueText = () => {
                        if (item.Sourcetype === STOCK_SOURCETYPE_USER) {
                            const user = ((users || []).find(u => u.Uuid === item.SourceID))
                            return user ? `${user?.Name} ${user.Surname}` : item.SourceID
                        } else if (item.Sourcetype === STOCK_SOURCETYPE_VISIT) {
                            const visit = ((visits || []).find(u => u.Uuid === item.SourceID))
                            return visit ? visit?.Visitcode : item.SourceID
                        }
                    }

                    const getGetWorkedUsername = () => {
                        const user = ((users || []).find(u => u.Uuid === item.UserID))
                        return user ? `${user?.Name} ${user.Surname}` : item.UserID
                    }

                    return (
                        <VerticalTimelineElement
                            key={item.Uuid}
                            className=''

                            date={<Label className='!bg-primary !text-white'  >
                                {t('Pages.Stocks.Columns.Movementdate')}
                                <LabelDetail>
                                    {FormatFullDate(item.Movementdate)}
                                </LabelDetail>
                            </Label> as any}
                            icon={
                                <div className="flex items-center justify-center w-full h-full " >
                                    <div className='ml-1'>
                                        <Icon
                                            name={isIn ? "arrow up" : "arrow down"}

                                            size="large"
                                        />
                                    </div>
                                </div>
                            }
                            contentArrowStyle={{
                                borderRight: isIn ? "7px solid #2C3E50" : "7px solid #2C3E50",
                            }}
                            iconStyle={{
                                background: "#2C3E50",
                                color: "#fff",
                            }}
                            contentStyle={{ background: "transparent", borderRadius: '12px', boxShadow: "none", padding: 0 }}
                        >
                            <div className={`flex flex-col justify-start items-start w-full gap-0 transition-all hover:-translate-y-2 duration-1000 shadow-primary shadow-sm p-4 rounded-xl border-b-8 border-primary border-solid cursor-pointer bg-white `} >
                                <div className='flex flex-row justify-between items-center w-full m-0 p-0'>
                                    <Title
                                        isLabel
                                        PageName={isIn ? t('Pages.Stocks.Label.Input') : t('Pages.Stocks.Label.Output')}
                                    />
                                    <div className='cursor-pointer mb-auto' onClick={() => {
                                        setDeleteOpen(true)
                                        setRecord(item)
                                    }}>
                                        <Icon name='delete' size='large' className='!text-primary' />
                                    </div>
                                </div>
                                <div className='flex justify-start items-start w-full flex-col gap-1 '>
                                    <h4 className="font-medium ">
                                        {t('Common.Amount')}<span className="font-semibold">{item.Amount} {t('Common.Unit')}</span>
                                    </h4>
                                    <div className=" text-gray-600 ">{`${getSourceValueText()} ${sourceTypeText}`}</div>
                                    <div className=" text-sm text-gray-500 flex items-center justify-center">
                                        <div className='flex'>
                                            <Icon name="user" circular className=' !border-0' />
                                        </div> {getGetWorkedUsername()}
                                    </div>
                                </div>
                            </div>
                        </VerticalTimelineElement>
                    );
                })}
            </VerticalTimeline >
            : <NotfoundScreen text={t('Pages.Stocks.Label.NotFoundMovement')} />}
        <StockDeleteMovementModal
            open={deleteOpen}
            setOpen={setDeleteOpen}
            data={record}
            setData={setRecord}
        />
    </>
}
export default StockMovementTimeline