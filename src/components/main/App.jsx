import { useEffect, useState } from "react"
import { QueryCache, useMutation, useQuery } from "@tanstack/react-query"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, lazy } from "react"
import { useTranslation } from "react-i18next"
import i18n from './../../i18n'
import { init, retrieveLaunchParams } from '@telegram-apps/sdk'

import { httpGet, httpPost, tg, TTL } from "../../api"

const GiftsPage = lazy(() => import("../pages/Gifts/GiftsComponent.jsx"))
const EventsPage = lazy(() => import("../pages/Events/EventsComponent.jsx"))
const ReferralPage = lazy(() => import("../pages/Referral/ReferralComponent.jsx"))
const ProfilePage = lazy(() => import("../pages/Profile/ProfileComponent.jsx"))

const Deposit = lazy(() => import("../modal/DW/DepositComponent.jsx"))
const Withdraw = lazy(() => import("../modal/DW/WithdrawComponent.jsx"))
const Rules = lazy(() => import("../modal/Rules/RulesComponents.jsx"))

import { useContentStore, useSettingsStore, useUserStore } from "../../store/useStore"

import Settings from '../modal/Settings/SettingsComponent.jsx'
import Panel from "../utility/Panel"
import Navigation from "../utility/Navigation"
import Modal from "../special/Modal/ModalComponent.jsx"
import PageLoader from "../utility/PageLoader"
import Wager from "../modal/Wager/WagerComponent.jsx"

function getEventParam(url) {
    const params = new URL(url).searchParams;
    const startApp = params.get('startapp')

    if (startApp && startApp.startsWith('event_')) {
        return startApp.split('_')[1]
    }

    return null
}

export default function App() {
    const { theme, changeTheme, currentPage, setPage, lang, modal } = useSettingsStore()
    const { loginUser, user, setBalance, undefinedUser } = useUserStore()
    const { server } = useContentStore()
    const { t } = useTranslation()

    const [eventFromLink, setEventFromLink] = useState(false)

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

    useEffect(() => {
        setBalance(balance?.total_balance)
    }, [balance])

    const toggleModal = useSettingsStore(state => state.toggleModal)

    useEffect(() => {
        const currentStatus = useSettingsStore.getState().modal.status
        const startParam = window.Telegram.WebApp.initDataUnsafe.start_param || null

        if (startParam && startParam.startsWith('event_')) {
            const eventId = Number(startParam.split('_')[1])
            if (!currentStatus) {
                toggleModal({ status: true, type: 'wager', index: eventId, isFromLink: true })
            }
        }

    }, [toggleModal])

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
    }, [user])

    useEffect(() => {
        i18n.changeLanguage(lang)
    }, [lang])

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    return (
        <div id="app">
            {modal.status && (
                <Modal header={t(`header.${modal.type}`)}>
                    <Suspense fallback={<PageLoader />}>
                        {modal.type === 'deposit' && <Deposit />}
                        {modal.type === 'withdraw' && <Withdraw />}
                        {modal.type === 'rules' && <Rules />}
                        {modal.type === 'wager' && <Wager />}
                    </Suspense>
                    {modal.type === 'settings' && <Settings />}
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