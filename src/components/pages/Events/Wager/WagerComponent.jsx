import './_wager.styles.css'

import { act, useCallback, useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trans, useTranslation } from "react-i18next"

import { httpGet, httpPost, utcFormat, getTimeLeft } from "@/api"

import { useContentStore, useSettingsStore, useUserStore } from "@/store/useStore"

import NotFound from "@/components/utility/NotFound"
import Score from '@/components/utility/Score'
import SmartImage from "@/components/utility/SmartImage"
import Button from "@/components/utility/Button"

import IconRefresh from '@/assets/icons/icon-refresh.svg?react'
import IconStar from '@/assets/icons/icon-star.svg?react'
import IconArrow from '@/assets/icons/icon-arrow.svg?react'
import IconArrowTop from '@/assets/icons/arrow-icons/icon-arrow-top.svg?react'
import IconArrowBottom from '@/assets/icons/arrow-icons/icon-arrow-bottom.svg?react'
import IconGrowth from '@/assets/icons/arrow-icons/icon-growth.svg?react'
import IconFall from '@/assets/icons/arrow-icons/icon-fall.svg?react'
import IconTON from '@/assets/icons/icon-TON.svg?react'
import IconUsers from '@/assets/icons/icon-users.svg?react'
import IconAdd from '@/assets/icons/icon-add.svg?react'
import IconMinus from '@/assets/icons/icon-minus.svg?react'
import IconCalendar from '@/assets/icons/icon-calendar.svg?react'
import IconWarning from '@/assets/icons/icon-warning.svg?react'
import IconProfile from '@/assets/icons/icon-profile.svg?react'
import IconAlterStar from '@/assets/icons/icon-alter-star.svg?react'
import IconWin from '@/assets/icons/play-icons/icon-win.svg?react'
import IconLose from '@/assets/icons/play-icons/icon-lose.svg?react'
import IconResolved from '@/assets/icons/event-icons/icon-resolved.svg?react'

import { Loader, LoaderMini } from '@/components/special/Loader/LoaderComponent'
import { EventName, EventOptionName, EventStatus } from '../EventsUtil'
import { formatNumber } from '../../../../modules'

export default function Wager() {
    const modalIndex = useSettingsStore(state => state.modal.index)
    const isFromLink = useSettingsStore(state => state.modal.isFromLink)
    const toggleModal = useSettingsStore(state => state.toggleModal)

    const { t } = useTranslation()
    const { server, cacheData, setCache, cacheLastUse } = useContentStore()
    const { lang } = useSettingsStore()

    const [step, setStep] = useState(1)
    const [currentOption, setCurrentOption] = useState({})
    const [paymentStatus, setPaymentStatus] = useState('')

    const steps = ['definition.wagerstep.1', 'definition.wagerstep.2']

    const [refresh, setRefresh] = useState(false)

    const [updatedEvent, setUpdatedEvent] = useState(null)
    const [currentEvent, setCurrentEvent] = useState(null)
    const [isLoadingEvent, setIsLoadingEvent] = useState(false)

    const [receipt, setReceipt] = useState(null)

    const queryClient = useQueryClient()

    const fetchEvent = async () => {
        return await httpGet(`${server}market-wagers/events/${modalIndex}?app_lang=${lang}`)
    }

    const fetchEventFromLink = async () => {
        return await httpGet(`${server}market-wagers/events/${modalIndex}/full?app_lang=${lang}`)
    }

    const load = async (isRefreshing) => {
        if (!modalIndex) return
        setIsLoadingEvent(true)

        if (!isRefreshing) {
            const timeFromLastCache = Date.now() - cacheLastUse
            if (cacheData.events.length > 0 && timeFromLastCache < 15000) {
                const eventFromCache = cacheData.events.find(e => e.event_id === modalIndex)
                if (eventFromCache) {
                    setCurrentEvent(eventFromCache)
                    setIsLoadingEvent(false)
                    return
                }
            }
        }

        const allQueriesData = queryClient.getQueriesData({ queryKey: ['events'], exact: false })

        const currentLangEvents = allQueriesData
            .filter(query => query[0].includes(lang))
            .flatMap(query => {
                const queryData = query[1]

                if (queryData?.pages) {
                    return queryData.pages.flatMap(page => page.events || [])
                }

                return queryData?.events || []
            })

        const eventFromCache = currentLangEvents.find(e => Number(e.event_id) === Number(modalIndex))

        if (eventFromCache) {
            const freshData = await fetchEvent()
            setTimeout(() => {
                const newEvent = {
                    ...eventFromCache,
                    ...freshData,
                    options: (eventFromCache.options || []).map((opt, i) => ({
                        ...opt,
                        ...(freshData.options?.[i] || {})
                    }))
                }

                setCurrentEvent(newEvent)
                setCache({ event: newEvent })
                setIsLoadingEvent(false)
            }, 0)
        }
    }

    const loadFromLink = async () => {
        setIsLoadingEvent(true)

        try {
            const eventFromLink = await fetchEventFromLink()
            setCurrentEvent(eventFromLink || null)
        } finally {
            setIsLoadingEvent(false)
        }
    }

    const refreshCooldDown = 10000
    const [quickRefreshing, setQuickRefreshing] = useState(Date.now() - 10000)

    const quickRefresh = () => {
        if ((Date.now() - quickRefreshing) > refreshCooldDown) {
            setQuickRefreshing(Date.now())
            loadFromLink()
        }
    }

    useEffect(() => {
        if (isFromLink) {
            loadFromLink()
        } else {
            load()
        }
    }, [modalIndex, lang])

    useEffect(() => {
        setUpdatedEvent(currentEvent)
    }, [currentEvent])

    useEffect(() => {
        if (refresh === true) {
            setCurrentEvent(updatedEvent)
            setRefresh(false)
        }
    }, [refresh])

    const handleStep = (dir) => {
        if (dir === 'back' && step > 1) setStep(prev => prev - 1)
        if (dir === 'forward' && step < 3) setStep(prev => prev + 1)
    }

    return (
        <div id="wager">
            {
                isLoadingEvent
                    ? <Loader text={t('loader.event')} />
                    : (() => {
                        return (
                            <>
                                {step === 1 && <WagerTitle
                                    event={currentEvent}
                                    handleStep={handleStep}
                                    setCurrentOption={setCurrentOption} />}
                                {step === 2 && <WagerBuy
                                    event={currentEvent}
                                    handleStep={handleStep} currentOption={currentOption}
                                    setPaymentStatus={setPaymentStatus}
                                    setUpdatedEvent={setUpdatedEvent}
                                    setReceipt={setReceipt}
                                    currentEvent={currentEvent} />}
                                {step === 3 && (
                                    <div id="wager-status">
                                        {paymentStatus === 'success' && <WagerSuccess receipt={receipt} />}
                                        {paymentStatus === 'failed' && <WagerFailed receipt={receipt} />}
                                        {paymentStatus === 'loading' && <Loader text={t('loader.payment')} />}
                                        {paymentStatus !== 'loading' &&
                                            <Button name={t('button.back')} type={'main'} color='b-b' wd={true}
                                                action={() => {
                                                    setRefresh(true)
                                                    setStep(1)
                                                }} />
                                        }
                                    </div>
                                )}
                                {(step !== 3 && currentEvent?.status === 'OPEN') && (
                                    <div id='wager-instruction'>
                                        <div id="wager-page-buttons">
                                            {step === 1 ? (
                                                <button className="button-i" onClick={quickRefresh} disabled={!((Date.now() - quickRefreshing) > refreshCooldDown)}>
                                                    <IconRefresh className='icon-default' width={20} height={20} />
                                                </button>
                                            ) : (
                                                <button className="button-i" onClick={() => handleStep('back')}>
                                                    <div style={{ transform: 'rotate(90deg)', display: 'flex' }}>
                                                        <IconArrow className='icon-default' width={20} height={20} />
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                        <span className="secondary-text"><b>{t('header.step')} {step}.</b> {t(steps[step - 1])}</span>
                                    </div>
                                )}
                            </>
                        )
                    })()
            }
        </div>
    )
}

function WagerTitle({ event, handleStep, setCurrentOption }) {
    const { wagerWarning, cancelWagerWarning } = useUserStore()
    const { t } = useTranslation()

    const selectOption = (option) => {
        handleStep('forward')
        setCurrentOption(option)
    }

    if (!event) return <LoaderMini />

    const WagerWarning = () => {
        if (!wagerWarning) return
        return (
            <div className="flex flex-col mb-[10px]">
                <div id="event-wager-warning" style={{ marginBottom: 10 }}>
                    <div className='flex items-start gap-[10px]'>
                        <div style={{ width: 20, height: 20 }}>
                            <IconWarning className='icon-default' width={20} height={20} />
                        </div>
                        <span className="secondary-text">{t('warning.placeabet')}</span>
                    </div>
                </div>
                <Button name={t('button.gotit')} type='alter' size={14} action={cancelWagerWarning} />
            </div>
        )
    }

    const WagerDate = ({ fun }) => {
        return (
            <div className='flex items-center gap-[6px]'>
                <IconCalendar className={'icon-default'} width={15} height={15} />
                <span className='secondary-text' style={{ lineHeight: 1 }}>{fun(event.closes_at)}</span>
            </div>
        )
    }

    // const winning_option = event.options.find(o => o.winning_option)
    // const lost_pool = event.total_pool - winning_option.option_pool
    // const remaining_pool = 0.95 * lost_pool
    // const payout = Math.round((winning_option.user_wager / winning_option.option_pool) * remaining_pool)

    return (
        <div id="wager-title">
            {event ? (
                <div id='event-box'>
                    <div id="event-info-box">
                        {event.image_payload && (
                            <div id='event-image'>
                                <SmartImage src={event.image_payload} alt='Event icon' width={80} height={80} />
                            </div>
                        )}
                        <div id='event-info'>
                            <EventName name={event.question} />
                            {event.status === 'OPEN' ? (
                                <WagerDate fun={getTimeLeft} />
                            ) : (
                                <div className='flex flex-col gap-[10px]'>
                                    <WagerDate fun={utcFormat} />
                                    <EventStatus event={event} />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='flex flex-col gap-[35px]'>
                        {event.status === 'OPEN' && (
                            <div className='flex flex-col gap-[10px]'>
                                <span className="secondary-text">{t('header.placeabet')}</span>
                                <WagerWarning />
                                <div id="event-actions">
                                    {event.options.map((option, i) => {
                                        let buttonColor = null
                                        const yesOrNo = option.name === 'Yes' || option.name === 'No'
                                        if (yesOrNo) {
                                            buttonColor = (i === 0 ? 'b-g' : 'b-r')
                                        } else buttonColor = 'b-b'

                                        return <Button
                                            name={yesOrNo ? t('option.' + option.name.toLowerCase()) : option.name}
                                            type={'main'}
                                            color={buttonColor} wd={true}
                                            action={() => selectOption(option)}
                                            image={option.image_payload}
                                            key={i} />
                                    })}
                                </div>
                            </div>
                        )}
                        <div className='flex flex-col gap-[20px] p-[5px]'>
                            <div className='event-options'>
                                {event.options && event.options.map((option, i) => {
                                    const win = event.winning_option === option.option_id
                                    return (
                                        <div className='event-option' key={i}>
                                            <EventOptionName name={option.name} />
                                            <div className='flex gap-[5px]'>
                                                {win && (
                                                    <div className='event-option-total mx-[5px]'>
                                                        <IconResolved className={'icon-default'} width={18} height={18} />
                                                    </div>
                                                )}
                                                <div className='event-option-total'>
                                                    <Score value={option.percent + '%'} filled={true} />
                                                </div>
                                                <div className='event-option-total'>
                                                    <Score value={formatNumber(option.option_pool)} icon={<IconStar width={18} height={18} />} filled={true} />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div id="event-stats">
                                <div className="event-stat-box">
                                    <span className="secondary-text">{t('header.totalpool')}</span>
                                    <Score value={formatNumber(event.total_pool)} icon={<IconStar width={18} height={18} />} filled />
                                </div>
                                <div className="event-stat-box">
                                    <span className="secondary-text">{t('header.participants')}</span>
                                    <Score value={event.total_participants} icon={<IconUsers className='icon-default' width={18} height={18} />} filled />
                                </div>
                            </div>
                        </div>
                        {event.stats && (
                            <div className='flex flex-col gap-[10px]'>
                                <span className="secondary-text">{t('header.giftscontain')}</span>
                                <div id='event-gifts-list'>
                                    {event.stats.map((g, i) => {
                                        const PERIODS = { change_24h: 'header.change24h', change_3d: 'header.change3d', change_7d: 'header.change7d' }
                                        const activeKey = Object.keys(PERIODS).find(key => g[key])

                                        const term = PERIODS[activeKey] || ''
                                        const status = g[activeKey] > 0
                                        const value = g[activeKey]

                                        const GiftStat = () => (
                                            value && (
                                                <div className='flex items-center gap-[5px]'>
                                                    {status ? <IconGrowth width={14} height={14} /> : <IconFall width={14} height={14} />}
                                                    <span className='secondary-text'>{`${value > 0 ? '+' : ''}${value}`}%</span>
                                                </div>
                                            )
                                        )

                                        return (
                                            <div className="event-gift" key={i}>
                                                <div className='flex flex-col items-center justify-center gap-[7px]'>
                                                    <div>
                                                        <SmartImage src={g.image_payload} width={60} height={60} />
                                                    </div>
                                                    <span className='secondary-text'>{g.gift_name}</span>
                                                </div>
                                                <div className='flex flex-col gap-[10px]'>
                                                    <Score value={g.floor} icon={<IconTON width={18} height={18} />} />
                                                    <div className='flex flex-col gap-[5px]'>
                                                        <span className='secondary-text'>{t(term)}:</span>
                                                        <GiftStat />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )}
                        {event.does_user_participate && (
                            <div id="event-user-info">
                                <span className="secondary-text">{t('header.yourwagers')}</span>
                                <div id='event-own-wagers-list'>
                                    {(() => {
                                        const totalWager = event.options.reduce((sum, opt) => sum + (opt.user_wager || 0), 0)

                                        return event.options.map((option, i) => {
                                            const percent = totalWager > 0
                                                ? ((option.user_wager || 0) / totalWager * 100).toFixed(1)
                                                : 0

                                            return (
                                                <div className='event-own-wager' key={i}>
                                                    <EventOptionName name={option.name} />
                                                    <div className='flex items-center gap-[10px]'>
                                                        <Score value={option.user_wager || 0} icon={<IconStar width={18} height={18} />} />
                                                        <span className='secondary-text'>({percent}%)</span>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : <NotFound />}
        </div>
    )
}

function WagerBuy({ currentOption, event, setPaymentStatus, handleStep, setUpdatedEvent, setReceipt }) {
    const { t } = useTranslation()
    const { server } = useContentStore()
    const { setBalance, balance } = useUserStore()
    const { toggleModal } = useSettingsStore()

    const queryClient = useQueryClient()

    const [amount, setAmount] = useState(0)
    const maxAmount = 500
    const amountOptions = [20, 50, 70, 100, 150, 200]

    const inputRef = useRef()

    const handleAmount = (action) => {
        if ((amount > 0 && amount < maxAmount) || amount === 0) {
            if (action === 'add') setAmount(prev => prev + 5)
            if (action === 'reduce' && amount > 4) setAmount(prev => prev - 5)
        }

        if (typeof action === 'number') setAmount(action)
        if (!action) setAmount(0)
    }

    useEffect(() => {
        if (amount > maxAmount) setAmount(maxAmount)
        if (amount < 0) setAmount(0)

        if (inputRef.current) {
            inputRef.current.value = amount
        }
    }, [amount])

    const fetchPlaceWager = async () => {
        return await httpPost(server + 'market-wagers/wagers', {
            event_id: event.event_id,
            option_id: currentOption.option_id,
            amount: amount
        })
    }

    const { mutate, isLoading } = useMutation({
        mutationFn: fetchPlaceWager,
        onMutate: () => {
            setPaymentStatus('loading')
            toggleModal({ ableToClose: false })
        },
        onSuccess: (responseData) => {
            if (responseData.wallet_balance) {
                const balance = { total_balance: responseData.wallet_balance.total_balance }
                const wallet = responseData.wallet_balance
                const updatedEvent = responseData

                setUpdatedEvent(prev => ({
                    ...prev,
                    total_pool: updatedEvent.total_pool,
                    total_participants: updatedEvent.total_participants,
                    does_user_participate: true,
                    options: prev.options.map(oldOption => {
                        const freshData = updatedEvent.options.find(newOpt => newOpt.option_id === oldOption.option_id)
                        return freshData ? { ...oldOption, ...freshData } : oldOption
                    })
                }))

                queryClient.setQueryData(['balance'], balance)
                queryClient.setQueryData(['wallet'], wallet)

                setReceipt({
                    amount: amount,
                    balance: balance.total_balance,
                    option: currentOption.name
                })
            }
            setPaymentStatus('success')
            toggleModal({ ableToClose: true })
        },
        onError: (err) => {
            setPaymentStatus('failed')
        }
    })

    const placeWager = () => {
        handleStep('forward')
        mutate()
    }

    const [availible, setAvailible] = useState(false)
    useEffect(() => {
        setAvailible(!amount || balance < 5 || balance < amount)
    }, [amount, balance])

    return (
        <div id="wager-buy">
            <div id="wager-info">
                <span className="secondary-text">{t('header.youroption')}</span>
                <div id="wager-current-option" className={currentOption.name}>
                    <span className="header-text" style={{ fontWeight: 'bold', fontSize: 24 }}>«{currentOption.name}»</span>
                    <span className="secondary-text">{t('header.chance')}: {currentOption.percent}%</span>
                    <Score value={currentOption.option_pool} icon={<IconAlterStar className='icon-default' width={18} height={18} />} />
                </div>
            </div>
            <div className='flex flex-col gap-[5px]'>
                <span className="secondary-text">{t('header.amount')}</span>
                <div id="wager-bet-amount">
                    <IconStar width={34} height={34} />
                    <input ref={inputRef} id="wager-bet-input" type="number" placeholder={t('definition.typeamount')}
                        onChange={(e) => handleAmount(Number(e.currentTarget.value))} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <button className="button-i" onClick={() => handleAmount('add')}>
                            <IconAdd className='icon-default' width={20} height={20} />
                        </button>
                        <button className="button-i" onClick={() => handleAmount('reduce')}>
                            <IconMinus className='icon-default' width={20} height={20} />
                        </button>
                    </div>
                </div>
                <div id="wager-amounts">
                    {amountOptions.map(option => <Button name={option} type={'alter'} size={14} action={() => handleAmount(option)} />)}
                </div>
            </div>
            <div className="flex flex-col gap-5">
                <button className='button-main b-b' style={{ width: '100%' }} disabled={availible} onClick={placeWager}>
                    <span className="white-text">{t('header.placeabet')}</span>
                    <Score value={amount} icon={<IconStar width={18} height={18} />} color={'white'} />
                </button>
                <Button name={t('button.clear')} type={'secondary'} wd={true} action={() => amount > 0 && setAmount(0)} />
            </div>
        </div>
    )
}

function WagerSuccess({ receipt }) {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center gap-[25px]">
            <IconWin width={50} height={50} />
            <div className="flex flex-col gap-[5px] items-center">
                <div className='flex flex-col gap-[5px] items-center'>
                    <span className="secondary-text">{t('header.paymentstatus')}</span>
                    <span className="header-text">{t('header.success')}</span>
                </div>
                <div className='flex flex-col gap-[5px] my-[20px] items-center'>
                    <Score value={receipt.amount} icon={<IconStar width={18} height={18} />} filled={true} />
                    <span className="secondary-text mt-[5px]">{t('header.balance')}: <b>{receipt.balance}</b></span>
                    <span className="secondary-text"><b>«{(receipt.option === 'Yes' || receipt.option === 'No') ? t(receipt.option) : receipt.option}»</b></span>
                </div>
            </div>
        </div>
    )
}

function WagerFailed({ receipt }) {
    const { t } = useTranslation()

    return (
        <div className="flex flex-col items-center gap-[25px]">
            <IconLose width={50} height={50} />
            <div className="flex flex-col gap-[5px] items-center">
                <span className="secondary-text">{t('header.paymentstatus')}</span>
                <span className="header-text">{t('header.failed')}</span>
            </div>
        </div>
    )
}