import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, Icon, Message, Progress } from 'semantic-ui-react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Contentwrapper from '@Components/Common/Contentwrapper'
import VisitDetailLabel from '@Components/Visit/VisitDetail/VisitDetailLabel'
import LoadingWrapper from '@Components/Common/LoadingWrapper'
import { FormatDate } from '@Utils/FormatDate'
import validator from '@Utils/Validator'
import { useGetPaymentplanQuery, useGetPaymentplantransactionsQuery } from '@Api/Paymentplan'
import { useGetVisitsQuery } from '@Api/Visit'
import { useGetPaymenttypeQuery } from '@Api/Paymenttype'
import FormButton from '@Components/Common/FormButton'
import PaymentplantransactionApproveModal from '@Components/Paymentplantransaction/PaymentplantransactionApproveModal'
import { PaymentplanTransactionItem } from '@Api/Paymentplan/type'

const PaymentplanDetail: React.FC = () => {
  const { t } = useTranslation()
  const { Id } = useParams()
  const navigate = useNavigate()
  const [record, setRecord] = useState<PaymentplanTransactionItem | null>(null)
  const [open, setOpen] = useState(false)

  const { data: plan, isFetching: isPlanFetching } = useGetPaymentplanQuery({ Uuid: Id ?? '' }, { skip: !validator.isUUID(Id) })
  const { data: transactions, isFetching: isTransactionsFetching } = useGetPaymentplantransactionsQuery({ PaymentplanID: Id ?? '' }, { skip: !validator.isUUID(Id) })
  const { data: visits } = useGetVisitsQuery({ isActive: 1 })
  const { data: paymenttype } = useGetPaymenttypeQuery({ Uuid: plan?.PaymenttypeID ?? '' }, { skip: !validator.isUUID(plan?.PaymenttypeID) })

  const visit = useMemo(() => (visits || []).find(v => v.Uuid === plan?.VisitID), [visits, plan?.VisitID])

  const paid = useMemo(() => (transactions || []).filter(t => t.Status).reduce((sum, t) => sum + t.Amount, 0), [transactions])
  const total = plan?.Totalamount ?? 0
  const percent = total > 0 ? (paid / total) * 100 : 0

  const handleOpenPayment = (item: PaymentplanTransactionItem) => {
    setRecord(item)
    setOpen(true)
  }

  return (
    <Pagewrapper isLoading={isPlanFetching || isTransactionsFetching} direction='vertical' gap={4} alignTop>
      <Title
        PageName={t('Pages.Paymentplans.Page.Header')}
        PageUrl="/Paymentplans"
        AdditionalName={visit?.Visitcode}
      />

      <LoadingWrapper loading={isPlanFetching}>
        <Card fluid className="!rounded-2xl !shadow-md !p-4 !border-0 bg-white">
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-bold text-gray-800">
              <Icon name="money bill alternate" className="text-primary" /> {t('Pages.Paymentplans.Label.Details')}
            </div>
            <Icon name="sign-out alternate" className="text-primary cursor-pointer" size="big" onClick={() => navigate(-1)} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <VisitDetailLabel
              icon="barcode"
              label={t('Pages.Paymentplans.Columns.VisitID')}
              value={visit?.Visitcode ?? '-'}
            />
            <VisitDetailLabel
              icon="money bill alternate"
              label={t('Pages.Paymentplans.Columns.Totalamount')}
              value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(plan?.Totalamount ?? 0)}
            />
            <VisitDetailLabel
              icon="money"
              label={t('Pages.Paymentplans.Columns.Prepaymentamount')}
              value={new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(plan?.Prepaymentamount ?? 0)}
            />
            <VisitDetailLabel
              icon="credit card"
              label={t('Pages.Paymentplans.Columns.PaymenttypeID')}
              value={paymenttype?.Name ?? '-'}
            />
            <VisitDetailLabel
              icon="calendar alternate"
              label={t('Pages.Paymentplans.Columns.Startdate')}
              value={FormatDate(plan?.Startdate)}
            />
            <VisitDetailLabel
              icon="calendar check"
              label={t('Pages.Paymentplans.Columns.Enddate')}
              value={FormatDate(plan?.Enddate)}
            />
          </div>

          <div className="mt-6">
            <div className="text-sm text-gray-600">
              {t('Pages.Paymentplans.Label.Paid')}: {paid.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })} / {total.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}
            </div>
            <Progress percent={percent} color='blue' indicating size='tiny' />
          </div>
        </Card>

        <Card fluid className="!rounded-2xl !shadow-md !p-4 !border-0 bg-white mt-6">
          <div className="text-xl font-bold text-gray-800 mb-3">
            <Icon name="list alternate" className="text-primary" /> {t('Pages.Paymentplans.Label.Installments')}
          </div>

          {!transactions?.length ? (
            <Message info>
              <Message.Header>{t('Common.NoDataFound')}</Message.Header>
              <p>{t('Pages.Paymentplans.Messages.NoTransactions')}</p>
            </Message>
          ) : (
            <div className="flex flex-col divide-y">
              {(transactions || []).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div>
                    <div className="font-semibold text-gray-800">{FormatDate(item.Paymentdate)}</div>
                    <div className="text-gray-500">
                      {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(item.Amount)}
                    </div>
                  </div>
                  <div>
                    {item.Status ? (
                      <span className="text-primary font-bold">{t('Common.Paid')}</span>
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
          )}
        </Card>
      </LoadingWrapper>
      <PaymentplantransactionApproveModal
        open={open}
        setOpen={setOpen}
        setData={setRecord}
        data={record}
      />
    </Pagewrapper>
  )
}

export default PaymentplanDetail
