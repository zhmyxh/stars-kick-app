import IconStar from '../../assets/icons/icon-star.svg?react'
import { LoaderMini } from './Loader/LoaderComponent'

function Score({ value, filled, color, icon, size }) {
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
        </div>
    )
}

export default Score