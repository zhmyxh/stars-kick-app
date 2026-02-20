import IconStar from '../../assets/icons/icon-star.svg?react'
import IconDeposit from '../../assets/icons/icon-deposit.svg?react'

import IconLight from '../../assets/icons/themes-icons/icon-light-theme.svg?react'
import IconDark from '../../assets/icons/themes-icons/icon-dark-theme.svg?react'
import IconSettings from '../../assets/icons/tech-icons/icon-settings.svg?react'
import { useSettingsStore, useUserStore } from '../../store/useStore'
import { useEffect } from 'react'
import Score from './Score'
import { useTranslation } from 'react-i18next'

function Panel() {
    const { theme, changeTheme } = useSettingsStore()
    const { balance } = useUserStore()
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    const handleTheme = () => {
        changeTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <div id="panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <button className='button-i' onClick={() => toggleModal('deposit')}>
                    <IconDeposit className='icon-default' width={22} height={22} />
                </button>
                <button className='button-i' onClick={() => toggleModal('settings')}>
                    <IconSettings className='icon-default' width={22} height={22} />
                </button>
            </div>

            <Score value={balance} />
        </div>
    )
}

export default Panel