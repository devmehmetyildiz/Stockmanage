import { useDeleteStockMovementMutation, useGetStocksQuery } from '@Api/Stock'
import { StockmovementItem } from '@Api/Stock/type'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import validator from '@Utils/Validator'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface StockDeleteMovementModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: StockmovementItem | null
    setData: React.Dispatch<React.SetStateAction<StockmovementItem | null>>
}

const StockDeleteMovementModal: React.FC<StockDeleteMovementModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [DeleteMovement, { isLoading }] = useDeleteStockMovementMutation()
    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery({ isActive: 1, Uuid: data?.StockID ?? '' }, { skip: !validator.isUUID(data?.StockID) })

    const stock = (stocks || []).find(u => u.Uuid === data?.StockID)

    const { data: stockdefines, isFetching: isStockdefineFetching } = useGetStockdefinesQuery({ isActive: 1, Uuid: stock?.StockdefineID ?? '' }, { skip: !validator.isUUID(stock?.StockdefineID) })

    const stockName = (stockdefines || []).find(u => u.Uuid === stock?.StockdefineID)?.Productname ?? t('Common.NoDataFound')

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
        isLoading={isStocksFetching || isStockdefineFetching}
    >
        <Modal.Header>{t('Pages.Stocks.Page.DeleteMovementHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.dataClear} wrapped />
            <Modal.Description>
                <Header>{stockName}</Header>
                <p>
                    {stockName} {t('Pages.Stocks.Delete.Label.DeleteMovementCheck')}
                </p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Delete')} onClick={() => {
                if (data?.Uuid) {
                    DeleteMovement({ Uuid: data?.Uuid })
                        .unwrap()
                        .then(() => {
                            setData(null)
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Stocks.Page.Header'),
                                Description: t('Pages.Stocks.Messages.DeleteMovementSuccess')
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
export default StockDeleteMovementModal