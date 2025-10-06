import { useGetMetaQuery } from '@Api/Profile'
import useMobile from '@Hooks/useMobile'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LayoutNavigationTitle: React.FC = () => {

    const { isMobileLarge, isSmallerThanBreakpoint } = useMobile(900)
    const navigate = useNavigate()
    const { data: meta } = useGetMetaQuery()
    const url = meta?.Defaultpage

    return <div className='absolute inset-0 -z-10 flex  justify-center items-center group' >
        <div className='flex flex-row justify-center items-center group cursor-pointer'
            onClick={() => {
                if (url) {
                    navigate(url)
                }
            }}>
            <p className='select-none m-0 font-Common font-bold text-[1.84em] line-none text-white dark:text-TextColor'>{isMobileLarge || isSmallerThanBreakpoint ? 'S' : 'STO'}</p>
            <p className='select-none m-0 font-Common font-bold text-[1.84em] line-none text-[#7eabc5] dark:text-TextColor'>{isMobileLarge ? 'V' : 'VIRA'}</p>
        </div>
    </div>
}
export default LayoutNavigationTitle