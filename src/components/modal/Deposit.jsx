import '../../styles/DepWith.css'

import { useState } from 'react'
import { useContentStore, useUserStore } from '../../store/useStore'
import IconStar from '../../assets/icons/icon-star.svg?react'
import Score from '../utility/Score'
import { Trans, useTranslation } from 'react-i18next'

function Deposit() {
    const { depositPack, depositFee, depositMin } = useContentStore()
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
        <div id="deposit">
            <span className='secondary-text'>{t('definition.deposit')}</span>
            <div id='deposit-info'>
                <span className='secondary-text'>Fee: {depositFee}%</span>
                <span className='secondary-text'>·</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span className='secondary-text'>Minimum:</span>
                    <Score value={depositMin} icon={<IconStar width={18} height={18} />} filled={true} />
                </div>
            </div>
            <div id='deposit-list'>
                {depositPack.map((pack, i) => {
                    const id = pack.amount + 'stars'
                    const check = selected === id
                    return (
                        <div key={i} className={`deposit-pack ${check ? 'pack-selected' : ''}`} onClick={() => handleSelectPack(pack, id)}>
                            <Score value={pack.amount} icon={<IconStar width={18} height={18} />} />
                        </div>
                    )
                })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className='button-main b-g' style={{ width: '100%' }} disabled={amount === 0}>
                    <span className="white-text">{t('button.buy')}</span>
                    <Score value={amount} color={'white'} icon={<IconStar width={18} height={18} />} />
                </button>
                <button className='button-secondary' style={{ width: '100%' }} onClick={handleClear}>
                    <span>{t('button.clear')}</span>
                </button>
            </div>
        </div>
    )
}

export default Deposit