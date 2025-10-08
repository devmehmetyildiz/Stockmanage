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
import { STOCK_SOURCETYPE_USER } from '@Constant/index'
import Title from '@Components/Common/Title'
import StockDeleteMovementModal from '@Components/Stock/StockDeleteMovementModal'
import NotfoundScreen from '@Components/Common/NotfoundScreen'

interface StockMovementTimelineProps {
    users: UserListItem[] | undefined
    data: StockmovementItem[] | undefined
}

const StockMovementTimeline: React.FC<StockMovementTimelineProps> = (props) => {

    const { users, data } = props

    const { t } = useTranslation()

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<StockmovementItem | null>(null)

    const movements = data || []

    const sourceTypeOpiton = [
        { value: STOCK_SOURCETYPE_USER, text: t('Option.StockSourceType.User') },
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
                            <div className={`transition-all hover:-translate-y-2 duration-1000 shadow-primary shadow-sm p-4 rounded-xl border-b-8 border-primary border-solid cursor-pointer bg-white`} >
                                <Title
                                    isLabel
                                    PageName={isIn ? t('Pages.Stocks.Label.Input') : t('Pages.Stocks.Label.Output')}
                                    additionalButtons={[
                                        {
                                            onClick: () => {
                                                setDeleteOpen(true)
                                                setRecord(item)
                                            },
                                            icon: 'delete',
                                            iconOnly: true
                                        }
                                    ]}
                                />
                                <h4 className="font-medium">
                                    {t('Common.Amount')}<span className="font-semibold">{item.Amount} {t('Common.Unit')}</span>
                                </h4>
                                <p className="mt-2 text-gray-600">{`${getSourceValueText()} ${sourceTypeText}`}</p>
                                <p className="mt-2 text-sm text-gray-500 flex items-center">
                                    <Icon name="user" /> {getGetWorkedUsername()}
                                </p>
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