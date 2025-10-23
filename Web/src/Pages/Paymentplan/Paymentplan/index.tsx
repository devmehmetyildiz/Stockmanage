import { useGetPaymentplansCountQuery } from '@Api/Paymentplan'
import AppTab from '@Components/Common/AppTab'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import PaymentplanFull from '@Components/Paymentplan/Paymentplan/PaymentplanFull'
import PaymentplanNone from '@Components/Paymentplan/Paymentplan/PaymentplanNone'
import PaymentplanSemi from '@Components/Paymentplan/Paymentplan/PaymentplanSemi'
import { VISIT_PAYMENT_STATUS_FULL, VISIT_PAYMENT_STATUS_NON, VISIT_PAYMENT_STATUS_SEMI } from '@Constant/index'
import Paths from '@Constant/path'
import RouteKeys from '@Constant/routeKeys'
import { ExcelProvider } from '@Context/ExcelContext'
import useTabNavigation from '@Hooks/useTabNavigation'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Paymentplan: React.FC = () => {

    const { t } = useTranslation()

    const { data: noneCount, isFetching: isNoneFetching } = useGetPaymentplansCountQuery({ Status: VISIT_PAYMENT_STATUS_NON, isActive: 1 })
    const { data: semiCount, isFetching: isSemiFetching } = useGetPaymentplansCountQuery({ Status: VISIT_PAYMENT_STATUS_SEMI, isActive: 1 })
    const { data: fullCount, isFetching: isFullFetching } = useGetPaymentplansCountQuery({ Status: VISIT_PAYMENT_STATUS_FULL, isActive: 1 })

    const { activeTab, setActiveTab } = useTabNavigation({
        mainRoute: RouteKeys.Paymentplans,
        tabOrder: ['none', 'semi', 'full'],
    })

    return <Pagewrapper isLoading={isNoneFetching || isSemiFetching || isFullFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Paymentplans.Page.Header')}
                PageUrl={Paths.Paymentplans}
                excelExportName={t('Pages.Paymentplans.Page.Header')}
            />
            <AppTab
                onTabChange={(_, { activeIndex }) => {
                    setActiveTab(Number(activeIndex))
                }}
                activeIndex={activeTab}
                panes={[
                    {
                        menuItem: `${t('Pages.Paymentplans.Tab.None')} (${noneCount ?? 0})`,
                        render: () => <PaymentplanNone />,
                    },
                    {
                        menuItem: `${t('Pages.Paymentplans.Tab.Semi')} (${semiCount ?? 0})`,
                        render: () => <PaymentplanSemi />,
                    },
                    {
                        menuItem: `${t('Pages.Paymentplans.Tab.Full')} (${fullCount ?? 0})`,
                        render: () => <PaymentplanFull />,
                    },
                ]}
            />
        </ExcelProvider>
    </Pagewrapper>
}
export default Paymentplan