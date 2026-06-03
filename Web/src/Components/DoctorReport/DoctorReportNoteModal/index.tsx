import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Card, Icon, Message } from 'semantic-ui-react';

interface DoctorReportNoteModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    notes: string[];
    visitCode?: string;
}

const DoctorReportNoteModal: React.FC<DoctorReportNoteModalProps> = ({ open, setOpen, notes, visitCode }) => {
    const { t } = useTranslation();
    const hasNotes = notes && Array.isArray(notes) && notes.length > 0;

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            size="tiny"
            className="!rounded-2xl"
        >
            <Modal.Header className="!bg-gray-50 !text-gray-800">
                <Icon name="sticky note" className="text-primary" />
                {visitCode ? `${visitCode} - ` : ''} {t('Pages.Visits.Label.NoteTitle', 'Vizit Notları')}
            </Modal.Header>

            <Modal.Content scrolling className="!p-6">
                {!hasNotes ? (
                    <Message info className="!rounded-xl">
                        <Message.Header>{t('Common.NoDataFound')}</Message.Header>
                        <p className="m-0">{t('Pages.Visits.Messages.NoNotes', 'Bu vizite ait bir not bulunamadı.')}</p>
                    </Message>
                ) : (
                    <div className="flex flex-col w-full gap-3">
                        {notes.map((note, index) => (
                            <Card fluid key={index} className="!bg-blue-50/50 !rounded-xl !shadow-sm !border-0">
                                <Card.Content>
                                    <div className="flex items-start gap-3">
                                        <div className="mt-0.5">
                                            <Icon name="sticky note" className="text-primary" />
                                        </div>
                                        <div className="font-medium text-gray-700 leading-relaxed">
                                            {note}
                                        </div>
                                    </div>
                                </Card.Content>
                            </Card>
                        ))}
                    </div>
                )}
            </Modal.Content>

            <Modal.Actions className="!bg-gray-50">
                <Button
                    className="!rounded-xl"
                    onClick={() => setOpen(false)}
                >
                    {t('Common.Close', 'Kapat')}
                </Button>
            </Modal.Actions>
        </Modal>
    );
};

export default DoctorReportNoteModal;