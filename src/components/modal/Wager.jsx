import { act, useEffect, useRef, useState } from "react"
import { useContentStore, useSettingsStore, useUserStore } from "../../store/useStore"
import NotFound from "../utility/NotFound"
import IconStar from '../../assets/icons/icon-star.svg?react'
import IconInfo from '../../assets/icons/icon-info.svg?react'
import IconRefresh from '../../assets/icons/icon-refresh.svg?react'
import IconArrow from '../../assets/icons/icon-arrow.svg?react'
import Score from './../utility/Score'
import IconUsers from '../../assets/icons/icon-users.svg?react'
import IconBuy from '../../assets/icons/icon-buy.svg?react'
import IconAdd from '../../assets/icons/icon-add.svg?react'
import IconMinus from '../../assets/icons/icon-minus.svg?react'
import IconCalendar from '../../assets/icons/icon-calendar.svg?react'
import { httpGet, utcFormat } from "../../api"
import SmartImage from "../utility/SmartImage"
import { Trans, useTranslation } from "react-i18next"
import Button from "../utility/Button"
import IconWarning from '../../assets/icons/icon-warning.svg?react'
import IconProfile from '../../assets/icons/icon-profile.svg?react'
import IconAlterStar from '../../assets/icons/icon-alter-star.svg?react'
import { useQueryClient } from "@tanstack/react-query"

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

    return (
        <div id="wager-title">
            {event ? (
                <div id='event-box'>
                    <div id="event-info-box">
                        <div id='event-image'>
                            <SmartImage src={event.image_payload} alt='Event icon' width={80} height={80} />
                        </div>
                        <div id='event-info'>
                            <span className='header-text'>{event.question}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                                <IconCalendar className={'icon-default'} width={15} height={15} />
                                <span className='secondary-text'>{utcFormat(event.closes_at)}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <span className="secondary-text">{t('header.placeabet')}</span>
                        <WagerWarning />
                        <div id="event-actions">
                            {event?.options && event.options.map((option, i) => (
                                <Button name={option.name}
                                    color={i === 0 ? 'b-g' : 'b-r'} wd={true}
                                    action={() => selectOption(option)} />
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <span className="secondary-text">{t('header.stats')}</span>
                        <div id='event-wages'>
                            {event?.options && event.options.map((option, i) => (
                                <div className={`event-wage ${i === 0 ? 'yes' : 'no'}`} key={i}>
                                    <span className='secondary-text'>«{option.name}»</span>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 6 }}>
                                        <div className={`event-wager-total ${i === 0 ? 'yes' : 'no'}`}>
                                            <span className='header-text'>{option.percent}%</span>
                                        </div>
                                        <div className={`event-wager-total ${i === 0 ? 'yes' : 'no'}`}>
                                            <Score value={option.option_pool} icon={<IconStar width={18} height={18} />} />
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                        {event.is_user_participating && (
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
                                                <th>«{t('option.' + option.name)}»</th>
                                            ))}
                                        </tr>
                                        <tr>
                                            {event?.options && event.options.map((option, i) => (
                                                <td>
                                                    <div className="cell-content">
                                                        <Score value={option.user_wager} icon={<IconStar width={18} height={18} />} />
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

function WagerBuy({ currentOption }) {
    const { t } = useTranslation()
    const [amount, setAmount] = useState(0)
    const inputRef = useRef()
    const amountOptions = [
        20, 50, 70, 100, 150, 200
    ]

    const handleAmount = (action) => {
        if (action === 'add') setAmount(prev => prev + 5)
        if (action === 'reduce') setAmount(prev => prev - 5)
        if (typeof action === 'number') setAmount(action)
        if (!action) setAmount(0)
    }

    useEffect(() => {
        if (amount > 500) setAmount(500)

        if (inputRef.current) {
            inputRef.current.value = amount
        }
    }, [amount])

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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button className='button-main b-b' style={{ width: '100%' }} disabled={!amount}>
                    <span className="white-text">{t('header.placeabet')}</span>
                    <Score value={amount} icon={<IconStar width={18} height={18} />} color={'white'} />
                </button>
                <Button name={t('button.clear')} type={'secondary'} wd={true} action={() => amount > 0 && setAmount(0)} />
            </div>
        </div>
    )
}

function WagerSuccess() {
    return (
        <div id="wager">
            <div id="wager-status">
                <span className="secondary-text">{t('header.paymentstatus')}</span>
                <span className="header-test">{t('header.success')}</span>
            </div>
            <Button name={t('button.back')} type={'main'} color='b-b' wd={true} />
        </div>
    )
}

function WagerFailed() {
    return (
        <div id="wager">
            <div id="wager-status">
                <span className="secondary-text">{t('header.paymentstatus')}</span>
                <span className="header-test">{t('header.success')}</span>
            </div>
            <Button name={t('button.back')} type={'main'} color='b-b' wd={true} />
        </div>
    )
}

function Wager() {
    const { toggleModal, modalIndex } = useSettingsStore()
    const { events } = useContentStore()
    const { t } = useTranslation()
    const { server } = useContentStore()

    const [step, setStep] = useState(1)
    const [currentOption, setCurrentOption] = useState({})
    const [paymentStatus, setPaymentStatus] = useState(true)

    const steps = [
        'definition.wagerstep.1',
        'definition.wagerstep.2'
    ]

    const queryClient = useQueryClient()
    const eventsQueries = queryClient.getQueriesData({ queryKey: ['events'] })

    const fetchEvent = async () => await httpGet(server + 'market-wagers/events/' + modalIndex)

    const [currentEvent, setCurrentEvent] = useState(null)
    const [isLoadingEvent, setIsLoadingEvent] = useState(false)

    useEffect(() => {
        const load = async () => {
            setIsLoadingEvent(true)

            const events = eventsQueries.flatMap(q => q[1]?.events || [])
            const event = events.find(e => e.event_id === Number(modalIndex))

            if (event) {
                const data = await fetchEvent()
                setCurrentEvent({
                    ...event,
                    options: (event.options || []).map((opt, i) => ({
                        ...opt,
                        ...(data.options?.[i] || {})
                    }))
                })
            }

            setIsLoadingEvent(false)
        }

        load()
    }, [])

    const handleStep = (dir) => {
        if (dir === 'back' && step > 1) setStep(prev => prev - 1)
        if (dir === 'forward' && step < 3) setStep(prev => prev + 1)
    }

    return (
        <div id="wager">
            {
                isLoadingEvent
                    ? <div className="loader"></div>
                    : (() => {
                        return (
                            <>
                                {step === 1 && <WagerTitle event={currentEvent} handleStep={handleStep} setCurrentOption={setCurrentOption} />}
                                {step === 2 && <WagerBuy event={currentEvent} handleStep={handleStep} currentOption={currentOption} setPaymentStatus={setPaymentStatus} />}
                                {(step === 4 && paymentStatus) && <WagerSuccess />}
                                {(step === 4 && !paymentStatus) && <WagerFailed />}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
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
                                </div></>
                        )

                    })()
            }

        </div>
    )
}

export default Wager