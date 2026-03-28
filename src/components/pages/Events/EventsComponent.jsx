import './_events.styles.css'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'

import { useContentStore, useSettingsStore } from '@/store/useStore'

import IconUsers from '@/assets/icons/icon-users.svg?react'
import IconAlterStar from '@/assets/icons/icon-alter-star.svg?react'
import IconCalendar from '@/assets/icons/icon-calendar.svg?react'
import IconRefresh from '@/assets/icons/icon-refresh.svg?react'

import IconLock from '@/assets/icons/icon-lock.svg?react'
import IconCancel from '@/assets/icons/event-icons/icon-cancel.svg?react'
import IconResolved from '@/assets/icons/event-icons/icon-resolved.svg?react'

import Score from '@/components/utility/Score'
import SmartImage from '@/components/utility/SmartImage'
import NotFound from "@/components/utility/NotFound"

import { httpGet, TTL, utcFormat } from '@/api'
import { Loader, LoaderMini } from '../../special/Loader/LoaderComponent'
import { useEventsStore } from '../../../store/useStore'
import { truncate, useEventsFromCache } from '../../../api'

export const EventStatus = ({ event }) => {
    const { t } = useTranslation()

    let statusIcon = null
    let statusName = 'status.' + event.status.toLowerCase()

    switch (event.status) {
        case 'LOCKED':
            statusIcon = <IconLock className={'icon-default'} width={16} height={16} />
            break

        case 'RESOLVED':
            statusIcon = <IconResolved className={'icon-default'} width={16} height={16} />
            break

        case 'CANCELLED':
            statusIcon = <IconCancel className={'icon-default'} width={16} height={16} />
            break
    }


    return event.status !== 'OPEN' && <Score value={t(statusName)} icon={statusIcon} filled={true} size={14} />
}

export function Event({ event, disabled = false }) {
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    return (
        <div className='event-box box' onClick={() => {
            if (!disabled) {
                toggleModal('wager', event.event_id)
            }
        }
        }>
            <div style={{ display: 'flex', gap: 15 }}>
                {event.image_payload && (
                    <div id='event-image'>
                        <SmartImage src={event.image_payload} alt='Event icon' width={80} height={80} />
                    </div>
                )}
                <div className='event-info'>
                    <span className='header-text'>{event.question}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <IconCalendar className={'icon-default'} width={15} height={15} />
                        <span className='secondary-text'>{utcFormat(event.closes_at)}</span>
                    </div>
                </div>
            </div>
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
                            </div>
                        </div>
                    )
                })}
            </div>
            <div id='event-pool'>
                <Score value={event.total_pool} icon={<IconAlterStar className='icon-default' width={16} height={16} />} filled={true} size={14} />
                <Score value={event.total_participants} icon={<IconUsers className='icon-default' width={16} height={16} />} filled={true} size={14} />
                <EventStatus event={event} />
            </div>
        </div>
    )
}

const useLoadAllEvents = (lang, server) => {
    return useQueries({
        queries: [
            {
                queryKey: ['events', 'active', lang],
                queryFn: () => httpGet(`${server}market-wagers/events/active?app_lang=${lang}`),
                staleTime: TTL,
            },
            {
                queryKey: ['events', 'resolved', lang],
                queryFn: () => httpGet(`${server}market-wagers/events/resolved?app_lang=${lang}`),
                staleTime: TTL,
            },
        ],
        combine: (results) => {
            const active = results[0].data?.events || []
            const resolved = results[1].data?.events || []
            return {
                allEvents: [...active, ...resolved],
                isLoading: results.some(r => r.isLoading),
                isFetching: results.some(r => r.isFetching),
                isSuccess: results.every(r => r.isSuccess),
                refetchAll: () => results.forEach(r => r.refetch())
            }
        },
    })
}

export default function EventsPage() {
    const { t } = useTranslation()
    const { server } = useContentStore()
    const [filter, setFilter] = useState('active')
    const { lang } = useSettingsStore()
    const { setEvents, active, resolved, activeCount, resolvedCount, eventsRefreshSeconds, setRefreshSeconds } = useEventsStore()

    const COOLDOWN_SEC = 10
    const [secondsLeft, setSecondsLeft] = useState(0)
    const canRefresh = eventsRefreshSeconds === 0

    const { allEvents, isSuccess, isFetching, isLoading, refetchAll } = useLoadAllEvents(lang, server)

    useEffect(() => {
        if (isSuccess && !isFetching && allEvents.length > 0) {
            setEvents([...allEvents])
        }
    }, [allEvents, isSuccess, isFetching, lang, setEvents])

    useEffect(() => {
        if (eventsRefreshSeconds <= 0) return

        const timer = setInterval(() => {
            setRefreshSeconds(eventsRefreshSeconds - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [eventsRefreshSeconds])

    const handleRefresh = () => {
        if (canRefresh && !isFetching) {
            setRefreshSeconds(COOLDOWN_SEC)
            refetchAll()
        }
    }

    return (
        <div id='events' className='app-page'>
            <div id='event-navigation'>
                {isLoading ? <LoaderMini /> : (
                    <div id='events-filters'>
                        <button className='button-alter'
                            style={{ background: filter !== 'active' && 'none' }}
                            onClick={() => { if (isSuccess) setFilter('active') }}>
                            {isLoading ? <LoaderMini /> : <span className='secondary-text'>{t('filter.active')} ({activeCount})</span>}
                        </button>
                        <button className='button-alter'
                            style={{ background: filter !== 'resolved' && 'none' }}
                            onClick={() => { if (isSuccess) setFilter('resolved') }}>
                            {isLoading ? <LoaderMini /> : <span className='secondary-text'>{t('filter.resolved')}</span>}
                        </button>
                        <button className='button-alter'
                            style={{ width: eventsRefreshSeconds !== 0 ? 90 : 'auto' }}
                            onClick={handleRefresh} disabled={!canRefresh || isFetching}>
                            <IconRefresh className='icon-default' width={18} height={18} />
                            {eventsRefreshSeconds !== 0 && <span className='secondary-text'>{eventsRefreshSeconds}{t('status.sec')}</span>}
                        </button>
                    </div>
                )}
            </div>
            <div id='events-list'>
                {
                    isLoading || isFetching
                        ? <Loader text={t('loader.events')} />
                        : allEvents?.length
                            ? (<>
                                {filter === 'active' && active.map((event, i) => <Event event={event} key={i} />)}
                                {filter === 'resolved' && resolved.map((event, i) => <Event event={event} key={i} />)}
                            </>

                            )
                            : <NotFound />
                }
            </div>
        </div>
    )
}