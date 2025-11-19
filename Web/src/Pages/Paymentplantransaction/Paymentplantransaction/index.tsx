import { useGetPaymentplantransactionCountsQuery } from '@Api/Paymentplan'
import AppTab from '@Components/Common/AppTab'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import PaymentplantransactionDone from '@Components/Paymentplantransaction/PaymentplantransactionDone'
import PaymentplantransactionWaiting from '@Components/Paymentplantransaction/PaymentplantransactionWaiting'
import Paths from '@Constant/path'
import RouteKeys from '@Constant/routeKeys'
import { ExcelProvider } from '@Context/ExcelContext'
import useTabNavigation from '@Hooks/useTabNavigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Paymentplantransaction: React.FC = () => {

    const { t } = useTranslation()

    const { data: waitingCount, isFetching: isWaitingFetching } = useGetPaymentplantransactionCountsQuery({ Status: 0, isActive: 1 })
    const { data: doneCount, isFetching: isDoneFetching } = useGetPaymentplantransactionCountsQuery({ Status: 1, isActive: 1 })

    const { activeTab, setActiveTab } = useTabNavigation({
        mainRoute: RouteKeys.Paymentplantransactions,
        tabOrder: ['waiting', 'done'],
    })

    return <Pagewrapper isLoading={isWaitingFetching || isDoneFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Paymentplantransactions.Page.Header')}
                PageUrl={Paths.Paymentplantransactions}
                excelExportName={t('Pages.Paymentplantransactions.Page.Header')}
            />
            <AppTab
                onTabChange={(_, { activeIndex }) => {
                    setActiveTab(Number(activeIndex))
                }}
                activeIndex={activeTab}
                panes={[
                    {
                        menuItem: `${t('Pages.Paymentplantransactions.Tab.Waiting')} (${waitingCount ?? 0})`,
                        render: () => <PaymentplantransactionWaiting />,
                    },
                    {
                        menuItem: `${t('Pages.Paymentplantransactions.Tab.Done')} (${doneCount ?? 0})`,
                        render: () => <PaymentplantransactionDone />,
                    },
                ]}
            />
        </ExcelProvider>
    </Pagewrapper>
}
export default Paymentplantransaction