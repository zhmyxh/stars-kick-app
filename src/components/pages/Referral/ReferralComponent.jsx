import './_referral.styles.css'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'

import { useContentStore } from '@/store/useStore'

import Score from '@/components/utility/Score'

import IconStar from '@/assets/icons/icon-star.svg?react'
import IconLink from '@/assets/icons/icon-link.svg?react'
import IconUsers from '@/assets/icons/icon-users.svg?react'

import { httpGet, httpPost, tg, TTL } from '@/api'

export default function ReferralPage() {
    const { server } = useContentStore()
    const { t } = useTranslation()
    const [linkCopy, setLinkCopy] = useState(false)

    const fetchReferral = async () => {
        const data = await httpGet(server + 'referral')

        return {
            count: Number(data.total_referrals) || 0,
            earn: Number(data.stars_earned) || 0,
            balance: Number(data.available_balance) || 0,
            link: data.link || '',
        }
    }

    const { data: referral } = useQuery({
        queryKey: ['referral'],
        queryFn: fetchReferral,
        staleTime: TTL,
        cacheTime: TTL,
    })

    const [referralCount, setReferralCount] = useState(null)
    const [referralEarn, setReferralEarn] = useState(null)
    const [referralBalance, setReferralBalance] = useState(null)
    const [referralLink, setReferralLink] = useState('')

    useEffect(() => {
        if (!referral) return

        const formatNumber = (num) => {
            if (num == null) return 0
            const fixed = num.toFixed(1)
            return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed
        }

        setReferralCount(Number(referral.count ?? 0))
        setReferralEarn(formatNumber(referral.earn ?? 0))
        setReferralBalance(formatNumber(referral.balance ?? 0))
        setReferralLink(referral.link ?? '')
    }, [referral])

    const handleShareLink = () => {
        if (referralLink) {
            const messageText = t('referral.shareMessage')
            const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(messageText)}`

            if (tg.openTelegramLink) {
                tg.openTelegramLink(shareUrl)
            }
        }
    }

    const handleCopyLink = async () => {
        if (linkCopy) return

        const link = referralLink
        try {
            await navigator.clipboard.writeText(link)
            setLinkCopy(true)
        } catch (err) {
            console.error('Failed to copy text: ', err)
        }
    }

    const handleWithdraw = async () => {
        const withdrawBalance = await httpPost(server + 'referral/claim')
        console.log(withdrawBalance)
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
                    <Score value={referralCount} icon={<IconUsers className='icon-default' width={18} height={18} />} filled={false} />
                </div>
                <div id="referral-earn" className="box">
                    <span className="secondary-text">{t('header.referralearn')}</span>
                    <Score value={referralEarn} icon={<IconStar width={18} height={18} />} filled={true} />
                </div>
            </div>
            <div id="referral-balance" className="box">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <span className='secondary-text'>{t('header.referralbalance')}</span>
                    <Score value={referralBalance} icon={<IconStar width={18} height={18} />} filled={true} />
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