import { useEffect } from "react"
import { useContentStore, useSettingsStore, useUserStore } from "../../store/useStore"
import Panel from "../utility/Panel"
import Navigation from "../utility/Navigation"
import { useMutation, useQuery } from "@tanstack/react-query"

import { Suspense, lazy } from "react"

const ActivityPage = lazy(() => import("../pages/Activity"))
const GiftsPage = lazy(() => import("../pages/Gifts"))
const EventsPage = lazy(() => import("../pages/Events"))
const PlayPage = lazy(() => import("../pages/Play"))
const ReferralPage = lazy(() => import("../pages/Referral"))
const LeadersPage = lazy(() => import("../pages/Leaders"))
const ProfilePage = lazy(() => import("../pages/Profile"))

const Deposit = lazy(() => import("../modal/Deposit"))
const Withdraw = lazy(() => import("../modal/Withdraw"))
const Rules = lazy(() => import("../modal/Rules"))
const Wager = lazy(() => import("../modal/Wager"))

import Settings from '../modal/Settings'

import Modal from "../utility/Modal"
import { useTranslation } from "react-i18next"
import i18n from './../../i18n'
import { httpGet, httpPost, tg, TTL } from "../../api"
import PageLoader from "../utility/PageLoader"

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

function App() {
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
                    {currentPage === 'activity-page' && <ActivityPage />}
                    {currentPage === 'gifts-page' && <GiftsPage />}
                    {currentPage === 'events-page' && <EventsPage />}
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