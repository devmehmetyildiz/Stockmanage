import React from 'react'
import { Icon, SemanticICONS } from 'semantic-ui-react'

interface VisitDetailLabelProps {
    icon: SemanticICONS
    label: string
    value?: string
    isGray?: boolean
}

const VisitDetailLabel: React.FC<VisitDetailLabelProps> = ({ icon, label, value, isGray }) => {

    return <div className="flex items-center gap-2 text-nm">
        <div className='flex justify-center items-center mb-1'>
            <Icon name={icon} className={`${isGray ? '' : 'text-primary'}`} color={isGray ? 'grey' : undefined} />
        </div>
        <span>{`${label}  :`}</span>
        <strong className="text-gray-900">{value}</strong>
    </div>
}
export default VisitDetailLabel