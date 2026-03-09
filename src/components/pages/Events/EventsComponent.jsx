import './_events.styles.css'

import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useContentStore, useSettingsStore } from '@/store/useStore'

import IconUsers from '@/assets/icons/icon-users.svg?react'
import IconAlterStar from '@/assets/icons/icon-alter-star.svg?react'
import IconCalendar from '@/assets/icons/icon-calendar.svg?react'

import Score from '@/components/utility/Score'
import SmartImage from '@/components/utility/SmartImage'
import NotFound from "@/components/utility/NotFound"

import { httpGet, TTL, utcFormat } from '@/api'

function Event({ event }) {
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    return (
        <div className='event-box box' onClick={() => toggleModal('wager', event.event_id)}>
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
                {event?.options && event.options.map((option, i) => (
                    <div className='event-option' key={i}>
                        {option.image_payload && <SmartImage src={option.image_payload} alt='Event icon' width={50} height={50} />}
                        <span className='secondary-text'>«{option.name}»</span>
                        <div className='flex flex-col gap-[6px] items-end'>
                            <div className='event-option-total'>
                                <span className='header-text'>{option.percent}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div id='event-pool'>
                <Score value={event.total_pool} icon={<IconAlterStar className='icon-default' width={16} height={16} />} filled={true} size={14} />
                <Score value={event.total_participants} icon={<IconUsers className='icon-default' width={16} height={16} />} filled={true} size={14} />
            </div>
        </div>
    )
}

export default function EventsPage() {
    const { t } = useTranslation()
    const { server } = useContentStore()
    const [filter, setFilter] = useState('active')

    const { data, isLoading } = useQuery({
        queryKey: ['events', filter],
        queryFn: () => httpGet(server + `market-wagers/events/${filter}`),
        staleTime: TTL,
        cacheTime: TTL
    })

    const events = data?.events || []

    return (
        <div id='events' className='app-page'>
            <div id='event-filters'>
                <button className='button-alter'
                    style={{ opacity: filter === 'active' ? 1 : 0.6 }}
                    onClick={() => setFilter('active')}>
                    <span className='secondary-text'>{t('filter.active')}</span>
                </button>
                <button className='button-alter'
                    style={{ opacity: filter === 'resolved' ? 1 : 0.6 }}
                    onClick={() => setFilter('resolved')}>
                    <span className='secondary-text'>{t('filter.resolved')}</span>
                </button>
            </div>
            <div id='events-list'>
                {
                    isLoading
                        ? <div className='loader' />
                        : events.length
                            ? events.map((event, i) => <Event event={event} key={i} />)
                            : <NotFound />
                }
            </div>
        </div>
    )
}