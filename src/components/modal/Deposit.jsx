import '../../styles/DepWith.css'

import React, { useState } from 'react'
import { useContentStore } from '../../store/useStore'
import Score from '../utility/Score'
import { Trans, useTranslation } from 'react-i18next'

function Deposit() {
    const { depositPack } = useContentStore()
    const { t } = useTranslation()
    const [amount, setAmount] = useState(0)
    const [selected, setSelected] = useState('')

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
            <span className='secondary-text'>Select the amount of stars you want to add to your game balance.</span>
            <div id='deposit-list'>
                {depositPack.map((pack, i) => {
                    const id = pack.amount + 'stars'
                    const check = selected === id
                    return (
                        <div key={i} className={`deposit-pack ${check ? 'pack-selected' : ''}`} onClick={() => handleSelectPack(pack, id)}>
                            {pack.ad && (
                                <div className='deposit-ad'>
                                    <span className='white-text' style={{ fontSize: 12 }}>Best choice! -25%</span>
                                </div>
                            )}
                            <Score value={pack.amount} />
                        </div>
                    )
                })}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <span className='secondary-text'>You will buy</span>
                <Score value={amount} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className='button-main b-g' style={{ width: '100%' }}>
                    <span className="white-text">{t('button.buy')}</span>
                </button>
                <button className='button-secondary' style={{ width: '100%' }} onClick={handleClear}>
                    <span>{t('button.clear')}</span>
                </button>
            </div>
        </div>
    )
}

export default Deposit