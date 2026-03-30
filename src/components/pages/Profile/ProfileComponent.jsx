import './_profile.styles.css'

import { useSettingsStore, useUserStore } from '@/store/useStore'
import { useTranslation } from 'react-i18next'

import IconSettings from '@/assets/icons/tech-icons/icon-settings.svg?react'
import IconDeposit from '@/assets/icons/icon-deposit.svg?react'
import IconWithdraw from '@/assets/icons/icon-export.svg?react'
import IconRules from '@/assets/icons/icon-rules.svg?react'

import SmartImage from '@/components/utility/SmartImage'
import { Loader } from '../../special/Loader/LoaderComponent'

export default function ProfilePage() {
    const { toggleModal } = useSettingsStore()
    const { balance, user } = useUserStore()
    const { t } = useTranslation()

    if (!user) return <Loader />

    return (
        <div id="profile" className="app-page">
            <div id="profile-container" className="box">
                <div id="profile-image-box">
                    <SmartImage src={user.photo_url} alt='User photo' width={65} height={65} />
                </div>
                <div id="profile-name">
                    <span className="secondary-text">ID: {user.id}</span>
                    <span className="default-text" style={{ fontWeight: 700 }}>{user.username}</span>
                </div>
            </div>
            <div className="profile-action-box box">
                <span className='header-text'>{t('header.balance')}</span>
                <span className='secondary-text'>{t('definition.balance')}</span>
                <div className='empty'></div>
                <div id='profile-depwith'>
                    <button className="button-main b-g" onClick={() => toggleModal({ status: true, type: 'deposit' })}>
                        <IconDeposit className='icon-invert' width={20} height={20} />
                        <span className="white-text">{t('button.deposit')}</span>
                    </button>
                    <button className="button-main b-b" onClick={() => toggleModal({ status: true, type: 'withdraw' })}>
                        <IconWithdraw className='icon-invert' width={20} height={20} />
                        <span className="white-text">{t('button.withdraw')}</span>
                    </button>
                </div>

            </div>
            <div className="profile-action-box box">
                <span className='header-text'>{t('header.info')}</span>
                <span className='secondary-text'>{t('definition.info')}</span>
                <div className='empty'></div>
                <button className="button-main" onClick={() => toggleModal({ status: true, type: 'rules' })}>
                    <IconRules className='icon-default' width={20} height={20} />
                    <span className="default-text">{t('button.rules')}</span>
                </button>
                <button className="button-main" onClick={() => toggleModal({ status: true, type: 'settings' })}>
                    <IconSettings className='icon-default' width={20} height={20} />
                    <span className="default-text">{t('button.settings')}</span>
                </button>
            </div>
        </div>
    )
}