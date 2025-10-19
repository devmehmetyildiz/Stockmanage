
import { useCompleteVisitMutation, useLazyGetVisitQuery } from '@Api/Visit';
import { VisitCompleteRequest } from '@Api/Visit/type';
import Contentwrapper from '@Components/Common/Contentwrapper';
import FormButton from '@Components/Common/FormButton';
import FormFooter from '@Components/Common/FormFooter';
import Pagewrapper from '@Components/Common/Pagewrapper';
import Title from '@Components/Common/Title';
import VisitCompleteStepPayment from '@Components/Visit/VisitComplete/VisitCompleteStepPayment';
import VisitCompleteStepProduct from '@Components/Visit/VisitComplete/VisitCompleteStepProduct';
import VisitStepCompleteDetail from '@Components/Visit/VisitComplete/VisitStepCompleteDetail';
import VisitStepPaymentDetail from '@Components/Visit/VisitComplete/VisitStepCompleteDetail';
import VisitDetailMeta from '@Components/Visit/VisitDetail/VisitDetailMeta';
import Paths from '@Constant/path';
import CheckForm from '@Utils/CheckForm';
import { SuppressDate } from '@Utils/FormatDate';
import Pushnotification from '@Utils/Pushnotification';
import validator from '@Utils/Validator';
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom';
import { Divider, Step } from 'semantic-ui-react';

export type VisitCompleteStepType = 'product' | 'payment' | 'detail'

const VisitComplete: React.FC = () => {

    const { Id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [activeStep, setActiveStep] = useState<VisitCompleteStepType>('product')

    const [GetVisit, { isFetching, data }] = useLazyGetVisitQuery();
    const [CompleteVisit, { isLoading }] = useCompleteVisitMutation()

    const methods = useForm<VisitCompleteRequest>({
        mode: 'onChange',
    })

    const { getValues, formState, trigger, setValue, reset } = methods

    const checkButtonValidation = () => {
        if (activeStep === 'product') {
            return !!formState.errors.Returnedproducts
        } else if (activeStep === 'payment') {
            return !formState.isValid
        }
        return false
    }

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                const { isFullPayment, ...rest } = getValues()
                CompleteVisit({
                    ...rest,
                    Returnedproducts: rest.Returnedproducts.filter(u => u.Amount > 0),
                    Prepaymentamount: isFullPayment ? rest.Totalamount : rest.Prepaymentamount
                })
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Visits.Page.Header'),
                            Description: t('Pages.Visits.Messages.UpdateSuccess')
                        })
                        navigate(Paths.Visits)
                    })
            } else {
                CheckForm(formState, t('Pages.Visits.Page.Header'))
            }
        })
    }

    const onNextClick = () => {
        if (activeStep === 'product') {
            setActiveStep('payment')
        } else if (activeStep === 'payment') {
            setActiveStep('detail')
        } else if (activeStep === 'detail') {
            submit()
        }
    }

    const onBackClick = () => {
        if (activeStep === 'product') {
            navigate(-1)
        } else if (activeStep === 'payment') {
            setActiveStep('product')
        } else if (activeStep === 'detail') {
            setActiveStep('payment')
        }
    }

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetVisit({ Uuid: Id })
                .unwrap()
                .then((data) => {
                    reset({
                        VisitID: data.Uuid,
                        Returnedproducts: (data.Products || []).map(item => {
                            return {
                                Uuid: item.Uuid,
                                Amount: 0,
                                Description: ''
                            }
                        }),
                        Startdate: SuppressDate(new Date()),
                        isFullPayment: false
                    })
                })
                .catch(() => {
                    navigate(`${Paths.Visits}?tab=working`);
                });
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Visits.Page.Header'),
                Description: t('Pages.Visits.Messages.UndefinedVisit'),
            });
            navigate(`${Paths.Visits}?tab=working`);
        }
    }, [Id, GetVisit, navigate, t, reset]);

    return <Pagewrapper isLoading={isFetching || isLoading} direction="vertical" gap={4} alignTop className="!pb-10"  >
        <Title
            PageName={t('Pages.Visits.Page.Header')}
            PageUrl={Paths.Visits}
            AdditionalName={data?.Visitcode}
        />
        <VisitDetailMeta
            data={data}
            disableButtons
        />
        <FormProvider<VisitCompleteRequest> {...methods}>
            <Contentwrapper bottomRounded>
                <Step.Group ordered>
                    <Step link completed={activeStep !== 'product'} disabled={activeStep !== 'product'} active={activeStep === 'product'}>
                        <Step.Content>
                            <Step.Title>{t('Pages.Visits.Label.StepProduct')}</Step.Title>
                            <Step.Description>{t('Pages.Visits.Label.StepProductDesc')}</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step link completed={activeStep === 'detail'} disabled={activeStep !== 'payment'} active={activeStep === 'payment'}>
                        <Step.Content>
                            <Step.Title>{t('Pages.Visits.Label.StepPayment')}</Step.Title>
                            <Step.Description>{t('Pages.Visits.Label.StepPaymentDesc')}</Step.Description>
                        </Step.Content>
                    </Step>
                    <Step link disabled={activeStep !== 'detail'} active={activeStep === 'detail'}>
                        <Step.Content>
                            <Step.Title>{t('Pages.Visits.Label.StepDetail')}</Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>
                <Divider />
                {activeStep === 'product' ?
                    <VisitCompleteStepProduct
                        data={data}
                    />
                    : null}
                {activeStep === 'payment' ?
                    <VisitCompleteStepPayment />
                    : null}
                {activeStep === 'detail' ?
                    <VisitStepCompleteDetail
                        data={data}
                    />
                    : null}
                <FormFooter transparent>
                    <FormButton
                        onClick={() => onBackClick()}
                        secondary
                        text={t('Common.Button.Goback')}
                    />
                    <FormButton
                        loading={isLoading}
                        disabled={checkButtonValidation()}
                        text={activeStep === 'detail' ? t('Common.Columns.complete') : t('Common.Button.GoNext')}
                        onClick={() => onNextClick()}
                    />
                </FormFooter>
            </Contentwrapper>
        </FormProvider>
    </Pagewrapper>
}
export default VisitComplete