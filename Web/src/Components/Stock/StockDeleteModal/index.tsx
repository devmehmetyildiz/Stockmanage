import { useDeleteStockMutation } from '@Api/Stock'
import { StockItem } from '@Api/Stock/type'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface StockDeleteModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: StockItem | null
    setData: React.Dispatch<React.SetStateAction<StockItem | null>>
}

const StockDeleteModal: React.FC<StockDeleteModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [DeleteStock, { isLoading }] = useDeleteStockMutation()
    const { data: stockdefines, isFetching: isStockdefineFetching } = useGetStockdefinesQuery({ isActive: 1, Uuid: data?.StockdefineID ?? '' }, { skip: !validator.isUUID(data?.StockdefineID) })

    const stockName = (stockdefines || []).find(u => u.Uuid === data?.StockdefineID)?.Productname ?? t('Common.NoDataFound')

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
        isLoading={isStockdefineFetching}
    >
        <Modal.Header>{t('Pages.Stocks.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.dataClear} wrapped />
            <Modal.Description>
                <Header>{stockName}</Header>
                <p>
                    {stockName} {t('Pages.Stocks.Delete.Label.DeleteCheck')}
                </p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Delete')} onClick={() => {
                if (data?.Uuid) {
                    DeleteStock({ Uuid: data?.Uuid })
                        .unwrap()
                        .then(() => {
                            setData(null)
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Stocks.Page.Header'),
                                Description: t('Pages.Stocks.Messages.DeleteSuccess')
                            })
                        })
                }
            }} />
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default StockDeleteModal