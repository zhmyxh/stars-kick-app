import IconStar from '../../assets/icons/icon-star.svg?react'
import IconDeposit from '../../assets/icons/icon-deposit.svg?react'

import IconLight from '../../assets/icons/themes-icons/icon-light-theme.svg?react'
import IconDark from '../../assets/icons/themes-icons/icon-dark-theme.svg?react'
import IconSettings from '../../assets/icons/tech-icons/icon-settings.svg?react'
import { useSettingsStore, useUserStore } from '../../store/useStore'
import { useEffect } from 'react'
import Score from './Score'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from '@tanstack/react-query'

function Panel() {
    const { theme, changeTheme } = useSettingsStore()
    const { balance } = useUserStore()
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    const queryClient = useQueryClient()
    const wallet = queryClient.getQueryData(['wallet'])

    const handleTheme = () => {
        changeTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <div id="panel">
            <button className="button-main b-g" onClick={() => toggleModal('deposit')}>
                <IconDeposit className='icon-invert' width={20} height={20} />
                <span className="white-text">{t('button.deposit')}</span>
            </button>
            <Score value={wallet?.total_balance} icon={<IconStar width={18} height={18} />} filled={true} />
        </div>
    )
}

export default Panel