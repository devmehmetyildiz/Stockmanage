import React from 'react'
import FormButton from '@Components/Common/FormButton';
import { useTranslation } from 'react-i18next';
import { Button, Header, Image, Modal } from 'semantic-ui-react';
import AppModal from '@Components/Common/AppModal';
import useExcel from '@Hooks/useExcel';
import { utils, write } from 'xlsx';
import { saveAs } from 'file-saver';
import imgs from '@Assets/img';

interface TitleExcelExportProps {
    name: any
}

const TitleExcelExport: React.FC<TitleExcelExportProps> = ({ name }) => {
    const [open, setOpen] = React.useState(false)

    const { t } = useTranslation()
    const excel = useExcel()

    const excelData = excel?.excelData

    const exportToExcel = () => {
        const worksheet = utils.json_to_sheet(excelData || []);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, 'Sheet1')
        const excelBuffer = write(workbook, { bookType: 'xlsx', type: 'array' });
        const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        saveAs(excelBlob, `${name}.xlsx`);
    }

    return <React.Fragment>
        <AppModal
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            size='small'
        >
            <Modal.Header>{t('Components.Title.Excel.Page.Header')}</Modal.Header>
            <Modal.Content image>
                <Image size='medium' src={imgs.excelExport} wrapped />
                <Modal.Description>
                    <Header>{name}</Header>
                    <p>
                        {excelData?.length ?? 0}{t('Components.Title.Excel.Messages.Subject')}
                    </p>
                </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
                <Button content={t('Common.Button.Close')} color='black' onClick={() => setOpen(false)} />
                <FormButton text={t('Common.Button.Excel')} onClick={() => exportToExcel()} />
            </Modal.Actions>
        </AppModal>
        {name ?
            <FormButton text={t('Common.Button.Excel')} onClick={() => setOpen(true)} />
            : null}
    </React.Fragment>
}
export default TitleExcelExport