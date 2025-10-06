import React from 'react'
import { Dimmer, DimmerDimmable, Loader, Transition } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import validator from '@Utils/Validator'
import styles from './style.module.scss'

interface PagewrapperProps {
    isLoading?: boolean
    className?: string
    fullscreen?: boolean
    children: React.ReactNode
    direction?: 'vertical' | 'horizontal'
    alignTop?: boolean
    gap?: number
    dynamicHeight?: boolean
    wrap?: boolean
    padding?: number
}

const Pagewrapper: React.FC<PagewrapperProps> = (props) => {

    const { className, fullscreen, children, direction, alignTop, gap, isLoading, dynamicHeight, wrap, padding } = props

    const { t } = useTranslation()

    const isHavePadding = validator.isNumber(padding)

    const getDirection = () => {
        if (direction === 'horizontal') {
            return 'flex-row'
        } else if (direction === 'vertical') {
            return 'flex-col'
        } else {
            return 'flex-col'
        }
    }

    const getGap = () => {
        if (gap) {
            return `gap-${gap}`
        } else {
            return ''
        }
    }

    return fullscreen
        ? <div
            className={` w-full flex ${alignTop ? 'justify-start items-start' : 'justify-center items-center'}  ${gap && getGap()} ${getDirection()} ${fullscreen ? ' h-screen ' : `  ${isHavePadding ? '' : 'px-6 py-4'} ${dynamicHeight ? 'h-auto' : 'h-contentScreen'}`} ${className ?? ''} ${wrap ? ' flex-wrap ' : ''}`}
            style={{ padding: isHavePadding ? `${padding}px !important` : undefined }}
        >
            {children}
        </div>
        : <Transition transitionOnMount animation='fade right' duration={500}>
            <DimmerDimmable className={styles.main} blurring dimmed={isLoading}>
                <Dimmer active={isLoading} inverted>
                    <Loader content={t('Loading')} />
                </Dimmer>
                <div
                    className={`w-full flex  ${alignTop ? 'justify-start items-start' : 'justify-center items-center'}  ${gap && getGap()} ${getDirection()} ${fullscreen ? ' h-screen ' : ` ${isHavePadding ? '' : 'px-6 py-4'} ${dynamicHeight ? 'h-auto' : 'h-contentScreen'}`} ${className ?? ''} ${wrap ? ' flex-wrap ' : ''}`}
                    style={{ padding: isHavePadding ? `${padding}px !important` : undefined }}
                >
                    {children}
                </div>
            </DimmerDimmable>
        </Transition>


}
export default Pagewrapper