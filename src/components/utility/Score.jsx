import IconStar from '../../assets/icons/icon-star.svg?react'

function Score({ value, filled, color, icon }) {
    return (
        <div className={`score ${filled ? 'score-filled' : ''}`}>
            {icon && icon}
            {(value !== null && value !== undefined) ? (
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className={color === 'white' ? 'white-text' : 'default-text'} style={{ fontWeight: 700 }}>{value}</span>
                </div>
            ) : <div className='loader-2'></div>}
        </div>
    )
}

export default Score