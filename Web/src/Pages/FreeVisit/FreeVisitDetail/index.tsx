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
import { VISIT_STATU_PLANNED, VISIT_STATU_WORKING } from '@Constant/index';
import VisitDeleteModal from '@Components/Visit/VisitDeleteModal';
import { VisitListItem } from '@Api/Visit/type';
import RouteKeys from '@Constant/routeKeys';
import privileges from '@Constant/privileges';
import FreeVisitCompleteModal from '@Components/FreeVisit/FreeVisitCompleteModal';
import FreeVisitWorkModal from '@Components/FreeVisit/FreeVisitWorkModal';
import FreeVisitDetailMeta from '@Components/FreeVisit/FreeVisitDetail/FreeVisitDetailMeta';

const FreeVisitDetail: React.FC = () => {
    const { Id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [completeOpen, setCompleteOpen] = useState(false)
    const [workOpen, setWorkOpen] = useState(false)
    const [record, setRecord] = useState<VisitListItem | null>(null)

    const [GetVisit, { isFetching, data, isError }] = useLazyGetVisitQuery();

    const additionalButtons: TitleAdditionalButtonType[] | undefined = useMemo(() => {
        if (data?.Status === VISIT_STATU_PLANNED) {
            return [
                {
                    name: t('Pages.Visits.Columns.EditDefines'),
                    onClick: () => {
                        navigate(`/${RouteKeys.FreeVisits}/${data.Uuid}/edit-defines`)
                    },
                    role: privileges.visitupdate
                },
                {
                    name: t('Common.Columns.work'),
                    onClick: () => {
                        setRecord(data)
                        setWorkOpen(true)
                    },
                    role: privileges.visitupdate
                },
                {
                    name: t('Common.Columns.delete'),
                    onClick: () => {
                        setRecord(data)
                        setDeleteOpen(true)
                    },
                    role: privileges.visitdelete
                },
            ] as TitleAdditionalButtonType[]
        } else if (data?.Status === VISIT_STATU_WORKING) {
            return [
                {
                    name: t('Common.Columns.complete'),
                    onClick: () => {
                        setCompleteOpen(true)
                        setRecord(data)
                    },
                    role: privileges.visitupdate
                },
            ] as TitleAdditionalButtonType[]
        }
    }, [data, setRecord, setDeleteOpen, setWorkOpen, t, navigate])

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetVisit({ Uuid: Id })
                .unwrap()
                .catch(() => {
                    navigate(Paths.FreeVisits);
                });
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.FreeVisits.Page.Header'),
                Description: t('Pages.FreeVisits.Messages.UndefinedVisit'),
            });
            navigate(Paths.FreeVisits);
        }
    }, [Id, GetVisit, navigate, t]);

    return (
        <Pagewrapper isLoading={isFetching} direction="vertical" gap={4} alignTop className="!pb-10"  >
            <Title
                PageName={t('Pages.FreeVisits.Page.Header')}
                PageUrl={Paths.FreeVisits}
                AdditionalName={data?.Visitcode}
                additionalButtons={additionalButtons}
            />
            <FreeVisitDetailMeta
                data={data}
            />
            {isError && (
                <Message negative className="w-full mt-4">
                    <Message.Header>{t('Common.SomethingWentWrong')}</Message.Header>
                    <p className="m-0">{t('Common.TryAgain')}</p>
                </Message>
            )}
            <FreeVisitCompleteModal
                open={completeOpen}
                setOpen={setCompleteOpen}
                data={record}
                setData={setRecord}
            />
            <FreeVisitWorkModal
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

export default FreeVisitDetail;
