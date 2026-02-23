import '../../styles/DepWith.css'

import { useState } from 'react'
import { useContentStore, useUserStore } from '../../store/useStore'

import IconWarning from '../../assets/icons/icon-warning.svg?react'
import IconStar from '../../assets/icons/icon-star.svg?react'
import Score from '../utility/Score'
import { Trans, useTranslation } from 'react-i18next'

function Withdraw() {
    const { withdrawPack, withdrawFee, withdrawMin } = useContentStore()
    const { t } = useTranslation()
    const [amount, setAmount] = useState(0)
    const [selected, setSelected] = useState('')
    const { balance } = useUserStore()

    const handleSelectPack = (pack, id) => {
        setSelected(id)
        setAmount(pack.amount)
    }

    const handleClear = () => {
        setSelected('')
        setAmount(0)
    }

    return (
        <div id="withdraw">
            <span className='secondary-text'>{t('definition.withdraw')}</span>
            <div id='withdraw-info'>
                <span className='secondary-text'>Fee: {withdrawFee}%</span>
                <span className='secondary-text'>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className='secondary-text'>Minimum:</span>
                    <Score value={withdrawMin} icon={<IconStar width={18} height={18} />} filled={true} />
                </div>
            </div>
            <div id='withdraw-list'>
                {withdrawPack.map((pack, i) => {
                    const id = pack.amount + 'stars'
                    const check = selected === id
                    return (
                        <div key={i} className={`withdraw-pack ${check ? 'pack-selected' : ''}`} onClick={() => handleSelectPack(pack, id)}>
                            <Score value={pack.amount} icon={<IconStar width={18} height={18} />} />
                        </div>
                    )
                })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className='button-main b-b' style={{ width: '100%' }} disabled={amount === 0}>
                    <span className="white-text">{t('button.withdraw')}</span>
                    <Score value={amount} color={'white'} icon={<IconStar width={18} height={18} />} />
                </button>
                <button className='button-secondary' style={{ width: '100%' }} onClick={handleClear}>
                    <span>{t('button.clear')}</span>
                </button>
            </div>
        </div>
    )
}

export default Withdraw