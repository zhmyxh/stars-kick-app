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
    currentPage: 'events-page',
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
    langList: ['en', 'ru'],
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
    balance: null,
    setBalance: (value) => set({
        balance: value
    }),

    // user
    user: {},
    undefinedUser: {
        id: 10000,
        is_bot: false,
        first_name: "undefined",
        last_name: "undefined",
        username: "undefined",
        language_code: "ru",
        is_premium: true,
        allows_write_to_pm: true,
        photo_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIf4R5qPKHPNMyAqV-FjS_OTBB8pfUV29Phg&s"
    },
    loginUser: (user) => set({
        user: user
    }),

    // referrals
    referral: null,
    referralUpdatedAt: null,

    setReferral: (data) =>
        set({
            referral: data,
            referralUpdatedAt: Date.now(),
        }),
}))

export const useContentStore = create((set, get) => ({
    // activities
    activities: [
        { name: 'blackjack', icon: 'activity-blackjack', link: 'play-page' },
        { name: 'events', icon: 'activity-events', link: 'events-page' }
    ],

    // events
    events: [
        {
            question: 'Выйдет ли новый лимитированный подарок?',
            category: 'MOMENTUM',
            image_payload: 'https://i.ytimg.com/vi/TYnRwTdfet0/maxresdefault.jpg',
            status: 'OPEN',
            bet_close_date: '28.02.2026',
            closes_at: '28.02.2026',
            options: [
                { name: 'yes', image_payload: '', option_id: 1, event_id: 5234, option_pool: 245 },
                { name: 'no', image_payload: '', option_id: 2, event_id: 5234, option_pool: 645 }
            ],
            event_id: 5234,
            winning_option_id: 2,
            total_pool: 890
        }
    ],

    // deposit
    depositPack: [
        { amount: 25, type: 'deposit' },
        { amount: 50, type: 'deposit' },
        { amount: 75, type: 'deposit' },
        { amount: 100, type: 'deposit' }
    ],
    depositFee: 0,
    depositMin: 25,

    //withdraw
    withdrawPack: [
        { amount: 50, type: 'withdraw' },
        { amount: 75, type: 'withdraw' },
        { amount: 100, type: 'withdraw' },
        { amount: 125, type: 'withdraw' }
    ],
    withdrawFee: 0,
    withdrawMin: 50,

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

    // api
    server: 'https://multi-game-hub.vercel.app/api/',
    botRelayerLink: 'https://t.me/blackjack_relayer'
}))