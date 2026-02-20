import '../../styles/Activity.css'

import { useContentStore, useSettingsStore } from "../../store/useStore"

import BlackjackBanner from '../../assets/images/bj-banner.png'
import EventsBanner from '../../assets/images/ev-banner.png'

import { useTranslation } from 'react-i18next'

const banner = {
    'activity-blackjack': BlackjackBanner,
    'activity-events': EventsBanner
}

function Activity() {
    const { activities } = useContentStore()
    const { setPage } = useSettingsStore()
    const { t } = useTranslation()

    return (
        <div id="activities" className="app-page">
            <div id="activity-list">
                {activities.map((activity, index) => (
                    <div key={index} className="activity-box box">
                        <div className='activity-info'>
                            <img className='activity-banner' src={banner[activity.icon]} alt={activity.name} />
                            <span className="default-text" style={{ fontWeight: 'bold', fontSize: 24 }}>{t(`header.${activity.name}`)}</span>
                        </div>
                        <button className='button-main' style={{ width: '100%' }} onClick={() => setPage(activity.link)}>
                            <span>{t('button.start')}</span>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Activity