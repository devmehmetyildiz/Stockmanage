import Contentwrapper from '@Components/Common/Contentwrapper'
import Title from '@Components/Common/Title'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Icon } from 'semantic-ui-react'
import VisitDetailLabel from '../VisitDetailLabel'
import { VisitItem } from '@Api/Visit/type'
import { useGetPaymenttypeQuery } from '@Api/Paymenttype'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import validator from '@Utils/Validator'

interface VisitDetailPaymentsProps {
    data: VisitItem | undefined
}

const VisitDetailPayments: React.FC<VisitDetailPaymentsProps> = (props) => {
    const { data, } = props

    const { t } = useTranslation()

    const { data: paymenttype, isFetching: isPaymenttypesFetching } = useGetPaymenttypeQuery({ Uuid: data?.PaymenttypeID ?? '' }, { skip: !validator.isUUID(data?.PaymenttypeID) });

    const scheduledPayment = data?.Scheduledpayment ?? 0;

    return <LoadingWrapper loading={isPaymenttypesFetching}>
        <Contentwrapper bottomRounded className="flex-1">
            <Title PageName={t('Pages.Visits.Label.Payments')} />
            <Card fluid className="!rounded-xl !shadow !border-0 !bg-white mt-3">
                <Card.Content>
                    <div className="flex items-center gap-3">
                        <div className='flex justify-center items-center mb-2'>
                            <Icon name="money bill alternate" className='!text-primary' />
                        </div>
                        <div className="font-semibold text-gray-800">
                            {t('Pages.Visits.Columns.Scheduledpayment')}
                        </div>
                    </div>
                    <div className="mt-2 text-xl font-bold text-gray-900">
                        {typeof scheduledPayment === 'number'
                            ? new Intl.NumberFormat(undefined, {
                                style: 'currency',
                                currency: 'TRY',
                                currencyDisplay: 'narrowSymbol',
                            }).format(scheduledPayment)
                            : '—'}
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
                </Card.Content>
            </Card>
        </Contentwrapper>
    </LoadingWrapper>
}
export default VisitDetailPayments