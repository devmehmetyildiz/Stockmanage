import React, { useCallback, useMemo } from 'react'
import { motion } from 'framer-motion';
import { Button, Card, Icon, Label } from 'semantic-ui-react';
import { FormatDate } from '@Utils/FormatDate';
import { useTranslation } from 'react-i18next';
import LoadingWrapper from '@Components/Common/LoadingWrapper';
import { useGetWarehouseQuery } from '@Api/Warehouse';
import { useGetDoctordefineQuery } from '@Api/Doctordefine';
import { useGetLocationQuery } from '@Api/Location';
import validator from '@Utils/Validator';
import { VisitItem } from '@Api/Visit/type';
import {
    VISIT_STATU_CLOSED,
    VISIT_STATU_COMPLETED,
    VISIT_STATU_ON_APPROVE,
    VISIT_STATU_PLANNED,
    VISIT_STATU_WORKING,
} from '@Constant/index';
import { useGetUsersListQuery } from '@Api/User';
import Pushnotification from '@Utils/Pushnotification';
import { useGetPaymenttypeQuery } from '@Api/Paymenttype';
import { useNavigate } from 'react-router-dom';
import Paths from '@Constant/path';
import VisitDetailLabel from '@Components/Visit/VisitDetail/VisitDetailLabel';

interface FreeVisitDetailMetaProps {
    data: VisitItem | undefined
    disableButtons?: boolean
}

const FreeVisitDetailMeta: React.FC<FreeVisitDetailMetaProps> = (props) => {

    const { data, disableButtons } = props
    const { t } = useTranslation()
    const navigate = useNavigate()

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 });
    const { data: doctordefine, isFetching: isDoctordefinesFetching } = useGetDoctordefineQuery({ Uuid: data?.DoctorID ?? '' }, { skip: !validator.isUUID(data?.DoctorID) });
    const { data: location, isFetching: isLocationsFetching } = useGetLocationQuery({ Uuid: data?.LocationID ?? '' }, { skip: !validator.isUUID(data?.LocationID) });

    const handleCopyCode = useCallback(() => {
        if (!data?.Visitcode) return;
        navigator.clipboard?.writeText?.(String(data.Visitcode));
        Pushnotification({
            Type: 'Success',
            Subject: t('Pages.Visits.Page.Header'),
            Description: `${t('Common.Copied')} : ${String(data.Visitcode)}`,
        });
    }, [data?.Visitcode, t]);

    const responsibleUserID = useMemo(() => {
        return (users || []).find((u) => u.Uuid === data?.ResponsibleUserID)
    }, [users, data?.ResponsibleUserID]);

    const workerUserID = useMemo(() => {
        return (users || []).find((u) => u.Uuid === data?.WorkerUserID)
    }, [users, data?.WorkerUserID]);


    const visitStatus = useMemo(
        () => [
            { text: t('Option.VisitStatu.Planned'), value: VISIT_STATU_PLANNED, color: 'grey' },
            { text: t('Option.VisitStatu.Working'), value: VISIT_STATU_WORKING, color: 'blue' },
            { text: t('Option.VisitStatu.Onapprove'), value: VISIT_STATU_ON_APPROVE, color: 'orange' },
            { text: t('Option.VisitStatu.Completed'), value: VISIT_STATU_COMPLETED, color: 'green' },
            { text: t('Option.VisitStatu.Closed'), value: VISIT_STATU_CLOSED, color: 'grey' },
        ],
        [t]
    );

    const currentStatus = useMemo(() => {
        return visitStatus.find((u) => u.value === data?.Status)
    }, [visitStatus, data?.Status]);

    return <LoadingWrapper loading={isDoctordefinesFetching || isLocationsFetching || isUsersFetching}>
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="w-full"
        >
            <Card fluid className="!rounded-2xl !shadow-lg !border-0 !bg-white mb-6 !p-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                            <Icon name="calendar alternate" className="text-primary" size="large" />
                            {`${data?.Visitcode || '-'}`}
                            <Button
                                icon="copy"
                                size="mini"
                                basic
                                className="!ml-2"
                                onClick={handleCopyCode}
                                title={t('Common.Button.Copy') as string}
                            />
                        </h2>

                        <div className="flex items-center gap-3">
                            <span className="text-gray-600">
                                {FormatDate(data?.Visitdate) || t('Common.NoDataFound')}
                            </span>
                            {currentStatus && (
                                <Label
                                    size="large"
                                    color={currentStatus.color as any}
                                    className="!text-white !rounded-md"
                                    content={`${t('Pages.Visits.Label.Statu')}: ${currentStatus.text}`}
                                />
                            )}
                        </div>

                        {data?.Notes ? (
                            <div className="text-gray-800 mt-2">{data.Notes}</div>
                        ) : (
                            <div className="text-gray-400 mt-2">{t('Pages.Visits.Messages.NoNotesFound')}</div>
                        )}
                    </div>

                    <div className='flex flex-col gap-4'>
                        {!disableButtons ?
                            <div className='w-full  flex justify-end items-center cursor-pointer' title={t('Common.Button.Goback')} onClick={() => navigate(Paths.FreeVisits)}>
                                <Icon name='sign-out alternate' className='!text-primary' size='big' />
                            </div>
                            : null}
                        <div className="flex flex-col sm:flex-row md:flex-col gap-3 md:gap-2 text-sm text-gray-700 ml-auto bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                            <VisitDetailLabel
                                icon="industry"
                                label={t('Pages.Visits.Columns.Visitdate')}
                                value={FormatDate(data?.Visitdate)}
                                isGray
                            />
                            <VisitDetailLabel
                                icon="tag"
                                label={t('Pages.Visits.Columns.Visitstartdate')}
                                value={data?.Visitstartdate ? FormatDate(data?.Visitstartdate) : ' - '}
                                isGray
                            />
                            <VisitDetailLabel
                                icon="boxes"
                                label={t('Pages.Visits.Columns.Visitenddate')}
                                value={data?.Visitenddate ? FormatDate(data?.Visitenddate) : ' - '}
                                isGray
                            />
                        </div>

                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-sm text-gray-700">
                    <VisitDetailLabel
                        icon="user"
                        label={t('Pages.Visits.Columns.ResponsibleUserID')}
                        value={responsibleUserID ? `${responsibleUserID.Name} ${responsibleUserID.Surname}` : t('Common.NoDataFound')}
                    />
                    <VisitDetailLabel
                        icon="user"
                        label={t('Pages.Visits.Columns.WorkerUserID')}
                        value={workerUserID ? `${workerUserID.Name} ${workerUserID.Surname}` : t('Common.NoDataFound')}
                    />
                    <VisitDetailLabel
                        icon="user md"
                        label={t('Pages.Visits.Columns.DoctorID')}
                        value={doctordefine?.Name ?? t('Common.NoDataFound')}
                    />
                    <VisitDetailLabel
                        icon="map marker alternate"
                        label={t('Pages.Visits.Columns.LocationID')}
                        value={location?.Name ?? t('Common.NoDataFound')}
                    />
                    <VisitDetailLabel
                        icon="facebook messenger"
                        label={t('Pages.Visits.Columns.Description')}
                        value={data?.Description ?? '-'}
                    />
                </div>
            </Card>
        </motion.div>
    </LoadingWrapper>
}
export default FreeVisitDetailMeta