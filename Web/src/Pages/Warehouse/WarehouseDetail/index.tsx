import Pagewrapper from '@Components/Common/Pagewrapper'
import Title from '@Components/Common/Title'
import Paths from '@Constant/path'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Card, Divider, Icon, Search, Pagination } from 'semantic-ui-react' // Pagination eklendi
import { useNavigate, useParams } from 'react-router-dom'
import { useLazyGetWarehouseQuery } from '@Api/Warehouse'
import validator from '@Utils/Validator'
import Pushnotification from '@Utils/Pushnotification'
import Contentwrapper from '@Components/Common/Contentwrapper'
import NotfoundScreen from '@Components/Common/NotfoundScreen'
import { useGetStocksQuery } from '@Api/Stock'
import { useGetStockdefinesQuery } from '@Api/Stockdefine'
import { FormatFullDate } from '@Utils/FormatDate'
import WarehouseDetailMovementFeed from '@Components/Warehouse/WarehouseDetail/WarehouseDetailMovementFeed'
import FormButton from '@Components/Common/FormButton'
import RouteKeys from '@Constant/routeKeys'
import privileges from '@Constant/privileges'
import styles from './style.module.scss'

const WarehouseDetail: React.FC = () => {
    const { t } = useTranslation()
    const { Id } = useParams();
    const navigate = useNavigate()

    const [searchWord, setSearchWord] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 12

    const [GetWarehouse, { data: warehouse, isFetching }] = useLazyGetWarehouseQuery()
    const { data: stocks, isFetching: isStocksFetching } = useGetStocksQuery(
        { isActive: 1, WarehouseID: warehouse?.Uuid },
        { skip: !validator.isUUID(warehouse?.Uuid) }
    )
    const { data: stockdefines, isFetching: isStockdefinesFetching } = useGetStockdefinesQuery(
        { isActive: 1 },
        { skip: !validator.isUUID(warehouse?.Uuid) }
    )

    const getStockdefineName = (id: string) => {
        const sd = (stockdefines || []).find(d => d.Uuid === id)
        return sd ? `${sd.Brand} ${sd.Productname}` : '-'
    }

    const filteredStocks = (stocks || []).filter(stock => {
        if (!searchWord) return true
        const decoratedSearchWord = searchWord.trim().toLocaleLowerCase('tr').replace(/\s+/g, '')
        const stockdefineName = getStockdefineName(stock.StockdefineID)
        const decoratedTargetTitle = stockdefineName.trim().toLocaleLowerCase('tr').replace(/\s+/g, '')
        return decoratedTargetTitle.includes(decoratedSearchWord)
    })

    const totalPages = Math.ceil(filteredStocks.length / itemsPerPage)
    const indexOfLastItem = currentPage * itemsPerPage
    const indexOfFirstItem = indexOfLastItem - itemsPerPage
    const currentItems = filteredStocks.slice(indexOfFirstItem, indexOfLastItem)

    const activeProductCount = (stocks || []).length
    const totalAmount = (stocks || []).reduce((sum, s) => sum + (validator.isNumber(s.TotalAmount) ? Number(s.TotalAmount) : 0), 0)

    useEffect(() => {
        setCurrentPage(1)
    }, [searchWord])

    useEffect(() => {
        if (Id && validator.isUUID(Id)) {
            GetWarehouse({ Uuid: Id })
                .unwrap()
                .catch(() => {
                    navigate(Paths.Warehouses);
                });
        } else {
            Pushnotification({
                Type: 'Error',
                Subject: t('Pages.Warehouses.Page.Header'),
                Description: t('Pages.Warehouses.Messages.UndefinedWarehouse'),
            });
            navigate(Paths.Warehouses);
        }
    }, [Id, GetWarehouse, navigate, t]);

    return (
        <Pagewrapper isLoading={isFetching || isStocksFetching || isStockdefinesFetching} direction="vertical" gap={4} alignTop>
            <Title
                PageName={t('Pages.Warehouses.Page.Header')}
                PageUrl={Paths.Warehouses}
                AdditionalName={warehouse?.Name}
            />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full"
            >
                <Card fluid className="!rounded-2xl !shadow-lg !border-0 !bg-white mb-8 !p-5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                        <div className="flex flex-col gap-2">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 ">
                                <Icon name="warehouse" className="text-primary" size="large" />
                                {warehouse?.Name}
                            </h2>
                            {warehouse?.Description && (
                                <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
                                    {warehouse.Description}
                                </p>
                            )}
                        </div>
                        <div className="flex flex-col gap-2 text-sm text-gray-700 ml-auto bg-gray-50 px-4 py-3 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-2">
                                <Icon name="boxes" className="text-primary" />
                                {t('Pages.Warehouses.Label.ActiveProducts')}: {activeProductCount}
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="cubes" className="text-primary" />
                                {t('Pages.Warehouses.Label.TotalAmount')}: {totalAmount}
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="calendar plus" className="text-primary" />
                                {t('Common.Columns.Createtime')}: {FormatFullDate(warehouse?.Createtime)}
                            </div>
                            <div className="flex items-center gap-2">
                                <Icon name="user" className="text-primary" />
                                {t('Common.Columns.Createduser')}: {warehouse?.Createduser || t('Common.Unknown')}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-end gap-3 mt-6 border-t border-gray-100 pt-4">
                        <FormButton
                            icon
                            secondary
                            showChildren
                            labelPosition="left"
                            onClick={() => navigate(Paths.Warehouses)}
                            text=''
                        >
                            <Icon name="arrow left" />
                            {t('Common.Button.Goback')}
                        </FormButton>

                        <FormButton
                            role={privileges.warehouseupdate}
                            icon
                            text=''
                            showChildren
                            labelPosition="left"
                            color="blue"
                            onClick={() => navigate(`/${RouteKeys.Warehouses}/${warehouse?.Uuid}/edit`)}
                        >
                            <Icon name="edit" />
                            {t('Common.Button.Edit')}
                        </FormButton>
                        <FormButton
                            role={privileges.warehouseupdate}
                            icon
                            text=''
                            showChildren
                            labelPosition="left"
                            color="blue"
                            onClick={() => navigate(`${Paths.StocksCreate}?returnUrl=${Paths.Warehouses}/${Id}/Detail&WarehouseID=${Id}`)}
                        >
                            <Icon name="edit" />
                            {t('Pages.Stocks.Page.CreateHeader')}
                        </FormButton>
                    </div>
                </Card>
            </motion.div>

            <Contentwrapper>
                <div className="flex justify-between items-center mb-4">
                    <Title PageName={t('Pages.Warehouses.Label.Stocks')} isDividerHide />
                    <Search
                        input={{ icon: 'search', iconPosition: 'left' }}
                        placeholder={t('Components.LayoutNaviationSearch.Placeholder')}
                        className={styles.menusearch}
                        showNoResults={false}
                        loading={isFetching}
                        onSearchChange={(_, data) => {
                            setSearchWord(data.value ?? '')
                        }}
                        value={searchWord}
                    />
                </div>
                <Divider />
                {filteredStocks.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentItems.map(stock => (
                                <motion.div key={stock.Uuid} layout>
                                    <Card
                                        onClick={() => navigate(`${Paths.Stocks}/${stock.Uuid}/Movements`)}
                                        link fluid
                                        className="!rounded-xl !shadow-lg hover:!shadow-md !border border-gray-100 !bg-white transition-all duration-300"
                                    >
                                        <Card.Content>
                                            <div className="flex justify-between items-center">
                                                <div className="flex flex-col gap-1">
                                                    <h3 className="text-lg font-semibold text-gray-800">
                                                        {getStockdefineName(stock.StockdefineID)}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm">
                                                        {t('Pages.Stocks.Columns.TotalAmount')}: {stock.TotalAmount}
                                                    </p>
                                                </div>
                                                <Icon name="box" size="large" className="text-primary opacity-70" />
                                            </div>
                                        </Card.Content>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-10">
                                <Pagination
                                    activePage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(_, { activePage }) => setCurrentPage(activePage as number)}
                                    boundaryRange={1}
                                    siblingRange={1}
                                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    pointing
                                    secondary
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <NotfoundScreen text={t('Pages.Warehouses.Label.NoStocks')} />
                )}
            </Contentwrapper>

            <WarehouseDetailMovementFeed WarehouseID={warehouse?.Uuid} />
        </Pagewrapper>
    )
}

export default WarehouseDetail