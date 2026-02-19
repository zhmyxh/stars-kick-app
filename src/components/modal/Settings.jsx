import { Trans, useTranslation } from "react-i18next"
import { useSettingsStore } from "../../store/useStore"

function Settings() {
    const { theme, changeTheme, version, langList, lang, setLang } = useSettingsStore()
    const { t } = useTranslation()

    const handleTheme = () => {
        changeTheme(theme === 'light' ? 'dark' : 'light')
    }

    return (
        <div id="settings">
            <div className="option-box">
                <div className="option-info">
                    <span className="header-text">{t("option.darktheme")}</span>
                    <span className="secondary-text" style={{ maxWidth: 200 }}>
                        <Trans
                            i18nKey="definition.darktheme"
                            values={{
                                value: t(theme === 'dark' ? 'status.on' : 'status.off'),
                                br: <br />
                            }}
                            components={{ b: <b /> }} />
                    </span>
                </div>
                <label className="switch">
                    <input type="checkbox" checked={theme === 'dark'} onChange={handleTheme} />
                    <span className="slider"></span>
                </label>
            </div>
            <div className="option-box">
                <div className="option-info">
                    <span className="header-text">{t("option.language")}</span>
                    <span className="secondary-text" style={{ maxWidth: 210 }}>
                        <Trans
                            i18nKey="definition.language"
                            values={{
                                value: t('lang.' + lang),
                                br: <br />
                            }}
                            components={{ b: <b /> }} />
                    </span>
                </div>
                <div className="select-wrapper">
                    <select value={lang} onChange={(e) => setLang(e.target.value)}>
                        {langList.map((l) => (
                            <option key={l} value={l}>
                                {t(`lang.${l}`)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="line" style={{ marginBlock: 10 }}></div>
            <div id="settings-app-info">
                <span className="secondary-text">{t("header.appversion")}: <b>{version}</b></span>
                <span className="secondary-text" style={{ fontWeight: 500 }}>© Copyright, 2026</span>
            </div>
        </div>
    )
}

export default Settings