import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Message, } from 'semantic-ui-react';
import Pagewrapper from '@Components/Common/Pagewrapper';
import Title from '@Components/Common/Title';
import Paths from '@Constant/path';
import Pushnotification from '@Utils/Pushnotification';
import validator from '@Utils/Validator';
import { useLazyGetVisitQuery } from '@Api/Visit';
import VisitDeleteModal from '@Components/Visit/VisitDeleteModal';
import { VisitListItem } from '@Api/Visit/type';
import FreeVisitDetailMeta from '@Components/FreeVisit/FreeVisitDetail/FreeVisitDetailMeta';
import FreeVisitDetailNote from '@Components/FreeVisit/FreeVisitDetail/FreeVisitDetailNote';
import VisitDetailPayments from '@Components/Visit/VisitDetail/VisitDetailPayments';

const PastVisitDetail: React.FC = () => {
    const { Id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [deleteOpen, setDeleteOpen] = useState(false)
    const [record, setRecord] = useState<VisitListItem | null>(null)

    const [GetVisit, { isFetching, data, isError }] = useLazyGetVisitQuery();

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetVisit({ Uuid: Id })
                .unwrap()
                .catch(() => {
                    navigate(Paths.PastVisits);
                });
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.PastVisits.Page.Header'),
                Description: t('Pages.PastVisits.Messages.UndefinedVisit'),
            });
            navigate(Paths.PastVisits);
        }
    }, [Id, GetVisit, navigate, t]);

    return (
        <Pagewrapper isLoading={isFetching} direction="vertical" gap={4} alignTop className="!pb-10"  >
            <Title
                PageName={t('Pages.PastVisits.Page.Header')}
                PageUrl={Paths.PastVisits}
                AdditionalName={data?.Visitcode}
            />
            <FreeVisitDetailMeta
                data={data}
                returnUrl={Paths.PastVisits}
            />
            <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 ">
                <FreeVisitDetailNote
                    data={data}
                />
            </div>
            <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4 ">
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
            <VisitDeleteModal
                open={deleteOpen}
                setOpen={setDeleteOpen}
                data={record}
                setData={setRecord}
            />
        </Pagewrapper>
    );
};

export default PastVisitDetail;
