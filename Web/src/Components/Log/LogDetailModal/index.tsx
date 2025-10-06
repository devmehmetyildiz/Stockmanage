import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal } from 'semantic-ui-react'
import JsonView from '@uiw/react-json-view';
import Contentwrapper from '@Components/Common/Contentwrapper'

interface LogDeleteModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
    data: string | null
    setData: React.Dispatch<string | null>
}

const LogDeleteModal: React.FC<LogDeleteModalProps> = (props) => {

    const { open, setOpen, data, setData } = props
    const { t } = useTranslation()

    const render = useMemo(() => {
        if (data) {
            try {
                const cleaned = data.replace(/^"(.*)"$/, '$1')
                const parsed = JSON.parse(cleaned);
                return <JsonView value={parsed} />;
            } catch {
                return data
            }
        }
        return data
    }, [data])

    return <AppModal
        open={open}
        onClose={() => {
            setOpen(false)
            setData(null)
        }}
        onOpen={() => setOpen(true)}
        size='large'
    >
        <Modal.Header>{t('Pages.Log.Page.ModalHeader')}</Modal.Header>
        <Modal.Content >
            <Modal.Description>
                <Contentwrapper>
                    <div className='max-h-[30vh] md:max-h-[50vh] lg:max-h-[70vh] text-wrap w-full break-all overflow-y-auto'>
                        {render}
                    </div>
                </Contentwrapper>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
            <FormButton
                text={t('Common.Button.Close')}
                secondary
                onClick={() => setOpen(false)}
            />
        </Modal.Actions>
    </AppModal>
}
export default LogDeleteModal