import { VisitListRequest } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import { VISIT_STATU_CLOSED, VISIT_STATU_COMPLETED, VISIT_STATU_ON_APPROVE, VISIT_STATU_PLANNED, VISIT_STATU_WORKING } from '@Constant/index'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import validator from '@Utils/Validator'
import { AnimatePresence, motion } from 'framer-motion'
import React, { useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Divider, DropdownItemProps, Form, Header, Icon } from 'semantic-ui-react'

interface FreeVisitCommonListFilterProps {
    reqBody: VisitListRequest | null
    setReqBody: React.Dispatch<React.SetStateAction<VisitListRequest | null>>
    pageTitle: string
    filterOptions?: boolean
}

const TranslationorderAppForm = createAppForm<VisitListRequest>()

const FreeVisitCommonListFilter: React.FC<FreeVisitCommonListFilterProps> = ({ reqBody, setReqBody, pageTitle, filterOptions }) => {
    const { t } = useTranslation()
    const [isExpended, setIsExpended] = useState(false)
    const { watch, trigger, getValues, formState } = useFormContext<VisitListRequest>()

    const [CurrentOrderStartDate, CurrentOrderEndDate, CurrentStatus] = watch(['Visitstartdate', 'Visitenddate', 'Status'])
    const isQuerySame = reqBody?.Visitstartdate === CurrentOrderStartDate && reqBody?.Visitenddate === CurrentOrderEndDate && reqBody?.Status === CurrentStatus

    const requestStatusOptions: DropdownItemProps[] = useMemo(() => filterOptions ? [
        { text: t('Option.VisitStatu.Planned'), value: VISIT_STATU_PLANNED },
        { text: t('Option.VisitStatu.Working'), value: VISIT_STATU_WORKING },
        { text: t('Option.VisitStatu.Completed'), value: VISIT_STATU_COMPLETED },
    ] : [
        { text: t('Option.VisitStatu.Planned'), value: VISIT_STATU_PLANNED },
        { text: t('Option.VisitStatu.Working'), value: VISIT_STATU_WORKING },
        { text: t('Option.VisitStatu.Onapprove'), value: VISIT_STATU_ON_APPROVE },
        { text: t('Option.VisitStatu.Completed'), value: VISIT_STATU_COMPLETED },
        { text: t('Option.VisitStatu.Closed'), value: VISIT_STATU_CLOSED },
    ]
        , [t, filterOptions])

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                setReqBody(getValues())
                setIsExpended(false)
            } else {
                CheckForm(formState, pageTitle)
            }
        })
    }

    const title = [
        t('Pages.Visits.Label.FilterTitle'),
        CurrentOrderStartDate && `${t('Pages.Visits.Label.OrderStartDate')} - ${new Date(CurrentOrderStartDate).toLocaleDateString('tr')}`,
        CurrentOrderEndDate && `${t('Pages.Visits.Label.OrderEndDate')} - ${new Date(CurrentOrderEndDate).toLocaleDateString('tr')}`,
        validator.isNumber(CurrentStatus) && `${t('Pages.Visits.Label.Status')} - ${requestStatusOptions.find(u => u.value === CurrentStatus)?.text}`
    ].filter(u => u).join(' | ')

    return (
        <Contentwrapper bottomRounded >
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
                                    <TranslationorderAppForm.Select name='Status' label={t('Pages.Visits.Label.Status')} options={requestStatusOptions} />
                                </Form.Group>
                                <Form.Group widths={'equal'}>
                                    <TranslationorderAppForm.Input name='Visitstartdate' label={t('Pages.Visits.Label.OrderStartDate')} type='date' />
                                    <TranslationorderAppForm.Input name='Visitenddate' label={t('Pages.Visits.Label.OrderEndDate')} type='date' />
                                </Form.Group>
                                <div className="flex justify-end mt-4">
                                    <FormButton
                                        disabled={isQuerySame}
                                        text={t('Pages.Visits.Label.FetchList')}
                                        onClick={() => submit()}
                                    />
                                </div>
                            </Form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </Contentwrapper>
    )
}
export default FreeVisitCommonListFilter