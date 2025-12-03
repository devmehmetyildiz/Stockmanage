import { useGetPrivilegesQuery } from '@Api/Profile'
import { getSidebarRoutes } from '@Components/Layout/LayoutSidebar'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Search } from 'semantic-ui-react'
import styles from './style.module.scss'
import Paths from '@Constant/path'
import { useGetVisitsQuery } from '@Api/Visit'

const LayoutNaviationSearch: React.FC = () => {

    const { t } = useTranslation()
    const navigate = useNavigate()
    const [searchWord, setSearchWord] = useState('')

    const { data, isFetching } = useGetPrivilegesQuery()
    const { data: visits, isFetching: isVisitsFetching } = useGetVisitsQuery()

    const userPrivileges = data || [] as string[]

    const pages = getSidebarRoutes(t, userPrivileges)

    const sidebarRoutes = pages.flatMap(section => {
        return section.items.filter(u => u.permission)
    })

    const baseSearchdata = sidebarRoutes.map(u => {
        return { title: u.subtitle, url: u.url, key: Math.random() }
    }).concat((visits || []).map(visit => {
        return { title: visit.Visitcode, url: `${Paths.Visits}/${visit.Uuid}/Detail`, key: Math.random() }
    }))

    const searchdata = baseSearchdata.filter(u => {
        const decoratedSearchWord = searchWord.trim().toLocaleLowerCase('tr').replace(/\s+/g, '')
        const decoratedTargetTitle = (u.title || '').trim().toLocaleLowerCase('tr').replace(/\s+/g, '')
        return decoratedTargetTitle.includes(decoratedSearchWord)
    })

    return <Search
        input={{ icon: 'search', iconPosition: 'left' }}
        placeholder={t('Components.LayoutNaviationSearch.Placeholder')}
        className={styles.menusearch}
        loading={isFetching || isVisitsFetching}
        noResultsMessage={t('Components.LayoutNaviationSearch.NoResult')}
        onResultSelect={(_, data) => {
            setSearchWord('')
            navigate(data.result.url)
        }}
        onSearchChange={(_, data) => {
            setSearchWord(data.value ?? '')
        }}
        results={searchdata}
        value={searchWord}
    />
}
export default LayoutNaviationSearch