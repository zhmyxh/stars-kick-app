import '../../styles/Profile.css'

import Score from "../utility/Score"
import ProfileImage from '../../assets/images/profile-image.jpg'
import IconSettings from '../../assets/icons/tech-icons/icon-settings.svg?react'

import IconDeposit from '../../assets/icons/icon-deposit.svg?react'
import IconWithdraw from '../../assets/icons/icon-export.svg?react'
import IconRules from '../../assets/icons/icon-rules.svg?react'
import { useSettingsStore, useUserStore } from '../../store/useStore'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { httpGet, httpPost } from '../../api'

function ProfilePage() {
    const { toggleModal } = useSettingsStore()
    const { balance, user } = useUserStore()
    const { t } = useTranslation()

    const [loaded, setLoaded] = useState(false)

    return (
        <div id="profile" className="app-page">
            <div id="profile-container" className="box">
                <div id='profile-image-box'>
                    {!loaded && <div className="loader"></div>}
                    <img
                        id='profile-image'
                        src={user.photo_url}
                        onLoad={() => setLoaded(true)}
                        onError={() => setLoaded(false)}
                        style={{
                            opacity: loaded ? 1 : 0,
                            transition: "opacity 0.3s ease",
                            display: "block"
                        }} />
                </div>
                <div id="profile-name">
                    <span className="secondary-text">ID: {user.id}</span>
                    <span className="default-text" style={{ fontWeight: 700 }}>{user.username}</span>
                </div>
            </div>
            <div className="profile-action-box box">
                <span className='header-text'>{t('header.balance')}</span>
                <span className='secondary-text'>{t('definition.balance')}</span>
                <div className='line'></div>
                <div id='profile-depwith'>
                    <button className="button-main b-g" onClick={() => toggleModal('deposit')}>
                        <IconDeposit className='icon-invert' width={20} height={20} />
                        <span className="white-text">{t('button.deposit')}</span>
                    </button>
                    <button className="button-main b-b" onClick={() => toggleModal('withdraw')}>
                        <IconWithdraw className='icon-invert' width={20} height={20} />
                        <span className="white-text">{t('button.withdraw')}</span>
                    </button>
                </div>

            </div>
            <div className="profile-action-box box">
                <span className='header-text'>{t('header.info')}</span>
                <span className='secondary-text'>{t('definition.info')}</span>
                <div className='line'></div>
                <button className="button-main" onClick={() => toggleModal('rules')}>
                    <IconRules className='icon-default' width={20} height={20} />
                    <span className="default-text">{t('button.rules')}</span>
                </button>
                <button className="button-main" onClick={() => toggleModal('settings')}>
                    <IconSettings className='icon-default' width={20} height={20} />
                    <span className="default-text">{t('button.settings')}</span>
                </button>
            </div>
        </div>
    )
}

export default ProfilePage