import './_wager.styles.css'

import { act, useEffect, useRef, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trans, useTranslation } from "react-i18next"

import { httpGet, httpPost, utcFormat, getTimeLeft } from "@/api"

import { useContentStore, useSettingsStore, useUserStore } from "@/store/useStore"

import NotFound from "@/components/utility/NotFound"
import Score from '@/components/utility/Score'
import SmartImage from "@/components/utility/SmartImage"
import Button from "@/components/utility/Button"

import IconStar from '@/assets/icons/icon-star.svg?react'
import IconArrow from '@/assets/icons/icon-arrow.svg?react'
import IconUsers from '@/assets/icons/icon-users.svg?react'
import IconAdd from '@/assets/icons/icon-add.svg?react'
import IconMinus from '@/assets/icons/icon-minus.svg?react'
import IconCalendar from '@/assets/icons/icon-calendar.svg?react'
import IconWarning from '@/assets/icons/icon-warning.svg?react'
import IconProfile from '@/assets/icons/icon-profile.svg?react'
import IconAlterStar from '@/assets/icons/icon-alter-star.svg?react'
import IconWin from '@/assets/icons/play-icons/icon-win.svg?react'
import IconLose from '@/assets/icons/play-icons/icon-lose.svg?react'

import { Loader } from '../../utility/Loader/LoaderComponent'
import { truncate } from '@/api'
import { EventStatus } from '../../pages/Events/EventsComponent'

function WagerTitle({ event, handleStep, setCurrentOption }) {
    const { wagerWarning, cancelWagerWarning } = useUserStore()
    const { user } = useUserStore()
    const { t } = useTranslation()

    const selectOption = (option) => {
        handleStep('forward')
        setCurrentOption(option)
    }

    const WagerWarning = () => {
        if (!wagerWarning) return
        return (
            <div className="flex flex-col mb-[10px]">
                <div id="event-wager-warning" style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: 10 }}>
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

    const YesNoQuestion = event?.options?.find(option => option.name.includes('Yes') || option.name.includes('Да')) || false

    const WagerDate = ({ fun }) => {
        return (
            <div className='flex items-center gap-[5px]'>
                <IconCalendar className={'icon-default'} width={15} height={15} />
                <span className='secondary-text'>{fun(event.closes_at)}</span>
            </div>
        )
    }

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
                            <span className='header-text'>{event.question}</span>

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
                    {event.status === 'OPEN' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <span className="secondary-text">{t('header.placeabet')}</span>
                            <WagerWarning />
                            <div id="event-actions">
                                {event?.options && event.options.map((option, i) => {
                                    let buttonColor = null
                                    if (YesNoQuestion) {
                                        buttonColor = (i === 0 ? 'b-g' : 'b-r')
                                    } else buttonColor = 'b-b'

                                    return <Button name={option.name}
                                        type={'main'}
                                        color={buttonColor} wd={true}
                                        action={() => selectOption(option)}
                                        image={option.image_payload}
                                        key={i} />
                                })}
                            </div>
                        </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <span className="secondary-text">{t('header.stats')}</span>
                        <div className='event-options'>
                            {event?.options && event.options.map((option, i) => {
                                let name = ''

                                if (option.name === 'Yes' || option.name === 'No') {
                                    name = t('option.' + option.name.toLowerCase())
                                } else {
                                    name = truncate(option.name)
                                }

                                return (
                                    <div className='event-option' key={i}>
                                        <span className='secondary-text'>«{name}»</span>
                                        <div className='flex flex-col gap-[6px] items-end'>
                                            <div className='event-option-total'>
                                                <span className='header-text'>{option.percent}%</span>
                                            </div>
                                            <div className='event-option-total'>
                                                <Score value={option.option_pool} icon={<IconStar width={18} height={18} />} />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div id="event-stats">
                            <div className="event-stat-box">
                                <span className="secondary-text">{t('header.totalpool')}</span>
                                <Score value={event.total_pool} icon={<IconStar width={18} height={18} />} />
                            </div>
                            <div className="event-stat-box">
                                <span className="secondary-text">{t('header.participants')}</span>
                                <Score value={event.total_participants} icon={<IconUsers className='icon-default' width={18} height={18} />} />
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {event.does_user_participate && (
                            <div id="event-user-info">
                                <div id="event-user-participating">
                                    <IconProfile className='icon-default' width={20} height={20} />
                                    <span className="secondary-text">
                                        <Trans
                                            i18nKey="definition.userwagers"
                                            values={{
                                                value: user.username,
                                                br: <br />
                                            }}
                                            components={{ b: <b /> }} />
                                    </span>
                                </div>
                                <div className="event-stats-table">
                                    <table>
                                        <tr>
                                            {event?.options && event.options.map((option, i) => (
                                                <th>«{option.name}»</th>
                                            ))}
                                        </tr>
                                        <tr>
                                            {event?.options && event.options.map((option, i) => (
                                                <td>
                                                    <div className="cell-content">
                                                        <Score value={option.user_wager || 0} icon={<IconStar width={18} height={18} />} />
                                                    </div>
                                                </td>
                                            ))}
                                        </tr>
                                    </table>
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

    const queryClient = useQueryClient()

    const fetchPlaceWager = async () => {
        return await httpPost(server + 'market-wagers/wagers', {
            event_id: event.event_id,
            option_id: currentOption.option_id,
            amount: amount
        })
    }

    const { mutate, isLoading } = useMutation({
        mutationFn: fetchPlaceWager,
        onMutate: () => setPaymentStatus('loading'),
        onSuccess: (responseData) => {
            if (responseData.wallet_balance) {
                const balance = { total_balance: responseData.wallet_balance.total_balance }
                const wallet = responseData.wallet_balance
                const updatedEvent = responseData

                setUpdatedEvent(prev => ({
                    ...prev,
                    total_pool: updatedEvent.total_pool,
                    total_participants: updatedEvent.total_participants,
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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

export default function Wager() {
    const { modalIndex } = useSettingsStore()
    const { t } = useTranslation()
    const { server } = useContentStore()
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

    useEffect(() => {
        const load = async () => {
            if (!modalIndex) return

            setIsLoadingEvent(true)

            try {
                const allQueriesData = queryClient.getQueriesData({
                    queryKey: ['events'],
                    exact: false
                })

                const currentLangEvents = allQueriesData
                    .filter(query => query[0].includes(lang))
                    .flatMap(query => query[1]?.events || [])

                const eventFromCache = currentLangEvents.find(e => e.event_id === Number(modalIndex))

                if (eventFromCache) {
                    const freshData = await fetchEvent()

                    setCurrentEvent({
                        ...eventFromCache,
                        ...freshData,
                        options: (eventFromCache.options || []).map((opt, i) => ({
                            ...opt,
                            ...(freshData.options?.[i] || {})
                        }))
                    })
                }
            } catch (error) {
                console.error('Error updating event:', error)
            } finally {
                setIsLoadingEvent(false)
            }
        }

        load()
    }, [modalIndex, queryClient, lang])

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
                                    <div className="flex items-cetner gap-[15px]">
                                        {step !== 1 && (
                                            <div id="wager-page-buttons">
                                                <button className="button-i" onClick={() => handleStep('back')}>
                                                    <div style={{ transform: 'rotate(90deg)', display: 'flex' }}>
                                                        <IconArrow className={'icon-default'} width={20} height={20} />
                                                    </div>
                                                </button>
                                            </div>
                                        )}
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