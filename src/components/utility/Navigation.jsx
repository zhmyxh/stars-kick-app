import IconPlay from '../../assets/icons/icon-play.svg?react'
import IconLeaders from '../../assets/icons/icon-leaders.svg?react'
import IconRef from '../../assets/icons/icon-ref.svg?react'
import IconProfile from '../../assets/icons/icon-profile.svg?react'
import IconEvents from '../../assets/icons/icon-events.svg?react'
import { useSettingsStore } from '../../store/useStore'
import { useTranslation } from 'react-i18next'

function Navigation() {
    const { t } = useTranslation()
    const { currentPage, setPage } = useSettingsStore()

    const goToPage = (page) => {
        if (currentPage !== page) setPage(page)
    }

    return (
        <div id="navigation">
            <div className={`navigation-button ${currentPage === 'leaders-page' ? 'selected' : ''}`} onClick={() => goToPage('leaders-page')}>
                <IconLeaders className='icon-default' width={22} height={22} />
                <span className='default-text' style={{ fontWeight: currentPage === 'leaders-page' ? 600 : 'normal' }}>{t('nav.leaders')}</span>
            </div>
            <div className={`navigation-button ${currentPage === 'referral-page' ? 'selected' : ''}`} onClick={() => goToPage('referral-page')}>
                <IconRef className='icon-default' width={22} height={22} />
                <span className='default-text' style={{ fontWeight: currentPage === 'referral-page' ? 600 : 'normal' }}>{t('nav.referrals')}</span>
            </div>
            <div className={`navigation-button ${currentPage === 'events-page' ? 'selected' : ''}`} onClick={() => goToPage('events-page')}>
                <IconEvents className='icon-default' width={22} height={22} />
                <span className='default-text' style={{ fontWeight: currentPage === 'events-page' ? 600 : 'normal' }}>{t('nav.events')}</span>
            </div>
            <div className={`navigation-button ${currentPage === 'profile-page' ? 'selected' : ''}`} onClick={() => goToPage('profile-page')}>
                <IconProfile className='icon-default' width={22} height={22} />
                <span className='default-text' style={{ fontWeight: currentPage === 'profile-page' ? 600 : 'normal' }}>{t('nav.profile')}</span>
            </div>
        </div>
    )
}

export default Navigation