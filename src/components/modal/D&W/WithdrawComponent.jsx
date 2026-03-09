import './_deposit.withdraw.styles.css'

import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

import { useContentStore, useUserStore } from '@/store/useStore'

import IconStar from '@/assets/icons/icon-star.svg?react'
import Score from '@/components/utility/Score'

export default function Withdraw() {
    const { withdrawPack, withdrawFee, withdrawMin } = useContentStore()
    const { t } = useTranslation()
    const [amount, setAmount] = useState(0)
    const [selected, setSelected] = useState('')
    const { balance } = useUserStore()
    const [ableToWith, setAbleToWith] = useState(false)

    const handleSelectPack = (pack, id) => {
        setSelected(id)
        setAmount(pack.amount)
    }

    const handleClear = () => {
        setSelected('')
        setAmount(0)
    }

    const queryClient = useQueryClient()
    const wallet = queryClient.getQueryData(['wallet'])

    useEffect(() => {
        if (wallet) setAbleToWith(wallet.withdrawable_balance >= amount)
    }, [amount, wallet])

    return (
        <div id="withdraw">
            <span className='secondary-text'>{t('definition.withdraw')}</span>
            <div id='withdraw-info'>
                <div className='withdraw-info-box'>
                    <span className='secondary-text'>Fee</span>
                    <Score value={withdrawFee + '%'} />
                </div>
                <div className='withdraw-info-box'>
                    <span className='secondary-text'>Available</span>
                    <Score value={wallet?.withdrawable_balance} icon={<IconStar width={18} height={18} />} />
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
            <div className='flex flex-col gap-[10px]'>
                <button className='button-main b-b' style={{ width: '100%' }} disabled={!ableToWith}>
                    <span className="white-text">{ableToWith ? t('button.withdraw') : 'You cannot withdraw this amount'}</span>
                    {ableToWith && <Score value={amount} color={'white'} icon={<IconStar width={18} height={18} />} />}
                </button>
                <button className='button-secondary' style={{ width: '100%' }} onClick={handleClear}>
                    <span>{t('button.clear')}</span>
                </button>
            </div>
        </div>
    )
}