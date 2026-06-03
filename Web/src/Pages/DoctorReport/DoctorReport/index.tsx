import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Grid, Card, Statistic, Dropdown, Icon, Label, Message, Segment } from 'semantic-ui-react';
import Pagewrapper from '@Components/Common/Pagewrapper';
import Title from '@Components/Common/Title';
import DataTable, { ColumnType } from '@Components/Common/DataTable';
import { useGetDoctordefinesQuery } from '@Api/Doctordefine';
import { useGetVisitsQuery, useLazyGetVisitQuery } from '@Api/Visit';
import { useGetPaymentplansQuery, } from '@Api/Paymentplan';
import { VisitListItem } from '@Api/Visit/type';
import { FormatDate } from '@Utils/FormatDate';
import { loaderCellhandler } from '@Utils/CellHandler';
import {
    VISIT_STATU_CLOSED,
    VISIT_STATU_COMPLETED,
    VISIT_STATU_ON_APPROVE,
    VISIT_STATU_PLANNED,
    VISIT_STATU_WORKING,
    VISIT_TYPE_FREEVISIT,
    VISIT_TYPE_PASTVISIT,
    VISIT_TYPE_SALEVISIT,
} from '@Constant/index';
import Contentwrapper from '@Components/Common/Contentwrapper';
import DoctorReportNoteModal from '@Components/DoctorReport/DoctorReportNoteModal';

const DoctorReport: React.FC = () => {
    const { t } = useTranslation();
    const [selectedDoctorId, setSelectedDoctorId] = useState<string | null>(null);

    const [notesModalOpen, setNotesModalOpen] = useState(false);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);
    const [activeVisitCode, setActiveVisitCode] = useState<string>('');

    const { data: doctors, isFetching: isDoctorsLoading } = useGetDoctordefinesQuery({ isActive: 1 });
    const { data: visits, isFetching: isVisitsLoading } = useGetVisitsQuery({ Isactive: true, DoctorID: selectedDoctorId || undefined }, { skip: !selectedDoctorId });
    const { data: paymentPlans, isFetching: isPlansLoading } = useGetPaymentplansQuery({ isActive: 1, DoctorID: selectedDoctorId || undefined }, { skip: !selectedDoctorId });
    const [getVisit, { isFetching: isVisitDetailFetching }] = useLazyGetVisitQuery();

    const doctorOptions = useMemo(() => {
        return (doctors || []).map(doc => ({
            key: doc.Uuid,
            value: doc.Uuid,
            text: `${doc.Name} ${doc.Surname}`,
            icon: 'user doctor'
        }));
    }, [doctors, t]);

    const filteredVisits = useMemo(() => {
        if (!selectedDoctorId) return [];
        return (visits || []).filter(v => v.DoctorID === selectedDoctorId);
    }, [visits, selectedDoctorId]);

    const reportMetrics = useMemo(() => {
        const metrics = {
            totalVisits: filteredVisits.length,
            completedVisits: 0,
            plannedVisits: 0,
            workingVisits: 0,
            totalScheduledPayment: 0,
            totalRemainingDebt: 0,
            totalCompletedDebt: 0
        };

        filteredVisits.forEach(visit => {
            if (visit.Status === VISIT_STATU_COMPLETED || visit.Status === VISIT_STATU_CLOSED) metrics.completedVisits++;
            if (visit.Status === VISIT_STATU_PLANNED) metrics.plannedVisits++;
            if (visit.Status === VISIT_STATU_WORKING) metrics.workingVisits++;

            const plan = (paymentPlans || []).find(p => p.VisitID === visit.Uuid);
            if (plan) {
                metrics.totalScheduledPayment += plan.Totalamount || 0;
                metrics.totalRemainingDebt += plan.Remainingvalue || 0;
                metrics.totalCompletedDebt += (plan.Totalamount || 0) - (plan.Remainingvalue || 0);
            }
        });

        return metrics;
    }, [filteredVisits, paymentPlans]);

    const statusDecoratedCellhandler = (value: number) => {
        const statusMap: Record<number, { color: string, name: string }> = {
            [VISIT_STATU_PLANNED]: { color: 'red', name: t('Option.VisitStatu.Planned') },
            [VISIT_STATU_WORKING]: { color: 'blue', name: t('Option.VisitStatu.Working') },
            [VISIT_STATU_ON_APPROVE]: { color: 'orange', name: t('Option.VisitStatu.Onapprove') },
            [VISIT_STATU_COMPLETED]: { color: 'green', name: t('Option.VisitStatu.Completed') },
            [VISIT_STATU_CLOSED]: { color: 'grey', name: t('Option.VisitStatu.Closed') },
        };
        const current = statusMap[value] || { color: 'grey', name: String(value) };
        return <Label color={current.color as any} tag>{current.name}</Label>;
    };

    const currencyFormatter = (value: number) => {
        return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value || 0);
    };

    const columns: ColumnType<VisitListItem>[] = [
        { header: t('Pages.Visits.Columns.Visitcode'), accessorKey: 'Visitcode' },
        {
            header: t('Pages.Visits.Columns.Visittype', 'Tür'),
            accessorKey: 'Visittype',
            cell: (wrapper) => {
                const rowData = wrapper.row.original as VisitListItem;

                const types = [
                    { key: VISIT_TYPE_SALEVISIT, label: t('Pages.Visits.Page.Header') },
                    { key: VISIT_TYPE_FREEVISIT, label: t('Pages.FreeVisits.Page.Header') },
                    { key: VISIT_TYPE_PASTVISIT, label: t('Pages.PastVisits.Page.Header') },
                ]

                return types.find(u => u.key === rowData.Visittype)?.label

            }
        },
        {
            header: t('Pages.Visits.Columns.Status'),
            accessorKey: 'Status',
            cell: (wrapper) => statusDecoratedCellhandler(wrapper.row.original.Status)
        },
        {
            header: t('Pages.Visits.Columns.Visitdate'),
            accessorKey: 'Visitdate',
            accessorFn: row => FormatDate(row.Visitdate)
        },
        {
            header: t('Pages.Visits.Columns.Scheduledpayment'),
            accessorKey: 'Scheduledpayment',
            accessorFn: row => currencyFormatter(row.Scheduledpayment)
        },
        {
            header: t('Pages.Visits.Columns.ReminingValue'),
            accessorKey: 'RemainingValue',
            accessorFn: row => {
                const plan = (paymentPlans || []).find(p => p.VisitID === row.Uuid);
                return currencyFormatter(plan?.Remainingvalue || 0);
            },
            cell: wrapper => loaderCellhandler(wrapper, isPlansLoading)
        },
        {
            header: t('Pages.Visits.Label.NoteTitle', 'Notlar'),
            accessorKey: 'Notes',
            cell: (wrapper) => {
                const rowData = wrapper.row.original as VisitListItem;

                return (
                    <div
                        className="cursor-pointer flex items-center gap-1 text-primary hover:text-blue-700 transition-colors"
                        onClick={() => {
                            if (rowData.Uuid) {
                                getVisit({
                                    Uuid: rowData.Uuid
                                })
                                    .unwrap()
                                    .then((res) => {
                                        const notesList = res?.Notes || [];

                                        setActiveNotes(notesList);
                                        setActiveVisitCode(rowData.Visitcode);
                                        setNotesModalOpen(true);
                                    })
                            }
                        }}
                    >
                        <Icon name="sticky note" color="blue" size="large" className="animate-pulse" />
                    </div>
                );
            }
        },
        { header: t('Pages.Visits.Columns.Description'), accessorKey: 'Description' }
    ];

    const isGlobalLoading = isDoctorsLoading || isVisitsLoading || isVisitDetailFetching;

    return (
        <Pagewrapper isLoading={isGlobalLoading} direction='vertical' gap={4} alignTop className="!pb-10">
            <Title PageName={t('Pages.Reports.DoctorReport.Header', 'Doktor Performans Raporu')} />
            <Segment raised className="!rounded-xl w-full">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <label className="font-semibold text-gray-700 text-lg">
                        <Icon name="user doctor" className="text-primary" /> {t('Pages.Reports.DoctorReport.SelectDoctor', 'Doktor Seçiniz:')}
                    </label>
                    <Dropdown
                        placeholder={t('Pages.Reports.DoctorReport.DoctorPlaceholder', 'Raporunu görmek istediğiniz doktoru seçin')}
                        fluid
                        search
                        selection
                        options={doctorOptions}
                        value={selectedDoctorId || ''}
                        onChange={(_, data) => setSelectedDoctorId(data.value as string)}
                        loading={isDoctorsLoading}
                        className="max-w-md"
                    />
                </div>
            </Segment>

            {selectedDoctorId ? (
                <Contentwrapper >
                    <Grid columns={5} doubling stackable>
                        <Grid.Row>
                            <Grid.Column>
                                <Card fluid className="!rounded-xl !border-0 !shadow">
                                    <Card.Content>
                                        <Statistic size="tiny" color="blue">
                                            <Statistic.Value>{reportMetrics.totalVisits}</Statistic.Value>
                                            <Statistic.Label>{t('Pages.Reports.DoctorReport.TotalVisits', 'Toplam Vizit')}</Statistic.Label>
                                        </Statistic>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column>
                                <Card fluid className="!rounded-xl !border-0 !shadow">
                                    <Card.Content>
                                        <Statistic size="tiny" color="green">
                                            <Statistic.Value>{reportMetrics.completedVisits}</Statistic.Value>
                                            <Statistic.Label>{t('Pages.Reports.DoctorReport.CompletedVisits', 'Tamamlanan')}</Statistic.Label>
                                        </Statistic>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column>
                                <Card fluid className="!rounded-xl !border-0 !shadow">
                                    <Card.Content>
                                        <Statistic size="tiny" color="teal">
                                            <Statistic.Value>{currencyFormatter(reportMetrics.totalScheduledPayment)}</Statistic.Value>
                                            <Statistic.Label>{t('Pages.Reports.DoctorReport.TotalRevenue', 'Yazılan Toplam Ciro')}</Statistic.Label>
                                        </Statistic>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column>
                                <Card fluid className="!rounded-xl !border-0 !shadow">
                                    <Card.Content>
                                        <Statistic size="tiny" color="red">
                                            <Statistic.Value>{currencyFormatter(reportMetrics.totalRemainingDebt)}</Statistic.Value>
                                            <Statistic.Label>{t('Pages.Reports.DoctorReport.RemainingDebt', 'Kalan Toplam Tahsilat')}</Statistic.Label>
                                        </Statistic>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                            <Grid.Column>
                                <Card fluid className="!rounded-xl !border-0 !shadow">
                                    <Card.Content>
                                        <Statistic size="tiny" color="green">
                                            <Statistic.Value>{currencyFormatter(reportMetrics.totalCompletedDebt)}</Statistic.Value>
                                            <Statistic.Label>{t('Pages.Reports.DoctorReport.CompletedDebt', 'Tamamlanan Toplam Tahsilat')}</Statistic.Label>
                                        </Statistic>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Grid columns={2} doubling stackable>
                        <Grid.Row>
                            <Grid.Column width={16}>
                                <Card fluid className="!rounded-xl !border-0 !shadow">
                                    <Card.Content header={t('Pages.Reports.DoctorReport.ActiveStatus', 'Aktif Süreç Dağılımı')} />
                                    <Card.Content>
                                        <div className="flex gap-4">
                                            <Label color="red" size="large">
                                                {t('Option.VisitStatu.Planned')}: {reportMetrics.plannedVisits}
                                            </Label>
                                            <Label color="blue" size="large">
                                                {t('Option.VisitStatu.Working')}: {reportMetrics.workingVisits}
                                            </Label>
                                        </div>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    <Segment raised className="!rounded-xl  overflow-hidden p-10">
                        <div className="p-4 bg-gray-50 border-b font-semibold text-gray-700">
                            <Icon name="list" /> {t('Pages.Reports.DoctorReport.VisitsTableTitle', 'Doktora Ait Vizit Detayları')}
                        </div>
                        <DataTable
                            columns={columns}
                            data={filteredVisits}
                        />
                    </Segment>
                </Contentwrapper>
            ) : (
                <Message info className="!rounded-xl">
                    <Message.Header>{t('Pages.Reports.DoctorReport.InfoTitle', 'Veri Görüntüleme')}</Message.Header>
                    <p>{t('Pages.Reports.DoctorReport.InfoDesc', 'Lütfen rapor detaylarını, operasyonel metrikleri ve vizit listesini analiz etmek için yukarıdan bir doktor seçimi yapın.')}</p>
                </Message>
            )}
            <DoctorReportNoteModal
                open={notesModalOpen}
                setOpen={setNotesModalOpen}
                notes={activeNotes}
                visitCode={activeVisitCode}
            />
        </Pagewrapper>
    );
};

export default DoctorReport;