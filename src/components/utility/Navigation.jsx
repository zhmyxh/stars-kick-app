import { useSettingsStore } from '../../store/useStore'
import { useTranslation } from 'react-i18next'

import IconGifts from '../../assets/icons/icon-gifts.svg?react'
import IconRef from '../../assets/icons/icon-ref.svg?react'
import IconProfile from '../../assets/icons/icon-profile.svg?react'
import IconEvents from '../../assets/icons/icon-events.svg?react'

function Navigation() {
    const { t } = useTranslation()
    const { currentPage, setPage } = useSettingsStore()

    const goToPage = (page) => {
        if (currentPage !== page) setPage(page)
    }

    const pages = [
        { id: 'events-page', name: 'nav.events', icon: IconEvents },
        { id: 'gifts-page', name: 'nav.gifts', icon: IconGifts },
        { id: 'referral-page', name: 'nav.referrals', icon: IconRef },
        { id: 'profile-page', name: 'nav.profile', icon: IconProfile }
    ]

    return (
        <div id="navigation">
            {pages.map(p => {
                const Icon = p.icon
                return (
                    <div className={`navigation-button ${currentPage === p.id ? 'selected' : ''}`} onClick={() => goToPage(p.id)}>
                        <Icon className='icon-default' width={22} height={22} />
                        <span className='default-text'>{t(p.name)}</span>
                    </div>
                )
            })}
        </div>
    )
}

export default Navigation