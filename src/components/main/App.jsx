import { useEffect } from "react"
import { useSettingsStore, useUserStore } from "../../store/useStore"
import Panel from "../utility/Panel"
import Navigation from "../utility/Navigation"

import { Suspense, lazy } from "react";

const ActivityPage = lazy(() => import("../pages/Activity"))
const PlayPage = lazy(() => import("../pages/Play"))
const ReferralPage = lazy(() => import("../pages/Referral"))
const LeadersPage = lazy(() => import("../pages/Leaders"))
const ProfilePage = lazy(() => import("../pages/Profile"))

const Settings = lazy(() => import("../modal/Settings"))
const Deposit = lazy(() => import("../modal/Deposit"))
const Withdraw = lazy(() => import("../modal/Withdraw"))
const Rules = lazy(() => import("../modal/Rules"))

import Modal from "../utility/Modal"
import { useTranslation } from "react-i18next"
import i18n from './../../i18n'

function PageLoader() {
    return (
        <div id="page-loader">
            <div className="loader" />
        </div>
    )
}

function App() {
    const { theme, changeTheme, currentPage, setPage, modalStatus, modalType, lang } = useSettingsStore()
    const { loginUser, user } = useUserStore()
    const { t } = useTranslation()

    useEffect(() => {
        if (user.id) return

        // demo login
        loginUser({
            user_tg_id: 0,
            username: 'zhmyxh',
            full_name: 'Egor Sokolov',
            joined_at: '952330952031',
            language_code: 'en',
            is_bot_blocked: false,
            ad_id: 0,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s'
        })
    }, [])

    useEffect(() => {
        i18n.changeLanguage(lang)
    }, [lang])

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    return (
        <div id="app">
            {modalStatus && (
                <div id="dark">
                    <Modal header={t(`header.${modalType}`)}>
                        <Suspense fallback={<PageLoader />}>
                            {modalType === 'settings' && <Settings />}
                            {modalType === 'deposit' && <Deposit />}
                            {modalType === 'withdraw' && <Withdraw />}
                            {modalType === 'rules' && <Rules />}
                        </Suspense>
                    </Modal>
                </div>
            )}
            <Panel />
            <div id="content">
                <Suspense fallback={<PageLoader />}>
                    {currentPage === 'activity-page' && <ActivityPage />}
                    {currentPage === 'play-page' && <PlayPage />}
                    {currentPage === 'referral-page' && <ReferralPage />}
                    {currentPage === 'leaders-page' && <LeadersPage />}
                    {currentPage === 'profile-page' && <ProfilePage />}
                </Suspense>
            </div>

            <Navigation />
        </div>
    )
}

export default App