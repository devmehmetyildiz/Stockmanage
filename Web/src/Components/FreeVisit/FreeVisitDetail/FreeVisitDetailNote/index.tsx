import { VisitItem } from '@Api/Visit/type'
import Contentwrapper from '@Components/Common/Contentwrapper'
import Title from '@Components/Common/Title'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Icon, Message, } from 'semantic-ui-react'

interface FreeVisitDetailNoteProps {
    data: VisitItem | undefined
}

const FreeVisitDetailNote: React.FC<FreeVisitDetailNoteProps> = (props) => {

    const { data, } = props
    const { t } = useTranslation()


    const notes = data?.Notes || []
    const hasNotes = notes && Array.isArray(notes) && notes.length > 0

    return <Contentwrapper bottomRounded className="flex-1">
        <Title PageName={t('Pages.Visits.Label.NoteTitle')} />
        {!hasNotes && (
            <Message info>
                <Message.Header>{t('Common.NoDataFound')}</Message.Header>
                <p className="m-0">{t('Pages.Visits.Messages.NoNotes')}</p>
            </Message>
        )}

        {hasNotes && (
            <div className="flex flex-col w-full justify-start items-start gap-3 mt-3 ">
                {notes.map((note, index) => {
                    return (<div className='w-full ' key={index}>
                        <Card
                            fluid
                            className="!bg-red-30 !rounded-xl !shadow !border-0 "
                        >
                            <Card.Content>
                                <div className="flex items-start justify-between gap-1">
                                    <div className="flex items-center gap-2">
                                        <div className='mb-1'>
                                            <Icon name="cube" className='text-primary' />
                                        </div>
                                        <div className="font-semibold text-gray-800">{note}</div>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>
                    </div>

                    );
                })}
            </div>
        )}
    </Contentwrapper>
}
export default FreeVisitDetailNote