import '../../styles/Referral.css'

import IconStar from '../../assets/icons/icon-star.svg?react'
import IconLink from '../../assets/icons/icon-link.svg?react'
import IconUsers from '../../assets/icons/icon-users.svg?react'
import { useUserStore } from '../../store/useStore'
import { useState } from 'react'
import Score from '../utility/Score'
import { useTranslation } from 'react-i18next'

function ReferralPage() {
    const { referralCount, referralEarn, referralBalance, balance, user, referralLink } = useUserStore()
    const { t } = useTranslation()
    const [linkCopy, setLinkCopy] = useState(false)

    const handleShareLink = () => {
        console.log('link shared')
        // share logic (API)
    }

    const handleCopyLink = async () => {
        if (linkCopy) return

        const link = referralLink + user.user_tg_id // REF LINK!!!
        try {
            await navigator.clipboard.writeText(link)
            setLinkCopy(true)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const handleWithdraw = () => {
        if (referralBalance <= 0) return
        // withdraw logic (API)
    }

    return (
        <div id="referral" className="app-page">
            <div id="referral-title" className="box">
                <span className='header-text'>{t('header.referralsystem')}</span>
                <span className="secondary-text">{t('definition.referral')}</span>
            </div>
            <div id="referral-buttons" className="box">
                <button className='button-main' onClick={handleShareLink}>
                    <span>{t('button.invite')}</span>
                </button>
                <button className='button-secondary' onClick={handleCopyLink}>
                    <IconLink className='icon-default' width={16} height={16} />
                    <span>{linkCopy ? t('button.linkcopied') : t('button.copylink')}</span>
                </button>
            </div>
            <div id="referral-info">
                <div id="referral-number" className="box">
                    <span className="secondary-text">{t('header.referrals')}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <IconUsers className='icon-default' width={20} height={20} />
                        <span className='header-text' style={{ fontWeight: 500 }}>{referralCount}</span>
                    </div>
                </div>
                <div id="referral-earn" className="box">
                    <span className="secondary-text">{t('header.referralearn')}</span>
                    <Score value={referralEarn} />
                </div>
            </div>
            <div id="referral-balance" className="box">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span className='secondary-text'>{t('header.referralbalance')}</span>
                    <Score value={referralBalance} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                    <button className='button-main' onClick={handleWithdraw}>
                        <span>{t('button.withdraw')}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ReferralPage