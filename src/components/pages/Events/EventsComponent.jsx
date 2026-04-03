import './_events.styles.css'

import { useTranslation } from 'react-i18next'
import { Fragment, useEffect, useState } from 'react'
import { useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useInView } from 'react-intersection-observer'

import { useContentStore, useSettingsStore } from '@/store/useStore'

import IconUsers from '@/assets/icons/icon-users.svg?react'
import IconAlterStar from '@/assets/icons/icon-alter-star.svg?react'
import IconCalendar from '@/assets/icons/icon-calendar.svg?react'
import IconRefresh from '@/assets/icons/icon-refresh.svg?react'

import IconLock from '@/assets/icons/icon-lock.svg?react'
import IconCancel from '@/assets/icons/event-icons/icon-cancel.svg?react'
import IconResolved from '@/assets/icons/event-icons/icon-resolved.svg?react'
import IconStar from '@/assets/icons/icon-star.svg?react'
import IconTON from '@/assets/icons/icon-TON.svg?react'

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

export const EventName = ({ name }) => {
    return (
        <span className='header-text'>
            {name.split('TON').map((part, index, array) => (
                <Fragment key={index}>
                    {part}
                    {index < array.length - 1 && (
                        <div className='inline-block align-middle h-[1em] mr-1 mb-[3px]'>
                            <IconTON width={17} height={17} />
                        </div>
                    )}
                </Fragment>
            ))}
        </span>
    )
}

export function Event({ event, disabled = false }) {
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    return (
        <div className='event-box box' onClick={() => {
            if (!disabled) {
                toggleModal({ status: true, type: 'wager', index: event.event_id })
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
                    <EventName name={event.question} />
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
                        <div className='event-option filled' key={i}>
                            <span className='secondary-text'>«{name}»</span>
                            <div className='flex gap-[5px]'>
                                <div className='event-option-total'>
                                    <Score value={option.percent + '%'} />
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <div id='event-pool'>
                <Score value={event.total_pool} icon={<IconStar width={16} height={16} />} filled={true} size={14} />
                <Score value={event.total_participants} icon={<IconUsers className='icon-default' width={16} height={16} />} filled={true} size={14} />
                <EventStatus event={event} />
            </div>
        </div>
    )
}

const useEventsInfinite = (lang, server, filter) => {
    return useInfiniteQuery({
        queryKey: ['events', filter, lang],
        queryFn: async ({ pageParam = null }) => {
            const cursor = pageParam ? encodeURIComponent(pageParam) : ''
            const url = `${server}market-wagers/events/${filter}?app_lang=${lang}&limit=5&cursor=${cursor}`
            return httpGet(url)
        },
        initialPageParam: null,
        getNextPageParam: (lastPage) => {
            return lastPage.next_cursor || undefined
        },
        staleTime: 30000,
    })
}

export default function EventsPage() {
    const { t } = useTranslation()
    const { server } = useContentStore()
    const [filter, setFilter] = useState('active')
    const { lang } = useSettingsStore()
    const { eventsRefreshSeconds, setRefreshSeconds } = useEventsStore()

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isSuccess,
        refetch
    } = useEventsInfinite(lang, server, filter)

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '200px',
    })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

    const currentEvents = data?.pages.flatMap(page => page.events) || []

    const queryClient = useQueryClient();

    const handleRefresh = () => {
        const isInProgress = isLoading || isFetchingNextPage;

        if (eventsRefreshSeconds === 0 && !isInProgress) {
            setRefreshSeconds(10); // Запускаем таймер в сторе

            // Полный сброс текущего кэша (вызовет основной isLoading)
            queryClient.resetQueries({
                queryKey: ['events', filter, lang],
                exact: true
            });
        }
    };


    useEffect(() => {
        // Если таймер на нуле, ничего не делаем
        if (eventsRefreshSeconds <= 0) return;

        // Запускаем интервал на 1 секунду
        const timer = setInterval(() => {
            setRefreshSeconds(eventsRefreshSeconds - 1);
        }, 1000);

        // Обязательно очищаем интервал при размонтировании или изменении стейта
        return () => clearInterval(timer);
    }, [eventsRefreshSeconds, setRefreshSeconds]);

    return (
        <div id='events' className='app-page'>
            <div id='event-navigation'>
                <div id='events-filters'>
                    <button className='button-alter'
                        style={{ background: filter !== 'active' ? 'none' : undefined }}
                        onClick={() => setFilter('active')}>
                        <span className='secondary-text'>
                            {t('filter.active')}
                        </span>
                    </button>
                    <button className='button-alter'
                        style={{ background: filter !== 'resolved' ? 'none' : undefined }}
                        onClick={() => setFilter('resolved')}>
                        <span className='secondary-text'>{t('filter.resolved')}</span>
                    </button>

                    <button className='button-alter'
                        style={{ width: eventsRefreshSeconds !== 0 ? 90 : 'auto' }}
                        onClick={handleRefresh}
                        disabled={eventsRefreshSeconds !== 0 || isFetchingNextPage}>
                        <IconRefresh className='icon-default' width={18} height={18} />
                        {eventsRefreshSeconds !== 0 && (
                            <span className='secondary-text'>
                                {eventsRefreshSeconds}{t('status.sec')}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div id='events-list'>
                {isLoading ? (
                    <Loader text={t('loader.events')} />
                ) : currentEvents.length > 0 ? (
                    <>
                        {currentEvents.map((event, i) => (
                            <Event event={event} key={event.id || i} />
                        ))}

                        <div
                            ref={ref}
                            style={{
                                height: '1px',
                                marginTop: '-1px',
                                opacity: 0,
                                pointerEvents: 'none'
                            }}
                        />

                        {isFetchingNextPage && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '15px' }}>
                                <LoaderMini />
                            </div>
                        )}
                    </>
                ) : (
                    <NotFound />
                )}
            </div>

        </div>
    )
}