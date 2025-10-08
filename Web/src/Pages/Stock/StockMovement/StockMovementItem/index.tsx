import React from 'react'
import { Icon, SemanticICONS } from 'semantic-ui-react'

interface StockMovementItemProps {
    icon: SemanticICONS
    label: string
    value?: string
    isGray?: boolean
}

const StockMovementItem: React.FC<StockMovementItemProps> = ({ icon, label, value, isGray }) => {

    return <div className="flex items-center gap-2">
        <Icon name={icon} className={`${isGray ? '' : 'text-primary'}`} color={isGray ? 'grey' : undefined} />
        <span>{`${label}  :`}</span>
        <strong className="text-gray-900">{value}</strong>
    </div>
}
export default StockMovementItem