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

const syncFavoritePack = (id) => {
    if (typeof window === 'undefined') return null

    const storedId = localStorage.getItem('favoritePackId')

    if (!storedId) {
        localStorage.setItem('favoritePackId', id)
        return id
    }

    return storedId
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
    modalClose: null,
    modalType: '',
    modalFromLink: false,
    toggleModal: (type, index, mfl) => set(state => ({
        modalStatus: !state.modalStatus,
        modalType: type || '',
        modalIndex: index || null,
        modalClose: true,
        modalFromLink: mfl || false
    })),
    editModalCloseMode: (close) => set({
        modalClose: close
    }),

    langList: ['en', 'ru'],
    lang: getInitialLang(),
    setLang: (lang) => {
        localStorage.setItem('lang', lang)
        set({ lang: lang })
    },

    version: '1.3.3, Alpha'
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

    user: null,
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
        { id: 1142, amount: 1, status: 'status.available', quotation: 0, mark: 'mark.test' },
        { id: 5432, amount: 50, status: 'status.available', quotation: 0.78, mark: null },
        { id: 9395, amount: 200, status: 'status.available', quotation: 3.14, mark: null },
        { id: 7651, amount: 350, status: 'status.available', quotation: 5.49, mark: 'mark.best' },
        { id: 1473, amount: 500, status: 'status.available', quotation: 7.85, mark: null },
        { id: 2590, amount: 750, status: 'status.available', quotation: 11.77, mark: null },
        { id: 3611, amount: 1000, status: 'status.available', quotation: 15.69, mark: null },
        { id: 3266, amount: 2500, status: 'status.unavailable', quotation: 39.23, mark: null },
        { id: 3378, amount: 5000, status: 'status.unavailable', quotation: 78.45, mark: null },
        { id: 1368, amount: 10000, status: 'status.unavailable', quotation: 160.0, mark: null },
    ],
    depositFee: 0,
    depositMin: 25,

    withdrawPack: [
        { "id": 4829, "amount": 50, "status": "status.available", "quotation": 0.78, "mark": null },
        { "id": 1053, "amount": 200, "status": "status.available", "quotation": 3.14, "mark": "mark.best" },
        { "id": 8274, "amount": 350, "status": "status.available", "quotation": 5.49, "mark": null },
        { "id": 3391, "amount": 500, "status": "status.available", "quotation": 7.85, "mark": null },
        { "id": 6102, "amount": 750, "status": "status.available", "quotation": 11.77, "mark": null },
        { "id": 9485, "amount": 1000, "status": "status.available", "quotation": 15.69, "mark": null },
        { "id": 2716, "amount": 2500, "status": "status.available", "quotation": 39.23, "mark": null },
        { "id": 5540, "amount": 5000, "status": "status.unavailable", "quotation": 78.45, "mark": null },
        { "id": 8832, "amount": 10000, "status": "status.unavailable", "quotation": 160.0, "mark": null }
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