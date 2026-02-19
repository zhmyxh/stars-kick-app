import '../../styles/Leaders.css'

import IconNotFound from '../../assets/icons/tech-icons/icon-not-found.svg?react'
import { useTranslation } from 'react-i18next'
import NotFound from '../utility/NotFound'

function LeadersPage() {
    const { t } = useTranslation()
    return (
        <div id="leaders" className="app-page">
            <div id="leaders-list" className='box'>
                <span className='header-text'>{t('header.leaders')}</span>
                <div className='line'></div>
                <NotFound />
            </div>
        </div>
    )
}

export default LeadersPage