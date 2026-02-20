import { create } from "zustand"

const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme') || 'light'
}

const getInitialLang = () => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem('lang') || 'en'
}

export const usePlayStore = create((set, get) => ({
    gameStatus: 'pre-start',
    setGameStatus: (value) => set({ gameStatus: value }),

    // current bet for play
    totalBet: 0,
    setTotalBet: () => {
        const state = get()
        const userState = useUserStore.getState()

        const total = state.currentBet * state.currentMode
        const ready = (total >= 10 && userState.balance >= total)
        const warning = total < 10 ? 'warning.nobet' : (userState.balance < total ? 'warning.lowbalance' : '')

        set({
            totalBet: total,
            readyToPlay: ready,
            warning: warning
        })
    },

    readyToPlay: false,
    warning: '',

    currentBet: 0,
    currentMode: 0,

    setBet: (value) => set({
        currentBet: value
    }),
    setMode: (value) => set({
        currentMode: value
    }),

    // demo
    demoMode: false,
    setDemoMode: () => set(state => ({ demoMode: !state.demoMode }))
}))

export const useSettingsStore = create((set, get) => ({
    // app theme
    theme: getInitialTheme(),

    changeTheme: (value) => {
        localStorage.setItem('theme', value)
        set({ theme: value })
    },

    // page routing
    currentPage: 'profile-page',
    setPage: (page) => set({
        currentPage: page
    }),

    //modal
    modalStatus: false,
    modalType: '',
    toggleModal: (type) => set(state => ({
        modalStatus: !state.modalStatus,
        modalType: type || ''
    })),

    // language
    langList: ['en', 'ru', 'sp', 'cn'],
    lang: getInitialLang(),
    setLang: (lang) => {
        localStorage.setItem('lang', lang)
        set({ lang: lang })
    },

    // version
    version: '1.0.1'
}))

export const useUserStore = create((set, get) => ({
    // balance
    balance: 15,
    setBalance: (value) => set({
        balance: value
    }),

    // user
    user: {},
    loginUser: (user) => set({
        user: user
    }),

    // referrals
    referralCount: 0,
    referralEarn: 0,
    referralBalance: 0,
    referralLink: 'https://t.me/blackjack_stars_bot/app?startapp='
}))

export const useContentStore = create((set, get) => ({
    // activities
    activities: [
        { name: 'blackjack', icon: 'activity-blackjack', link: 'play-page' },
        { name: 'events', icon: 'activity-events', link: 'events-page' }
    ],

    // deposit
    giftsDeposit: [
        { name: 'diamond-gift', icon: 'diamond-gift', price: 85 },
        { name: 'trophy-gift', icon: 'trophy-gift', price: 85 },
        { name: 'ring-gift', icon: 'ring-gift', price: 85 },

        { name: 'flowers-gift', icon: 'flowers-gift', price: 43 },
        { name: 'cake-gift', icon: 'cake-gift', price: 43 },
        { name: 'rocket-gift', icon: 'rocket-gift', price: 43 },

        { name: 'single-flower-gift', icon: 'single-flower-gift', price: 21 },
        { name: 'present-gift', icon: 'present-gift', price: 21 },

        { name: 'heart-gift', icon: 'heart-gift', price: 13 },
        { name: 'teddy-gift', icon: 'teddy-gift', price: 13 }
    ],

    giftsWithdraw: [
        { name: 'diamond-gift', icon: 'diamond-gift', price: 100 },
        { name: 'trophy-gift', icon: 'trophy-gift', price: 100 },
        { name: 'ring-gift', icon: 'ring-gift', price: 100 },

        { name: 'flowers-gift', icon: 'flowers-gift', price: 50 },
        { name: 'cake-gift', icon: 'cake-gift', price: 50 },
        { name: 'rocket-gift', icon: 'rocket-gift', price: 50 },

        { name: 'single-flower-gift', icon: 'single-flower-gift', price: 25 },
        { name: 'present-gift', icon: 'present-gift', price: 25 },

        { name: 'heart-gift', icon: 'heart-gift', price: 15 },
        { name: 'teddy-gift', icon: 'teddy-gift', price: 15 }
    ],

    // relayer
    botRelayerLink: 'https://t.me/blackjack_relayer'
}))