import React, { useEffect, useState } from 'react'
import AppModal from '@Components/Common/AppModal'
import FormButton from '@Components/Common/FormButton'
import Pushnotification from '@Utils/Pushnotification'
import { useTranslation } from 'react-i18next'
import { Modal, Table } from 'semantic-ui-react'
import * as XLSX from 'xlsx'
import { useAddStockdefineMutation } from '@Api/Stockdefine'
import { StockdefineAddRequest } from '@Api/Stockdefine/type'

interface StockdefineImportModalProps {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const REQUIRED = ['Productname', 'Barcodeno', 'Brand', 'Model', 'Category', 'Diameter', 'Length', 'Material']



const StockdefineImportModal: React.FC<StockdefineImportModalProps> = ({ open, setOpen }) => {
    const { t } = useTranslation()
    const [rows, setRows] = useState<any[]>([])
    const [AddStockdefine, { isLoading }] = useAddStockdefineMutation()

    const COLUMN_LABELS: Record<string, string> = {
        Productname: t('Pages.Stockdefines.Columns.Productname'),
        Barcodeno: t('Pages.Stockdefines.Columns.Barcodeno'),
        Brand: t('Pages.Stockdefines.Columns.Brand'),
        Model: t('Pages.Stockdefines.Columns.Model'),
        Category: t('Pages.Stockdefines.Columns.Category'),
        Diameter: t('Pages.Stockdefines.Columns.Diameter'),
        Length: t('Pages.Stockdefines.Columns.Length'),
        Material: t('Pages.Stockdefines.Columns.Material'),
        Surfacetreatment: t('Pages.Stockdefines.Columns.Surfacetreatment'),
        Connectiontype: t('Pages.Stockdefines.Columns.Connectiontype'),
        Suppliername: t('Pages.Stockdefines.Columns.Suppliername'),
        Suppliercontact: t('Pages.Stockdefines.Columns.Suppliercontact'),
        Description: t('Pages.Stockdefines.Columns.Description'),
    }

    const handleFile = async (file: File) => {
        const buf = await file.arrayBuffer()
        const wb = XLSX.read(buf, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const json = XLSX.utils.sheet_to_json(ws) as any[]


        const cleaned = json.map((r, i) => {
            const obj: any = {
                Productname: r[t('Pages.Stockdefines.Columns.Productname')] ?? '',
                Barcodeno: r[t('Pages.Stockdefines.Columns.Barcodeno')] ?? '',
                Brand: r[t('Pages.Stockdefines.Columns.Brand')] ?? '',
                Model: r[t('Pages.Stockdefines.Columns.Model')] ?? '',
                Category: r[t('Pages.Stockdefines.Columns.Category')] ?? '',
                Diameter: r[t('Pages.Stockdefines.Columns.Diameter')] ?? '',
                Length: r[t('Pages.Stockdefines.Columns.Length')] ?? '',
                Material: r[t('Pages.Stockdefines.Columns.Material')] ?? '',
                Surfacetreatment: r[t('Pages.Stockdefines.Columns.Surfacetreatment')] ?? '',
                Connectiontype: r[t('Pages.Stockdefines.Columns.Connectiontype')] ?? '',
                Suppliername: r[t('Pages.Stockdefines.Columns.Suppliername')] ?? '',
                Suppliercontact: r[t('Pages.Stockdefines.Columns.Suppliercontact')] ?? '',
                Description: r[t('Pages.Stockdefines.Columns.Description')] ?? ''
            }
            const missing = REQUIRED.filter(k => !obj[k])
            return { ...obj, __row: i + 2, __errors: missing }
        })
        setRows(cleaned)
    }

    const handleImport = () => {
        const valid = rows.filter(r => (r.__errors || []).length === 0) as StockdefineAddRequest[]
        if (!valid.length) {
            return Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Stockdefines.Page.Header'),
                Description: t('Common.NoDataFound')
            })
        }
        AddStockdefine({
            DefineList: valid
        })
            .unwrap()
            .then(() => {
                Pushnotification({
                    Type: 'Success',
                    Subject: t('Pages.Stockdefines.Page.Header'),
                    Description: t('Pages.Stockdefines.Messages.AddSuccess')
                })
                setOpen(false)
            })
    }

    const handleDownloadTemplate = () => {
        const ws = XLSX.utils.json_to_sheet([
            {
                [t('Pages.Stockdefines.Columns.Productname')]: '',
                [t('Pages.Stockdefines.Columns.Barcodeno')]: '',
                [t('Pages.Stockdefines.Columns.Brand')]: '',
                [t('Pages.Stockdefines.Columns.Model')]: '',
                [t('Pages.Stockdefines.Columns.Category')]: '',
                [t('Pages.Stockdefines.Columns.Diameter')]: '',
                [t('Pages.Stockdefines.Columns.Length')]: '',
                [t('Pages.Stockdefines.Columns.Material')]: '',
                [t('Pages.Stockdefines.Columns.Surfacetreatment')]: '',
                [t('Pages.Stockdefines.Columns.Connectiontype')]: '',
                [t('Pages.Stockdefines.Columns.Suppliername')]: '',
                [t('Pages.Stockdefines.Columns.Suppliercontact')]: '',
                [t('Pages.Stockdefines.Columns.Description')]: ''
            }
        ])
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, 'Template')
        XLSX.writeFile(wb, `${t('Pages.Stockdefines.Page.Header')}.xlsx`)
    }

    useEffect(() => {
        if (!open) {
            setRows([])
        }
    }, [open])

    return (
        <AppModal
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            size="large"
        >
            <Modal.Header>{t('Pages.Stockdefines.Page.ImportHeader')}</Modal.Header>
            <Modal.Content scrolling>
                <input
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                {!rows.length ? (
                    <p className="mt-3 text-gray-500">{t('Pages.Stockdefines.Messages.ImportHelp')}</p>
                ) : (
                    <Table celled compact striped className="mt-3">
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>#</Table.HeaderCell>
                                {Object.keys(rows[0])
                                    .filter(k => !k.startsWith('__'))
                                    .map(k => (
                                        <Table.HeaderCell key={k}>
                                            {COLUMN_LABELS[k] ?? k}
                                        </Table.HeaderCell>
                                    ))}
                                <Table.HeaderCell>{t('Common.Errors')}</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {rows.map((r, i) => (
                                <Table.Row key={i} negative={(r.__errors || []).length > 0}>
                                    <Table.Cell>{r.__row}</Table.Cell>
                                    {Object.keys(r).filter(k => !k.startsWith('__')).map(k => (
                                        <Table.Cell key={k}>{String(r[k] ?? '')}</Table.Cell>
                                    ))}
                                    <Table.Cell>{(r.__errors || []).join(', ')}</Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                )}
            </Modal.Content>
            <Modal.Actions>
                <FormButton
                    text={t('Pages.Stockdefines.Label.DownloadTemplate')}
                    onClick={handleDownloadTemplate}
                    secondary
                />
                <FormButton
                    loading={isLoading}
                    text={t('Pages.Stockdefines.Label.Import')}
                    onClick={handleImport}
                />
                <FormButton
                    secondary
                    text={t('Common.Button.Close')}
                    onClick={() => setOpen(false)}
                />
            </Modal.Actions>
        </AppModal>
    )
}

export default StockdefineImportModal
