import { CashflowListRequest } from '@Api/Cashflow/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useState, } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Divider, Form, Header, Icon } from 'semantic-ui-react'

interface CashflowListFilterProps {
    reqBody: CashflowListRequest
    setReqBody: React.Dispatch<React.SetStateAction<CashflowListRequest>>
}

const AppForm = createAppForm<CashflowListRequest>()

const CashflowListFilter: React.FC<CashflowListFilterProps> = ({ reqBody, setReqBody }) => {

    const { t } = useTranslation()
    const [isExpended, setIsExpended] = useState(false)

    const { watch, trigger, getValues, formState } = useFormContext<CashflowListRequest>()

    const [CurrentOrderStartDate, CurrentOrderEndDate] = watch(['startDate', 'endDate'])

    const isQuerySame = reqBody?.startDate === CurrentOrderStartDate && reqBody?.endDate === CurrentOrderEndDate

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                setIsExpended(false)
                const values = getValues()
                setReqBody(values)
            } else {
                CheckForm(formState, t('Pages.Cashflows.Page.Header'))
            }
        })
    }

    const title = [
        t('Pages.Cashflows.Label.FilterTitle'),
        CurrentOrderStartDate && `${t('Pages.Cashflows.Label.startDate')} - ${new Date(CurrentOrderStartDate).toLocaleDateString('tr')}`,
        CurrentOrderEndDate && `${t('Pages.Cashflows.Label.endDate')} - ${new Date(CurrentOrderEndDate).toLocaleDateString('tr')}`,
    ].filter(u => u).join(' | ')

    return <Contentwrapper bottomRounded>
        <div
            className={`
                        w-full flex justify-between items-center p-5 cursor-pointer transition-colors
                        ${isExpended ? 'bg-slate-50' : 'bg-white hover:bg-slate-50/50'}
                    `}
            onClick={() => setIsExpended(prev => !prev)}
        >
            <div className="flex items-center gap-3">
                <div className={`
                            p-2 rounded-lg transition-all duration-300
                            ${isExpended ? 'bg-primary text-white rotate-180' : 'bg-slate-100 text-slate-500'}
                        `}>
                    <Icon name='chevron down' className="!m-0" />
                </div>
                <Header as={'h4'} className="!m-0 text-slate-700">
                    {title}
                </Header>
            </div>
        </div>

        <AnimatePresence>
            {isExpended && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                >
                    <div className="px-6 pb-6">
                        <Divider className="!mt-0 !mb-6" />
                        <Form>
                            <Form.Group widths={'equal'}>
                                <AppForm.Input name='startDate' label={t('Pages.Cashflows.Label.startDate')} type='date' required={t('Common.StartDateRequired')} />
                                <AppForm.Input name='endDate' label={t('Pages.Cashflows.Label.endDate')} type='date' required={t('Common.EndDateRequired')} />
                            </Form.Group>
                            <div className="flex justify-end mt-4">
                                <FormButton
                                    disabled={isQuerySame}
                                    text={t('Pages.Cashflows.Label.FetchList')}
                                    onClick={() => submit()}
                                />
                            </div>
                        </Form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </Contentwrapper>
}
export default CashflowListFilter