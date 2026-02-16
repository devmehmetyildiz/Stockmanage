import React, { useState } from 'react'
import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import { useTranslation } from 'react-i18next'
import ChangeLogs from './Changelogs'
import { Accordion, Divider, Header, Icon, Segment, Transition } from 'semantic-ui-react'
import AboutDetail from '@Components/About/AboutDetail'
import './About.css'

const About: React.FC = () => {

    const { t } = useTranslation()

    const [activeIndex, setActiveIndex] = useState<string[]>([])

    return <Pagewrapper direction='vertical' gap={4} alignTop>
        <Title
            PageName={t('Appname')}
            PageUrl={Paths.Main}
            AdditionalName={t('Pages.About.Page.Header')}
        />
        <Transition transitionOnMount={true} animation='fade down' duration={300} className="w-full">
            <Segment className='about-page-bottom-segment w-full' >
                <Header as='h3' className='change-log-header'>
                    <Icon name='code branch' />{t('Pages.About.Message.Versions')}
                </Header>
                <Segment className='change-log-wrapper '>
                    <div className='time-line '>
                        {
                            ChangeLogs && ChangeLogs.length > 0 ?
                                ChangeLogs.map((item, key) => {
                                    const isOpened = activeIndex.find(u => u === item.version) ? true : false;
                                    return (<div key={key} className='time-line-item '>
                                        <Accordion>
                                            <Accordion.Title
                                                active={isOpened ? true : false}
                                                index={0}
                                                onClick={() => {
                                                    isOpened ? setActiveIndex(activeIndex.filter(u => u !== item.version)) :
                                                        setActiveIndex([...activeIndex, item.version])
                                                }}>
                                                <div className='time-line-item-marker '>
                                                    <div className={`time-line-item-marker-text `} >{`${t('Pages.About.Message.Version')} ${item.version} - ${new Date(item.date).toLocaleDateString('tr')}`}<Icon name={isOpened ? 'angle up' : 'angle down'} /></div>
                                                    <Divider />
                                                </div>
                                            </Accordion.Title>
                                            <Accordion.Content active={isOpened}>
                                                <div className='time-line-item-content'>
                                                    <AboutDetail
                                                        tag={item.version + 'feature'}
                                                        type={'feature'}
                                                        title={t('Pages.About.Message.Feature')}
                                                        items={(item?.features || [])}
                                                    />
                                                    <AboutDetail
                                                        tag={item.version + 'change'}
                                                        type={'change'}
                                                        title={t('Pages.About.Message.Change')}
                                                        items={(item?.changes || [])}
                                                    />
                                                    <AboutDetail
                                                        tag={item.version + 'bug'}
                                                        type={'bug'}
                                                        title={t('Pages.About.Message.Bug')}
                                                        items={(item?.bugs || [])}
                                                    />
                                                    <AboutDetail
                                                        tag={item.version + 'no-issue'}
                                                        type={'no-issue'}
                                                        title={t('Pages.About.Message.Noissue')}
                                                        items={(item?.withoutIssues || [])}
                                                    />
                                                </div>
                                            </Accordion.Content>
                                        </Accordion>
                                    </div>)
                                }
                                ) : null
                        }
                    </div>
                </Segment>
            </Segment>
        </Transition>

    </Pagewrapper>
}
export default About