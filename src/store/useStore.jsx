import { create } from "zustand"

const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light'
    return localStorage.getItem('theme') || 'light'
}

const getInitialLang = () => {
    if (typeof window === 'undefined') return 'en'
    return localStorage.getItem('lang') || 'en'
}

const getInitialWarn = () => {
    if (typeof window === 'undefined') return false

    const stored = localStorage.getItem('wagerWarning')
    return stored !== 'hidden'
}

export const useSettingsStore = create((set, get) => ({
    theme: getInitialTheme(),

    changeTheme: (value) => {
        localStorage.setItem('theme', value)
        set({ theme: value })
    },

    currentPage: 'events-page',
    setPage: (page) => set({
        currentPage: page
    }),

    modalStatus: false,
    modalIndex: null,
    modalType: '',
    toggleModal: (type, index) => set(state => ({
        modalStatus: !state.modalStatus,
        modalType: type || '',
        modalIndex: index || null
    })),

    langList: ['en', 'ru'],
    lang: getInitialLang(),
    setLang: (lang) => {
        localStorage.setItem('lang', lang)
        set({ lang: lang })
    },

    version: '1.0.1'
}))

export const useUserStore = create((set, get) => ({
    balance: null,
    balanceUpdate: 0,
    setBalance: (value) => set({ balance: value }),
    addBalance: (amountToAdd) => {
        const currentBalance = get().balance
        const newBalance = currentBalance + amountToAdd
        set({ balance: newBalance })
    },

    user: {},
    undefinedUser: {
        id: 1,
        is_bot: false,
        first_name: "undefined",
        last_name: "undefined",
        username: "user",
        language_code: "ru",
        is_premium: true,
        allows_write_to_pm: true,
        photo_url: "https://lightwidget.com/wp-content/uploads/localhost-file-not-found.jpg"
    },
    loginUser: (user) => set({
        user: user
    }),

    referral: null,
    referralUpdatedAt: null,

    setReferral: (data) =>
        set({
            referral: data,
            referralUpdatedAt: Date.now(),
        }),

    wagerWarning: getInitialWarn(),
    cancelWagerWarning: () => {
        localStorage.setItem('wagerWarning', 'hidden')
        set({ wagerWarning: false })
    }
}))

export const useContentStore = create((set, get) => ({
    depositPack: [
        { amount: 25, type: 'deposit' },
        { amount: 50, type: 'deposit' },
        { amount: 75, type: 'deposit' },
        { amount: 100, type: 'deposit' }
    ],
    depositFee: 0,
    depositMin: 25,

    withdrawPack: [
        { amount: 50, type: 'withdraw' },
        { amount: 75, type: 'withdraw' },
        { amount: 100, type: 'withdraw' },
        { amount: 125, type: 'withdraw' }
    ],
    withdrawFee: 0,
    withdrawMin: 50,

    server: 'https://starskick-back.vercel.app/api/',
    botRelayerLink: 'https://t.me/blackjack_relayer'
}))

export const useEventsStore = create((set) => ({
    active: [],
    resolved: [],
    activeCount: 0,
    resolvedCount: 0,

    setEvents: (array) => {
        if (!array || array.length === 0) return

        const activeEvents = array.filter(e => e.status?.toUpperCase() !== 'RESOLVED')
        const resolvedEvents = array.filter(e => e.status?.toUpperCase() === 'RESOLVED')

        set({
            active: activeEvents,
            resolved: resolvedEvents,
            activeCount: activeEvents.length,
            resolvedCount: resolvedEvents.length
        })
    },

    eventsRefreshSeconds: 0,
    setRefreshSeconds: (value) => {
        if (value < 0) return
        set({ eventsRefreshSeconds: value })
    }
}))

export const usePlayStore = create((set, get) => ({
    gameStatus: 'pre-start',
    setGameStatus: (value) => set({ gameStatus: value }),

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

    demoMode: false,
    setDemoMode: () => set(state => ({ demoMode: !state.demoMode }))
}))