import { useEffect, useState } from 'react'
import { useUserStore } from '../../store/useStore'
import { LoaderMini } from './Loader/LoaderComponent'

import IconAlterStar from '@/assets/icons/icon-alter-star.svg?react'

export const ScoreUpdate = () => {
    const { balanceUpdate, setBalance } = useUserStore()
    const [save, setSave] = useState()

    useEffect(() => {
        if (balanceUpdate > 0) setSave(balanceUpdate)
    }, [balanceUpdate])

    return (
        <div id="score-update" style={{ opacity: balanceUpdate ? 0.6 : 0 }}>
            <IconAlterStar className='icon-invert' width={16} height={16} />
            <span className='white-text' style={{ fontSize: 14 }}>{save > 0 ? '+' : ''}{save}</span>
        </div>
    )
}

function Score({ value, filled, color, icon, size, update }) {
    return (
        <div className={`score ${filled ? 'score-filled' : ''}`}>
            {icon && icon}
            {(value !== null && value !== undefined) ? (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={color === 'white' ? 'white-text' : 'default-text'} style={{ fontWeight: 700, fontSize: size ? size : 16, lineHeight: 0.7 }}>
                        {value}
                    </span>
                </div>
            ) : <LoaderMini />}
            {update && <ScoreUpdate />}
        </div>
    )
}

export default Score