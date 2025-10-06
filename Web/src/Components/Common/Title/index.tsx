import React, { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Breadcrumb, Divider, Grid, Header, SemanticICONS } from 'semantic-ui-react'
import TitleExcelExport from './TitleExcelExport'
import FormButton from '../FormButton'
import TitleAdditonalButtons from './TitleAdditonalButtons'
import useMobile from '@Hooks/useMobile'

export interface TitleAdditionalButtonType {
    name?: string
    onClick: any
    iconOnly?: boolean
    icon?: SemanticICONS | undefined
    hidden?: boolean
    disabled?: boolean
    disabledCouseText?: string
    secondary?: boolean
}

interface TitleProps {
    PageName: string | React.ReactElement
    AdditionalName?: string
    isAdditionalNameString?: boolean
    PageUrl?: string
    excelExportName?: string
    create?: {
        Pagecreatelink: string
        Pagecreateheader: string
    }
    additionalButtons?: TitleAdditionalButtonType[]
    additionalButtonLeftAling?: boolean
    additionalButtonNoWrap?: boolean
    isDividerHide?: boolean
}

const Title: React.FC<PropsWithChildren<TitleProps>> = ({ PageName, PageUrl, excelExportName, create, AdditionalName, additionalButtons, additionalButtonLeftAling, isAdditionalNameString, additionalButtonNoWrap, isDividerHide, children }) => {

    //TODO column chooser ekle
    const { isTablet, isMobileLarge } = useMobile()

    return <div className='w-full mx-auto align-middle'>
        <Header className='!text-secondary !bg-transparent !border-none' as='h1' attached='top' >
            <Grid stackable={!additionalButtonNoWrap} columns={isTablet ? 1 : 2} >
                <Grid.Column width={8}>
                    <Breadcrumb size='big'>
                        {PageUrl ? <Link to={PageUrl} className='!text-secondary hover:!text-primary transition-all ease-in-out duration-200'>
                            <Breadcrumb.Section>{PageName}</Breadcrumb.Section>
                        </Link>
                            : <Breadcrumb.Section>{PageName}</Breadcrumb.Section>}
                        {AdditionalName &&
                            <React.Fragment>
                                <Breadcrumb.Divider icon='right chevron' />
                                <Breadcrumb.Section>{isAdditionalNameString ? AdditionalName : AdditionalName}</Breadcrumb.Section>
                            </React.Fragment>}
                    </Breadcrumb>
                </Grid.Column>
                <Grid.Column width={8}>
                    {additionalButtons && additionalButtonLeftAling && <TitleAdditonalButtons leftAling additionalButtons={additionalButtons} />}
                    <div className={`flex flex-row flex-wrap gap-2  items-center ${isMobileLarge ? 'justify-start' : 'justify-end'}`}>
                        {additionalButtons && !additionalButtonLeftAling && <TitleAdditonalButtons additionalButtons={additionalButtons} />}
                        <TitleExcelExport
                            name={excelExportName ?? ''}
                        />
                        {create && <Link className="pr-1" to={create.Pagecreatelink}>
                            <FormButton
                                text={create.Pagecreateheader}
                            />
                        </Link>}
                    </div>
                </Grid.Column>
            </Grid>
        </Header>
        {children}
        {isDividerHide ? null : <Divider />}
    </div>
}

export default Title