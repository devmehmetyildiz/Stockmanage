import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Message, } from 'semantic-ui-react';
import Pagewrapper from '@Components/Common/Pagewrapper';
import Title from '@Components/Common/Title';
import Paths from '@Constant/path';
import Pushnotification from '@Utils/Pushnotification';
import validator from '@Utils/Validator';
import { useLazyGetVisitQuery } from '@Api/Visit';
import VisitDetailPayments from '@Components/Visit/VisitDetail/VisitDetailPayments';
import VisitDetailProducts from '@Components/Visit/VisitDetail/VisitDetailProducts';
import VisitDetailMeta from '@Components/Visit/VisitDetail/VisitDetailMeta';

const VisitDetail: React.FC = () => {
    const { Id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [GetVisit, { isFetching, data, isError }] = useLazyGetVisitQuery();

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
            />
            <VisitDetailMeta
                data={data}
            />
            <div className="w-full flex flex-col lg:flex-row justify-center items-stretch gap-4">
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
        </Pagewrapper>
    );
};

export default VisitDetail;
