import React from 'react'
import { useContentStore } from '../../store/useStore'

import CakeGiftIcon from '../../assets/icons/gift-icons/cake-gift.svg?react'
import DiamondGiftIcon from '../../assets/icons/gift-icons/diamond-gift.svg?react'
import FlowersGiftIcon from '../../assets/icons/gift-icons/flowers-gift.svg?react'
import HeartGiftIcon from '../../assets/icons/gift-icons/heart-gift.svg?react'
import PresentGiftIcon from '../../assets/icons/gift-icons/present-gift.svg?react'
import RingGiftIcon from '../../assets/icons/gift-icons/ring-gift.svg?react'
import RocketGiftIcon from '../../assets/icons/gift-icons/rocket-gift.svg?react'
import SingleFlowerGiftIcon from '../../assets/icons/gift-icons/single-flower-gift.svg?react'
import TeddyGiftIcon from '../../assets/icons/gift-icons/teddy-gift.svg?react'
import TrophyGiftIcon from '../../assets/icons/gift-icons/trophy-gift.svg?react'

import IconWarning from '../../assets/icons/icon-warning.svg?react'
import Score from '../utility/Score'
import { Trans, useTranslation } from 'react-i18next'

const giftIconsMap = {
    'cake-gift': CakeGiftIcon,
    'diamond-gift': DiamondGiftIcon,
    'flowers-gift': FlowersGiftIcon,
    'heart-gift': HeartGiftIcon,
    'present-gift': PresentGiftIcon,
    'ring-gift': RingGiftIcon,
    'rocket-gift': RocketGiftIcon,
    'single-flower-gift': SingleFlowerGiftIcon,
    'teddy-gift': TeddyGiftIcon,
    'trophy-gift': TrophyGiftIcon,
}

function Deposit() {
    const { giftsDeposit, botRelayerLink } = useContentStore()
    const { t } = useTranslation()

    const giftsByPrice = giftsDeposit.reduce((acc, gift) => {
        if (!acc[gift.price]) acc[gift.price] = []
        acc[gift.price].push(gift)

        return acc
    }, {})

    return (
        <div id="deposit">
            <div id='deposit-instructions'>
                <span className='header-text'>{t('header.instructions')}</span>
                <div id="bj-realyer-profile">
                    <a href={botRelayerLink} target='_blank'>@blackjack_relayer</a>
                </div>
                <span className='secondary-text'>
                    {t('instruction.deposit', { returnObjects: true }).map((line, i) => (
                        <p key={i}>
                            <Trans
                                i18nKey={`instruction.deposit.${i}`}>
                                {line}
                            </Trans>
                        </p>
                    ))}
                </span>
                <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ display: 'flex' }}>
                        <IconWarning className='icon-default' width={20} height={20} />
                    </div>
                    <span className='secondary-text' style={{ fontStyle: 'italic' }}>{t('instruction.conversion')}</span>
                </div>
            </div>
            <div id='gift-list'>
                {Object.entries(giftsByPrice).map(([price, giftsGroup]) => (
                    <div key={price} className="gift-group-box">
                        <div className="gift-group-items">
                            {giftsGroup.map(gift => {
                                const IconComponent = giftIconsMap[gift.icon]
                                return (
                                    <div key={gift.name} className="gift">
                                        {IconComponent && <IconComponent width={45} height={45} />}
                                    </div>
                                )
                            })}
                        </div>
                        <Score value={'+' + price} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Deposit