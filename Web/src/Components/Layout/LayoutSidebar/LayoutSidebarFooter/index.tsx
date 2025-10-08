import imgs from '@Assets/img'
import config from '@Constant/config'
import Paths from '@Constant/path'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Image } from 'semantic-ui-react'

//TODO .ENV DEN FİRMA İMAGE YÜKLEME EKLENECEK
interface LayoutSidebarFooterProps {
    visible: boolean
    setVisible: React.Dispatch<React.SetStateAction<boolean>>
}

const LayoutSidebarFooter: React.FC<LayoutSidebarFooterProps> = ({ visible, setVisible }) => {

    const navigate = useNavigate()

    return <div className='flex justify-center pb-5' onClick={() => {
        navigate(Paths.About)
        setVisible(false)
    }}>
        {!visible ? (
            <div className='cursor-pointer flex flex-col justify-center items-center gap-4   rounded-2xl  transition-all ease-in-out duration-500' >
                <Image src={imgs.logo} className='w-18 h-18' />
            </div>
        ) : (
            <div className='cursor-pointer flex flex-col justify-center items-center gap-4  p-4 bg-primary rounded-2xl hover:shadow-md hover:shadow-primary transition-all ease-in-out duration-500' >
                <div className='flex flex-row justify-center items-center group cursor-pointer'>
                    <p className='select-none m-0 font-Common font-bold text-lg line-none text-white dark:text-TextColor'>STO</p>
                    <p className='select-none m-0 font-Common font-bold text-lg line-none text-[#7eabc5] dark:text-TextColor'>VIRA</p>
                </div>
                <div className='bg-white rounded-full p-2'>
                    <Image src={imgs.logo} className='w-24 h-24 ' />
                </div>
                <div className='flex flex-row justify-center items-center group cursor-pointer'>
                    <p className='select-none m-0 font-Common font-bold text-lg line-none text-white dark:text-TextColor'>V{config.version}</p>
                </div>
            </div>
        )}
    </div>
}
export default LayoutSidebarFooter