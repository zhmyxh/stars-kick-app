import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import SmartImage from "./SmartImage"

function Button({ name, icon, color, type, action, wd, size, image, disback, isDisabled }) {
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
            className={`button-${type} ${color ? color : ''} ${image ? 'flex-col' : ''}`}
            style={{
                width: wd ? '100%' : 'fit-content', height: image ? 'auto' : '', paddingBlock: image ? 15 : 0,
                background: disback && 'none'
            }}
            onClick={action} disabled={isDisabled}>
            {icon && icon}
            {name && <span className={textClass} style={{ fontSize: size ? size : 16 }}>{name}</span>}
            {image && <SmartImage src={image} width={60} height={60} />}
        </button>
    )
}

export default Button