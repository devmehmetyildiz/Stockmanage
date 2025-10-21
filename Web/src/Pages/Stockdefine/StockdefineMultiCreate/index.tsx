import { useAddStockdefineMutation } from '@Api/Stockdefine'
import { StockdefineAddRequestWrapper } from '@Api/Stockdefine/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import FormButton from '@Components/Common/FormButton'
import FormFooter from '@Components/Common/FormFooter'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import StockdefineMultiCreateForm from '@Components/Stockdefine/StockdefineMultiCreate/StockdefineMultiCreateForm'
import Paths from '@Constant/path'
import CheckForm from '@Utils/CheckForm'
import { createAppForm } from '@Utils/CreateAppForm'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

interface StockdefineMultiCreateProps {
}


const StockdefineMultiCreate: React.FC<StockdefineMultiCreateProps> = () => {

    const { t } = useTranslation()

    const navigate = useNavigate()

    const methods = useForm<StockdefineAddRequestWrapper>({
        mode: 'onChange',
        defaultValues: {
            DefineList: [{
                Barcodeno: '',
                Brand: ''
            }]
        }
    })

    const { getValues, formState, trigger } = methods

    const [AddStockdefine, { isLoading }] = useAddStockdefineMutation()

    const submit = () => {
        trigger().then((valid) => {
            if (valid) {
                AddStockdefine(getValues())
                    .unwrap()
                    .then(() => {
                        Pushnotification({
                            Type: 'Success',
                            Subject: t('Pages.Stockdefines.Page.Header'),
                            Description: t('Pages.Stockdefines.Messages.AddSuccess')
                        })
                        navigate(Paths.Stockdefines)
                    })
            } else {
                CheckForm(formState, t('Pages.Stockdefines.Page.Header'))
            }
        })
    }

    return <Pagewrapper isLoading={isLoading} direction='vertical' alignTop gap={4}>
        <Title
            PageName={t('Pages.Stockdefines.Page.Header')}
            AdditionalName={t('Pages.Stockdefines.Page.CreateHeader')}
            PageUrl={Paths.Stockdefines}
        />
        <FormProvider<StockdefineAddRequestWrapper> {...methods}>
            <div className='w-full'>
                <StockdefineMultiCreateForm />
            </div>
        </FormProvider>
        <FormFooter>
            <FormButton
                onClick={() => navigate(-1)}
                secondary
                text={t('Common.Button.Goback')}
            />
            <FormButton
                loading={isLoading}
                text={t('Common.Button.Create')}
                onClick={() => submit()}
            />
        </FormFooter>
    </Pagewrapper >
}
export default StockdefineMultiCreate