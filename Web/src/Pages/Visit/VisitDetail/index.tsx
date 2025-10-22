import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Message, } from 'semantic-ui-react';
import Pagewrapper from '@Components/Common/Pagewrapper';
import Title, { TitleAdditionalButtonType } from '@Components/Common/Title';
import Paths from '@Constant/path';
import Pushnotification from '@Utils/Pushnotification';
import validator from '@Utils/Validator';
import { useLazyGetVisitQuery } from '@Api/Visit';
import VisitDetailPayments from '@Components/Visit/VisitDetail/VisitDetailPayments';
import VisitDetailProducts from '@Components/Visit/VisitDetail/VisitDetailProducts';
import VisitDetailMeta from '@Components/Visit/VisitDetail/VisitDetailMeta';
import { VISIT_STATU_PLANNED, VISIT_STATU_WORKING } from '@Constant/index';
import VisitWorkModal from '@Components/Visit/VisitWorkModal';
import VisitDeleteModal from '@Components/Visit/VisitDeleteModal';
import { VisitListItem } from '@Api/Visit/type';
import RouteKeys from '@Constant/routeKeys';

const VisitDetail: React.FC = () => {
    const { Id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [workOpen, setWorkOpen] = useState(false)
    const [record, setRecord] = useState<VisitListItem | null>(null)

    const [GetVisit, { isFetching, data, isError }] = useLazyGetVisitQuery();

    const additionalButtons: TitleAdditionalButtonType[] | undefined = useMemo(() => {
        if (data?.Status === VISIT_STATU_PLANNED) {
            return [
                {
                    name: t('Pages.Visits.Columns.EditProducts'),
                    onClick: () => {
                        navigate(`/${RouteKeys.Visits}/${data.Uuid}/edit-products`)
                    }
                },
                {
                    name: t('Pages.Visits.Columns.EditDefines'),
                    onClick: () => {
                        navigate(`/${RouteKeys.Visits}/${data.Uuid}/edit-defines`)
                    }
                },
                {

                    name: t('Common.Columns.work'),
                    onClick: () => {
                        setRecord(data)
                        setWorkOpen(true)
                    }
                },
                {
                    name: t('Common.Columns.delete'),
                    onClick: () => {
                        setRecord(data)
                        setDeleteOpen(true)
                    }
                },
            ] as TitleAdditionalButtonType[]
        } else if (data?.Status === VISIT_STATU_WORKING) {
            return [
                {
                    name: t('Pages.Visits.Columns.EditPaymentDefines'),
                    onClick: () => {
                        navigate(`/${RouteKeys.Visits}/${data.Uuid}/edit-payment-defines`)
                    }
                },
                {
                    name: t('Common.Columns.complete'),
                    onClick: () => {
                        navigate(`/${RouteKeys.Visits}/${data.Uuid}/complete`)
                    }
                },
            ] as TitleAdditionalButtonType[]
        }
    }, [data, setRecord, setDeleteOpen, setWorkOpen, t, navigate])

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

    return (
        <Pagewrapper isLoading={isFetching} direction="vertical" gap={4} alignTop className="!pb-10"  >
            <Title
                PageName={t('Pages.Visits.Page.Header')}
                PageUrl={Paths.Visits}
                AdditionalName={data?.Visitcode}
                additionalButtons={additionalButtons}
            />
            <VisitDetailMeta
                data={data}
            />
            <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 ">
                <VisitDetailProducts
                    data={data}
                />
                <VisitDetailPayments
                    data={data}
                />
            </div>
            {isError && (
                <Message negative className="w-full mt-4">
                    <Message.Header>{t('Common.SomethingWentWrong')}</Message.Header>
                    <p className="m-0">{t('Common.TryAgain')}</p>
                </Message>
            )}
            <VisitWorkModal
                open={workOpen}
                setOpen={setWorkOpen}
                data={record}
                setData={setRecord}
            />
            <VisitDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                data={record}
                setData={setRecord}
            />
        </Pagewrapper>
    );
};

export default VisitDetail;
