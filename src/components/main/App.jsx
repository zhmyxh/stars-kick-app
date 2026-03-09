import { useEffect } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, lazy } from "react"
import { useTranslation } from "react-i18next"
import i18n from './../../i18n'

import { httpGet, httpPost, tg, TTL } from "../../api"

const GiftsPage = lazy(() => import("../pages/Gifts/GiftsComponent.jsx"))
const EventsPage = lazy(() => import("../pages/Events/EventsComponent.jsx"))
const ReferralPage = lazy(() => import("../pages/Referral/ReferralComponent.jsx"))
const ProfilePage = lazy(() => import("../pages/Profile/ProfileComponent.jsx"))

const Deposit = lazy(() => import("../modal/D&W/DepositComponent.jsx"))
const Withdraw = lazy(() => import("../modal/D&W/WithdrawComponent.jsx"))
const Rules = lazy(() => import("../modal/Rules/RulesComponents.jsx"))
const Wager = lazy(() => import("../modal/Wager/WagerComponent.jsx"))

import { useContentStore, useSettingsStore, useUserStore } from "../../store/useStore"

import Settings from '../modal/Settings/SettingsComponent.jsx'
import Panel from "../utility/Panel"
import Navigation from "../utility/Navigation"
import Modal from "../utility/Modal/ModalComponent.jsx"
import PageLoader from "../utility/PageLoader"

export default function App() {
    const { theme, changeTheme, currentPage, setPage, modalStatus, modalType, lang } = useSettingsStore()
    const { loginUser, user, setBalance, undefinedUser } = useUserStore()
    const { server } = useContentStore()
    const { t } = useTranslation()

    const fetchWallet = async () => {
        return await httpGet(server + 'wallet/balance/detailed')
    }

    const fetchBalance = async () => {
        return await httpGet(server + 'wallet/balance')
    }

    const fetchUser = async () => {
        return await httpPost(server + 'users')
    }

    const { data: balance } = useQuery({
        queryKey: ['balance'],
        queryFn: fetchBalance,
        staleTime: TTL,
        cacheTime: TTL,
    })

    const { data: wallet } = useQuery({
        queryKey: ['wallet'],
        queryFn: fetchWallet,
        staleTime: TTL,
        cacheTime: TTL,
    })

    const { mutate } = useMutation({
        mutationFn: fetchUser,
    })

    useEffect(() => {
        mutate()

        if (tg?.initDataUnsafe?.user) {
            loginUser(tg.initDataUnsafe.user)
        } else {
            loginUser(undefinedUser)
        }
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
                <Modal header={t(`header.${modalType}`)}>
                    <Suspense fallback={<PageLoader />}>
                        {modalType === 'deposit' && <Deposit />}
                        {modalType === 'withdraw' && <Withdraw />}
                        {modalType === 'rules' && <Rules />}
                        {modalType === 'wager' && <Wager />}
                    </Suspense>
                    {modalType === 'settings' && <Settings />}
                </Modal>
            )}
            <Panel />
            <div id="content">
                <Suspense fallback={<PageLoader />}>
                    {currentPage === 'gifts-page' && <GiftsPage />}
                    {currentPage === 'events-page' && <EventsPage />}
                    {currentPage === 'referral-page' && <ReferralPage />}
                    {currentPage === 'profile-page' && <ProfilePage />}
                </Suspense>
            </div>
            <Navigation />
        </div>
    )
}