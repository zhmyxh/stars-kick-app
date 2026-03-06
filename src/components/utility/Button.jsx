import { useEffect } from "react"
import { useTranslation } from "react-i18next"

function Button({ name, icon, color, type, action, wd, size }) {
    const { t } = useTranslation()
    let textClass = ''

    useEffect(() => {
        if (type === 'main' && !color) textClass = 'default-text'
        if (type === 'secondary') textClass = 'secondary-text'
        if (type === 'main' && color) textClass = 'white-text'
        if (type === 'alter' && !color) textClass = 'button-alter'
    }, [])

    return (
        <button
            className={`button-${type} ${color ? color : ''}`}
            style={{ width: wd ? '100%' : 'fit-content' }}
            onClick={action}>
            {icon && icon}
            {name ? <span className={textClass} style={{ fontSize: size ? size : 16 }}>{name}</span> : <div className="loader-2"></div>}
        </button>
    )
}

export default Button