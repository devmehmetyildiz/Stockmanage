import { useDeleteWarehouseMutation } from '@Api/Warehouse'
import { WarehouseItem } from '@Api/Warehouse/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface WarehouseDeleteModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: WarehouseItem | null
    setData: React.Dispatch<React.SetStateAction<WarehouseItem | null>>
}

const WarehouseDeleteModal: React.FC<WarehouseDeleteModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [DeleteWarehouse, { isLoading }] = useDeleteWarehouseMutation()

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.Warehouses.Page.DeleteHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.dataClear} wrapped />
            <Modal.Description>
                <Header>{data?.Name}</Header>
                <p>
                    {data?.Name} {t('Pages.Warehouses.Delete.Label.DeleteCheck')}
                </p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Delete')} onClick={() => {
                if (data?.Uuid) {
                    DeleteWarehouse({ Uuid: data?.Uuid })
                        .unwrap()
                        .then(() => {
                            setData(null)
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Warehouses.Page.Header'),
                                Description: t('Pages.Warehouses.Messages.DeleteSuccess')
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
export default WarehouseDeleteModal