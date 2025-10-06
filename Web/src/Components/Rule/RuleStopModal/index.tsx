import { useStopRuleMutation } from '@Api/Rule'
import { RuleItem } from '@Api/Rule/type'
import imgs from '@Assets/img'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Header, Image, Modal } from 'semantic-ui-react'

interface RuleStopModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: RuleItem | null
    setData: React.Dispatch<React.SetStateAction<RuleItem | null>>
}

const RuleStopModal: React.FC<RuleStopModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const [StopRule, { isLoading }] = useStopRuleMutation()

    return <AppModal
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        size='small'
    >
        <Modal.Header>{t('Pages.Rules.Page.StopHeader')}</Modal.Header>
        <Modal.Content image>
            <Image size='medium' src={imgs.dataClear} wrapped />
            <Modal.Description>
                <Header>{data?.Name}</Header>
                <p>
                    {data?.Name} {t('Pages.Rules.Stop.Label.StopCheck')}
                </p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton loading={isLoading} text={t('Common.Button.Stop')} onClick={() => {
                if (data?.Uuid) {
                    StopRule({ Uuid: data?.Uuid })
                        .unwrap()
                        .then(() => {
                            setData(null)
                            setOpen(false)
                            Pushnotification({
                                Type: 'Success',
                                Subject: t('Pages.Rules.Page.Header'),
                                Description: t('Pages.Rules.Messages.StopSuccess')
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
export default RuleStopModal