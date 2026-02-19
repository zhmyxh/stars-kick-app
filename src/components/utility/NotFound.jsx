import { useTranslation } from 'react-i18next'
import IconNotFound from '../../assets/icons/tech-icons/icon-not-found.svg?react'

function NotFound() {
    const { t } = useTranslation()

    return (
        <div className='error-message'>
            <IconNotFound className='icon-default' width={24} height={24} />
            <span className="secondary-text">{t('definition.notfound')}</span>
        </div>
    )
}

export default NotFound