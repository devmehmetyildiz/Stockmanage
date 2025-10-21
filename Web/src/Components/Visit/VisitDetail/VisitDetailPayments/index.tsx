import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Card, Icon, Message, Progress } from 'semantic-ui-react'
import Contentwrapper from '@Components/Common/Contentwrapper'
import Title from '@Components/Common/Title'
import VisitDetailLabel from '../VisitDetailLabel'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import validator from '@Utils/Validator'
import { FormatDate } from '@Utils/FormatDate'
import {
    useGetPaymentplansQuery,
    useGetPaymentplantransactionsQuery,
} from '@Api/Paymentplan'
import { useGetPaymenttypeQuery } from '@Api/Paymenttype'
import { VisitItem } from '@Api/Visit/type'
import PaymentplantransactionApproveModal from '@Components/Paymentplantransaction/PaymentplantransactionApproveModal'
import { PaymentplanTransactionItem } from '@Api/Paymentplan/type'
import FormButton from '@Components/Common/FormButton'

interface VisitDetailPaymentsProps {
    data: VisitItem | undefined
}

const VisitDetailPayments: React.FC<VisitDetailPaymentsProps> = ({ data }) => {
    const { t } = useTranslation()
    const [record, setRecord] = useState<PaymentplanTransactionItem | null>(null)
    const [open, setOpen] = useState(false)

    const { data: paymenttype, isFetching: isPaymenttypeFetching } = useGetPaymenttypeQuery({ Uuid: data?.PaymenttypeID ?? '' }, { skip: !validator.isUUID(data?.PaymenttypeID) })

    const { data: paymentplans, isFetching: isPlansFetching } = useGetPaymentplansQuery({ VisitID: data?.Uuid ?? '' }, { skip: !validator.isUUID(data?.Uuid) })

    const paymentplan = (paymentplans && paymentplans.length > 0) ? paymentplans[0] : undefined

    const { data: transactions, isFetching: isTransactionsFetching } = useGetPaymentplantransactionsQuery({ PaymentplanID: paymentplan?.Uuid ?? '' }, { skip: !validator.isUUID(paymentplan?.Uuid) })

    const scheduledPayment = data?.Scheduledpayment ?? 0
    const paid = useMemo(() =>
        (transactions || []).filter(t => t.Status).reduce((sum, t) => sum + t.Amount, 0),
        [transactions]
    )
    const total = paymentplan?.Totalamount ?? scheduledPayment ?? 0
    const percent = total > 0 ? (paid / total) * 100 : 0

    const handleOpenPayment = (item: PaymentplanTransactionItem) => {
        setRecord(item)
        setOpen(true)
    }

    const loading = isPaymenttypeFetching || isPlansFetching || isTransactionsFetching

    return (
        <LoadingWrapper loading={loading}>
            <Contentwrapper bottomRounded className="flex-1">
                <Title PageName={t('Pages.Visits.Label.Payments')} />

                <Card fluid className="!rounded-xl !shadow !border-0 !bg-white mt-3">
                    <Card.Content>
                        <div className='w-full flex flex-row justify-between items-center'>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon name="money bill alternate" className="text-primary" />
                                    <div className="font-semibold text-gray-800">{t('Pages.Visits.Columns.Scheduledpayment')}</div>
                                </div>

                                <div className="text-xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    }).format(scheduledPayment)}
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <Icon name="money bill alternate" className="text-primary" />
                                    <div className="font-semibold text-gray-800">{t('Pages.Visits.Columns.TotalAmount')}</div>
                                </div>

                                <div className="text-xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    }).format(paymentplan?.Totalamount ?? 0)}
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            <VisitDetailLabel
                                icon="payment"
                                label={t('Pages.Visits.Columns.PaymenttypeID')}
                                value={paymenttype?.Name ?? t('Common.NoDataFound')}
                            />
                            <VisitDetailLabel
                                icon="file alternate"
                                label={t('Pages.Visits.Label.Notes')}
                                value={data?.Notes ?? t('Common.NoDataFound')}
                            />
                        </div>

                        <div className="mt-5">
                            <div className="text-sm text-gray-600">
                                {t('Pages.Visits.Label.Paid')} {paid.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} /
                                {total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
                            </div>
                            <div className="w-full h-2 rounded mt-1">
                                <Progress  indicating percent={percent} size='tiny' autoSuccess color='blue'/>
                            </div>
                        </div>

                        <div className="mt-5">
                            <h4 className="text-gray-800 font-semibold mb-2">{t('Pages.Visits.Label.Installments')}</h4>

                            {!transactions?.length && (
                                <Message info>
                                    <Message.Header>{t('Common.NoDataFound')}</Message.Header>
                                    <p>{t('Pages.Visits.Messages.NoTransactions')}</p>
                                </Message>
                            )}

                            {(transactions || []).map((item) => (
                                <div
                                    key={item.Uuid}
                                    className="flex justify-between items-center border-b py-2 text-sm"
                                >
                                    <div>
                                        <div className="font-medium text-gray-700">{FormatDate(item.Paymentdate)}</div>
                                        <div className="text-gray-500">
                                            {new Intl.NumberFormat('tr-TR', {
                                                style: 'currency',
                                                currency: 'TRY',
                                            }).format(item.Amount)}
                                        </div>
                                    </div>
                                    <div>
                                        {item.Status ? (
                                            <span className="text-primary font-bold">
                                                {t('Common.Paid')}
                                            </span>
                                        ) : (
                                            <FormButton
                                                size="tiny"
                                                color="blue"
                                                icon
                                                text=''
                                                showChildren
                                                labelPosition="left"
                                                onClick={() => handleOpenPayment(item)}
                                            >
                                                <Icon name="money" />
                                                {t('Pages.Visits.Label.Pay')}
                                            </FormButton>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card.Content>
                </Card>
            </Contentwrapper>
            <PaymentplantransactionApproveModal
                open={open}
                setOpen={setOpen}
                setData={setRecord}
                data={record}
            />
        </LoadingWrapper>
    )
}

export default VisitDetailPayments
