import React, { useEffect, useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import { useTranslation } from 'react-i18next'
import { ExcelProvider } from '@Context/ExcelContext'
import useTabNavigation from '@Hooks/useTabNavigation'
import RouteKeys from '@Constant/routeKeys'
import { useNavigate } from 'react-router-dom'
import AppTab from '@Components/Common/AppTab'
import { useGetApprovalrequestCountsQuery } from '@Api/Approvalrequests'
import { ApprovalrequestItem } from '@Api/Approvalrequests/type'
import ApprovalrequestsWaitingApprove from '@Components/Approvalrequests/Approvalrequests/ApprovalrequestsWaitingApprove'
import ApprovalrequestsApproved from '@Components/Approvalrequests/Approvalrequests/ApprovalrequestsApproved'
import ApprovalrequestsRejected from '@Components/Approvalrequests/Approvalrequests/ApprovalrequestsRejected'
import ApprovalrequestsApproveModal from '@Components/Approvalrequests/ApprovalrequestsApproveModal'
import ApprovalrequestsRejectedModal from '@Components/Approvalrequests/ApprovalrequestsRejectedModal'

const Approvalrequest: React.FC = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const [approveOpen, setApproveOpen] = useState(false)
    const [rejectOpen, setRejectOpen] = useState(false)
    const [records, setRecords] = useState<ApprovalrequestItem[]>([])
    const [multiProcessOpen, setMultiProcessOpen] = useState(false)

    const { data: ApprovedCount, isFetching: isApproveCountFetching } = useGetApprovalrequestCountsQuery({ isActive: 1, Isapproved: 1, Isrejected: 0 })
    const { data: CreatedCount, isFetching: isCreatedCountFetching } = useGetApprovalrequestCountsQuery({ isActive: 1, Isapproved: 0, Isrejected: 0 })
    const { data: RejectedCount, isFetching: isRejectedCountFetching } = useGetApprovalrequestCountsQuery({ isActive: 1, Isapproved: 0, Isrejected: 1 })

    const { activeTab, setActiveTab } = useTabNavigation({
        mainRoute: RouteKeys.Approvalrequests,
        navigate,
        tabOrder: ['waitingapprove', 'approved', 'rejected'],
    })

    useEffect(() => {
        setRecords([])
    }, [activeTab, multiProcessOpen])

    useEffect(() => {
        setMultiProcessOpen(false)
    }, [activeTab])

    return <Pagewrapper isLoading={isApproveCountFetching || isCreatedCountFetching || isRejectedCountFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Approvalrequests.Page.Header')}
                PageUrl={Paths.Approvalrequests}
                excelExportName={t('Pages.Approvalrequests.Page.Header')}
                additionalButtons={multiProcessOpen ? [
                    {
                        name: t('Pages.Approvalrequests.Label.ApproveSelected'),
                        onClick: () => setApproveOpen(true),
                        disabled: records.length <= 0,
                        hidden: activeTab !== 0,
                        disabledCouseText: t('Pages.Approvalrequests.Messages.Approvelistnotfound')
                    },
                    {
                        name: t('Pages.Approvalrequests.Label.RejectSelected'),
                        onClick: () => setRejectOpen(true),
                        disabled: records.length <= 0,
                        hidden: activeTab !== 0,
                        disabledCouseText: t('Pages.Approvalrequests.Messages.Approvelistnotfound')
                    },
                    {
                        name: t('Common.Button.Singleselect'),
                        onClick: () => setMultiProcessOpen(false),
                        secondary: true,
                        hidden: !(activeTab === 0),
                    }
                ] : [
                    {
                        name: t('Common.Button.Multiselect'),
                        onClick: () => setMultiProcessOpen(true),
                        hidden:  !(activeTab === 0),
                    }
                ]}
            />
            <AppTab
                onTabChange={(_, { activeIndex }) => {
                    setActiveTab(Number(activeIndex))
                }}
                activeIndex={activeTab}
                panes={[
                    {
                        menuItem: `${t('Pages.Approvalrequests.Tab.WaitingApprove')} (${CreatedCount ?? 0})`,
                        render: () => <ApprovalrequestsWaitingApprove
                            records={records}
                            setRecords={setRecords}
                            setApproveOpen={setApproveOpen}
                            setRejectOpen={setRejectOpen}
                            multiProcessOpen={multiProcessOpen}
                        />,
                    },
                    {
                        menuItem: `${t('Pages.Approvalrequests.Tab.Approved')} (${ApprovedCount ?? 0})`,
                        render: () => <ApprovalrequestsApproved
                        />,
                    },
                    {
                        menuItem: `${t('Pages.Approvalrequests.Tab.Rejected')} (${RejectedCount ?? 0})`,
                        render: () => <ApprovalrequestsRejected
                        />,
                    },
                ]}
            />
        </ExcelProvider>
        <ApprovalrequestsApproveModal
            open={approveOpen}
            setOpen={setApproveOpen}
            selectedRecords={records}
            setSelectedRecords={setRecords}
        />
        <ApprovalrequestsRejectedModal
            open={rejectOpen}
            setOpen={setRejectOpen}
            selectedRecords={records}
            setSelectedRecords={setRecords}
        />
    </Pagewrapper>
}
export default Approvalrequest