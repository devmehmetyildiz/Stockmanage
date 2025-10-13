import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, Icon, Label, Message, Popup, Button } from 'semantic-ui-react';

import Pagewrapper from '@Components/Common/Pagewrapper';
import Title from '@Components/Common/Title';
import Contentwrapper from '@Components/Common/Contentwrapper';
import VisitDetailLabel from '@Components/Visit/VisitDetail/VisitDetailLabel';

import Paths from '@Constant/path';
import Pushnotification from '@Utils/Pushnotification';
import validator from '@Utils/Validator';
import { FormatDate } from '@Utils/FormatDate';

import { useLazyGetVisitQuery } from '@Api/Visit';
import { useGetUsersListQuery } from '@Api/User';
import { useGetStockdefinesQuery } from '@Api/Stockdefine';
import { useGetWarehouseQuery } from '@Api/Warehouse';
import { useGetDoctordefineQuery } from '@Api/Doctordefine';
import { useGetLocationQuery } from '@Api/Location';
import { useGetPaymenttypeQuery } from '@Api/Paymenttype';
import { useGetStocksQuery } from '@Api/Stock';

import {
    VISIT_STATU_COMPLETED,
    VISIT_STATU_DECLINED,
    VISIT_STATU_ON_APPROVE,
    VISIT_STATU_PLANNED,
    VISIT_STATU_WORKING,
} from '@Constant/index';

const VisitDetail: React.FC = () => {
    const { Id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [GetVisit, { isFetching, data, isError }] = useLazyGetVisitQuery();

    const { data: users, isFetching: isUsersFetching } = useGetUsersListQuery({ isActive: 1 });

    const { data: stockdefines, isFetching: isStockdefinesFetching } = useGetStockdefinesQuery({ isActive: 1 }, { skip: !validator.isUUID(data?.Uuid) });
    const { data: warehouse, isFetching: isWarehouseFetching } = useGetWarehouseQuery({ Uuid: data?.WarehouseID ?? '' }, { skip: !validator.isUUID(data?.WarehouseID) });
    const { data: doctordefine, isFetching: isDoctordefinesFetching } = useGetDoctordefineQuery({ Uuid: data?.DoctorID ?? '' }, { skip: !validator.isUUID(data?.DoctorID) });
    const { data: location, isFetching: isLocationsFetching } = useGetLocationQuery({ Uuid: data?.LocationID ?? '' }, { skip: !validator.isUUID(data?.LocationID) });
    const { data: paymenttype, isFetching: isPaymenttypesFetching } = useGetPaymenttypeQuery({ Uuid: data?.PaymenttypeID ?? '' }, { skip: !validator.isUUID(data?.PaymenttypeID) });

    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1 }, { skip: !validator.isUUID(data?.Uuid) });

    const user = useMemo(() => {
        return (users || []).find((u) => u.Uuid === data?.UserID)
    }, [users, data?.UserID]);

    const visitStatus = useMemo(
        () => [
            { text: t('Option.VisitStatu.Planned'), value: VISIT_STATU_PLANNED, color: 'grey' },
            { text: t('Option.VisitStatu.Working'), value: VISIT_STATU_WORKING, color: 'blue' },
            { text: t('Option.VisitStatu.Onapprove'), value: VISIT_STATU_ON_APPROVE, color: 'orange' },
            { text: t('Option.VisitStatu.Completed'), value: VISIT_STATU_COMPLETED, color: 'green' },
            { text: t('Option.VisitStatu.Declined'), value: VISIT_STATU_DECLINED, color: 'red' },
        ],
        [t]
    );

    const currentStatus = useMemo(() => {
        return visitStatus.find((u) => u.value === data?.Status)
    }, [visitStatus, data?.Status]);

    const isLoadingAny =
        isFetching ||
        isUsersFetching ||
        isStocksFetching ||
        isStockdefinesFetching ||
        isWarehouseFetching ||
        isDoctordefinesFetching ||
        isLocationsFetching ||
        isPaymenttypesFetching;

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetVisit({ Uuid: Id })
                .unwrap()
                .catch(() => {
                    navigate(Paths.Visits);
                });
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Visits.Page.Header'),
                Description: t('Pages.Visits.Messages.UndefinedVisit'),
            });
            navigate(Paths.Visits);
        }
    }, [Id, GetVisit, navigate, t]);

    const handleCopyCode = useCallback(() => {
        if (!data?.Visitcode) return;
        navigator.clipboard?.writeText?.(String(data.Visitcode));
        Pushnotification({
            Type: 'Success',
            Subject: t('Pages.Visits.Page.Header'),
            Description: `${t('Common.Copied')} : ${String(data.Visitcode)}`,
        });
    }, [data?.Visitcode, t]);

    const productRows = useMemo(() => {
        const products = data?.Products || [];
        return Array.isArray(products) ? products : [];
    }, [data]);

    const hasProducts = productRows.length > 0;

    const scheduledPayment = data?.Scheduledpayment ?? 0;

    return (
        <Pagewrapper
            isLoading={isLoadingAny}
            direction="vertical"
            gap={4}
            alignTop
            className="!pb-10"
        >
            <Title
                PageName={t('Pages.Visits.Page.Header')}
                PageUrl={Paths.Visits}
                AdditionalName={data?.Visitcode}
            />
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

                    {/* meta grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-sm text-gray-700">
                        <VisitDetailLabel
                            icon="user"
                            label={t('Pages.Visits.Columns.UserID')}
                            value={user ? `${user.Name} ${user.Surname}` : t('Common.NoDataFound')}
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
                            icon="warehouse"
                            label={t('Pages.Visits.Columns.WarehouseID')}
                            value={warehouse?.Name ?? t('Common.NoDataFound')}
                        />
                        <VisitDetailLabel
                            icon="money bill alternate"
                            label={t('Pages.Visits.Columns.PaymenttypeID')}
                            value={paymenttype?.Name ?? t('Common.NoDataFound')}
                        />
                        <VisitDetailLabel
                            icon="credit card"
                            label={t('Pages.Visits.Columns.Scheduledpayment')}
                            value={
                                typeof scheduledPayment === 'number'
                                    ? new Intl.NumberFormat(undefined, {
                                        style: 'currency',
                                        currency: 'TRY',
                                        currencyDisplay: 'narrowSymbol',
                                    }).format(scheduledPayment)
                                    : t('Common.NoDataFound')
                            }
                        />
                    </div>
                </Card>
            </motion.div>

            <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4">
                <Contentwrapper bottomRounded className="flex-1">
                    <Title PageName={t('Pages.Visits.Label.Stocks')} />
                    {!hasProducts && (
                        <Message info>
                            <Message.Header>{t('Common.NoDataFound')}</Message.Header>
                            <p className="m-0">{t('Pages.Visits.Messages.NoProducts')}</p>
                        </Message>
                    )}

                    {hasProducts && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3 ">
                            {productRows.map((product, index) => {
                                const stock = (stocks || []).find(item => item.Uuid === product.StockID)
                                const stockdefine = (stockdefines || []).find(item => item.Uuid === stock?.StockdefineID)
                                const stockName = stockdefine?.Productname ?? product.StockID

                                return (<div className='w-full ' key={index}>
                                    <Card
                                        fluid
                                        className="!bg-red-30 !rounded-xl !shadow !border-0 "
                                    >
                                        <Card.Content>
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className='mb-1'>
                                                        <Icon name="cube" className='text-primary' />
                                                    </div>
                                                    <div className="font-semibold text-gray-800">{stockName}</div>
                                                </div>
                                                <Popup
                                                    content={product.Description || t('Pages.Visits.Label.NoDescription')}
                                                    trigger={<Icon name="info circle" className="text-gray-400" />}
                                                />
                                            </div>

                                            <div className="mt-3 grid grid-cols-4 gap-2 text-sm ">
                                                <div className="text-gray-500 col-span-3">{t('Pages.Visits.Columns.Amount')}</div>
                                                <div className="text-gray-800 font-semibold">{product.Amount}</div>

                                                <div className="text-gray-500 col-span-3">{t('Pages.Visits.Label.IsTaken')}</div>
                                                <div className="text-gray-800">
                                                    {product.Istaken ? (
                                                        <Label color="green" size="mini" className="!text-white">
                                                            {t('Common.Yes')}
                                                        </Label>
                                                    ) : (
                                                        <Label size="mini">{t('Common.No')}</Label>
                                                    )}
                                                </div>

                                                <div className="text-gray-500 col-span-3">{t('Pages.Visits.Label.IsReturned')}</div>
                                                <div className="text-gray-800">
                                                    {product.IsReturned ? (
                                                        <Label color="teal" size="mini" className="!text-white">
                                                            {t('Common.Yes')}
                                                        </Label>
                                                    ) : (
                                                        <Label size="mini">{t('Common.No')}</Label>
                                                    )}
                                                </div>
                                            </div>

                                            {product.Description && (
                                                <div className="mt-3 text-xs text-gray-500">{product.Description}</div>
                                            )}
                                        </Card.Content>
                                    </Card>
                                </div>

                                );
                            })}
                        </div>
                    )}
                </Contentwrapper>
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
            </div>
            {isError && (
                <Message negative className="w-full mt-4">
                    <Message.Header>{t('Common.SomethingWentWrong')}</Message.Header>
                    <p className="m-0">{t('Common.TryAgain')}</p>
                </Message>
            )}
        </Pagewrapper>
    );
};

export default VisitDetail;
