import { useLogoutMutation } from '@Api/Auth'
import { logoutByUser } from '@Api/Auth/slice'
import { useGetMetaQuery } from '@Api/Profile'
import { ProfileMetaResponse } from '@Api/Profile/type'
import FormButton from '@Components/Common/FormButton'
import Paths from '@Constant/path'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Confirm, Dropdown, Icon } from 'semantic-ui-react'

const LayoutNavigationUser: React.FC = () => {

    const dispatch = useDispatch()
    const { t } = useTranslation()
    const [open, setOpen] = useState(false)

    const { data: meta } = useGetMetaQuery()
    const [Logout, { isLoading }] = useLogoutMutation()
    const { Username, Roles, Uuid } = meta || {} as ProfileMetaResponse
    const auth = useSelector((state: any) => state.auth)

    const trigger = (
        <div className='flex flex-row justify-center items-center select-none'>
            <Icon name='user' className='text-white' />
            <div className={`h-[58.61px] text-white mx-4 my-auto transition-all ease-in-out duration-500  text-center flex flex-col justify-center items-center `}>
                <p className='m-0 text-sm font-semibold tracking-wider font-Common '>{Username || t('Common.NoDataFound')}</p>
                <p className='m-0 text-xs text-white dark:text-TextColor  '>
                    <span className='mr-[2px]'>{(Roles || []).length > 0 && Roles.map(u => u.Name).join(',')}</span>
                </p>
            </div>
        </div>
    )

    return <React.Fragment>
        <Dropdown icon={null} trigger={trigger} basic loading={isLoading}>
            <Dropdown.Menu className='!right-[1%] !left-auto'>
                <Dropdown.Item>
                    <Link to={`${Paths.Users}/${Uuid}`} className='text-[#3d3d3d] hover:text-[#3d3d3d]'><Icon className='id card ' />{t('Navbar.Label.Profile')}</Link>
                </Dropdown.Item>
                <Dropdown.Item>
                    <Link to={Paths.ChangePassword} className='text-[#3d3d3d] hover:text-[#3d3d3d]'> <Icon className='lock' />{t('Navbar.Label.Changepassword')}</Link>
                </Dropdown.Item>
                <Dropdown.Item className='layout-menu-item logout' onClick={() => setOpen(true)}>
                    <Button>{t('Navbar.Label.Exit')}</Button>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
        <Confirm
            open={open}
            header='Uygulamadan Çıkmak Üzeresiniz'
            content={t('Navbar.Label.ExitWarning')}
            onConfirm={() => {
                Logout({
                    accessToken: auth?.accessToken ?? ''
                })
                    .unwrap()
                    .then(() => {
                        dispatch(logoutByUser())
                    })
            }}
            onCancel={() => setOpen(false)}
            confirmButton={<FormButton className='!m-2' text={t('Common.Yes')} />}
            cancelButton={<FormButton className='!m-2' secondary text={t('Common.No')} />}
        />
    </React.Fragment>
}
export default LayoutNavigationUser