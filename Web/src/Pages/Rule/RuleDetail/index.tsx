import { useClearRuleLogMutation, useGetRuleLogQuery, useGetRuleQuery } from '@Api/Rule'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import { ExcelProvider } from '@Context/ExcelContext'
import { FormatFullDate } from '@Utils/FormatDate'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { Confirm, Label, Table } from 'semantic-ui-react'

const RuleDetail: React.FC = () => {

    const { t } = useTranslation()

    const { Id } = useParams()
    const navigate = useNavigate()
    const [clearOpen, setClearOpen] = useState(false)
    const [openedRows, setOpenedRows] = useState<string[]>([])
    const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null)

    const [ClearRule] = useClearRuleLogMutation()

    const { data, isFetching, refetch, isSuccess, isError } = useGetRuleLogQuery({ Uuid: Id ?? '' }, { skip: !validator.isUUID(Id), refetchOnMountOrArgChange: true })
    const { data: ruleData, isFetching: isRuleDataFetching, } = useGetRuleQuery({ Uuid: Id ?? '' }, { skip: !validator.isUUID(Id), refetchOnMountOrArgChange: true })

    const refetchQuery = () => {
        if ((isSuccess || isError) && refetch) {
            refetch()
        }
    }

    const clearRule = () => {
        if (ruleData && validator.isUUID(ruleData?.Uuid)) {
            ClearRule({
                Uuid: ruleData.Uuid
            })
                .unwrap()
                .then(() => {
                    setClearOpen(false)
                    Pushnotification({
                        Type: 'Success',
                        Subject: t('Pages.Rules.Page.Header'),
                        Description: t('Pages.Rules.Messages.ClearSuccess')
                    })
                })
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Rules.Page.Header'),
                Description: t('Pages.Rules.Messages.RuleIdNotFound')
            })
        }
    }

    useEffect(() => {
        if (isSuccess && !isFetching) {
            setLastFetchTime(new Date())
        }
    }, [isSuccess, isFetching])

    return <Pagewrapper isLoading={isFetching || isRuleDataFetching} direction='vertical' gap={4} alignTop>
        <ExcelProvider>
            <Title
                PageName={t('Pages.Rules.Page.Header')}
                PageUrl={Paths.Rules}
                AdditionalName={ruleData?.Name}
                isAdditionalNameString
                additionalButtons={[
                    {
                        onClick: () => navigate(Paths.Rules),
                        name: t('Common.Button.Goback')
                    },
                    {
                        onClick: () => refetchQuery(),
                        name: t('Common.Button.Refresh')
                    },
                    {
                        onClick: () => setClearOpen(true),
                        name: t('Common.Button.Clear')
                    },
                    {
                        onClick: () => navigate(`/Rules/${Id}/edit`),
                        name: t('Common.Button.Update')
                    },
                ]}
            />
            {validator.isISODate(lastFetchTime)
                ? <Label>{t('Pages.Rules.Columns.LastFetchTime')}:{FormatFullDate(lastFetchTime)}</Label>
                : null
            }
            <Table>
                <Table.Header>
                    <Table.HeaderCell width={1}>{t('Pages.Rules.Columns.Date')}</Table.HeaderCell>
                    <Table.HeaderCell>{t('Pages.Rules.Columns.Log')}</Table.HeaderCell>
                </Table.Header>
                <Table.Body>
                    {(data || []).map(item => {
                        const MAX_LOG_LEN = 150
                        const log = (item.Log || '')
                        const logLen = log.length
                        const shouldShowPopup = logLen > MAX_LOG_LEN
                        const isExpended = openedRows.includes(item.Uuid)

                        return <Table.Row key={item.Uuid}>
                            <Table.Cell>
                                {FormatFullDate(item.Date)}
                            </Table.Cell>
                            <Table.Cell>
                                {shouldShowPopup ?
                                    <div className='cursor-pointer transition-all ease-in-out duration-300' onDoubleClick={() =>
                                        setOpenedRows(prev =>
                                            isExpended
                                                ? [...prev.filter(u => u !== item.Uuid)]
                                                : [...prev, item.Uuid])
                                    }>
                                        <div className='transition-all ease-in-out duration-300'> {isExpended
                                            ? log
                                            : `${log.substring(0, MAX_LOG_LEN)}...`
                                        }</div>
                                    </div>
                                    : <div>{log}</div>
                                }
                            </Table.Cell>
                        </Table.Row>
                    })}
                </Table.Body>
            </Table>
        </ExcelProvider>
        <Confirm
            open={clearOpen}
            onCancel={() => setClearOpen(false)}
            onConfirm={() => clearRule()}
            content={`${ruleData?.Name} ${t('Pages.Rules.Stop.Label.ClearCheck')}`}
            cancelButton={t('Common.Button.Giveup')}
            confirmButton={t('Common.Button.Clear')}
        />
    </Pagewrapper >
}
export default RuleDetail