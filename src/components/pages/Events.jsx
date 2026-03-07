import { useContentStore, useSettingsStore } from '../../store/useStore'
import '../../styles/Events.css'

import NotFound from "../utility/NotFound"
import IconUsers from '../../assets/icons/icon-users.svg?react'
import IconStar from '../../assets/icons/icon-star.svg?react'
import IconAlterStar from '../../assets/icons/icon-alter-star.svg?react'
import Score from './../utility/Score'

import IconCalendar from '../../assets/icons/icon-calendar.svg?react'
import { useEffect, useState } from 'react'
import { httpGet, TTL, utcFormat } from '../../api'
import { useTranslation } from 'react-i18next'
import SmartImage from '../utility/SmartImage'
import { useQuery } from '@tanstack/react-query'

function Event({ event }) {
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    return (
        <div className='event-box box' onClick={() => toggleModal('wager', event.event_id)}>
            <div style={{ display: 'flex', gap: 15 }}>
                <div className='event-image'>
                    <SmartImage src={event.image_payload} alt='Event icon' width={80} height={80} />
                </div>
                <div className='event-info'>
                    <span className='header-text'>{event.question}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <IconCalendar className={'icon-default'} width={15} height={15} />
                        <span className='secondary-text'>{utcFormat(event.closes_at)}</span>
                    </div>
                </div>
            </div>
            <div className='event-wages'>
                {event?.options && event.options.map((option, i) => (
                    <div className={`event-wage ${i === 0 ? 'yes' : 'no'}`} key={i}>
                        <span className='secondary-text'>«{option.name}»</span>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end', gap: 6 }}>
                            <div className={`event-wager-total ${i === 0 ? 'yes' : 'no'}`}>
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

function EventsPage() {
    const { t } = useTranslation()
    const { server } = useContentStore()
    const [filter, setFilter] = useState('active')

    const { data, isLoading } = useQuery({
        queryKey: ['events', filter],
        queryFn: () => httpGet(server + `market-wagers/events/${filter}`),
        staleTime: TTL,
        cacheTime: TTL
    })

    const events = (data?.events || []).slice().sort((a, b) =>
        new Date(a.closed_at) - new Date(b.closed_at)
    )

    return (
        <div id='events' className='app-page'>
            <div id='event-filters'>
                <button className='button-alter'
                    style={{ filter: filter === 'active' ? 'brightness(120%)' : 'none' }}
                    onClick={() => setFilter('active')}>
                    <span className='secondary-text'>{t('filter.active')}</span>
                </button>
                <button className='button-alter'
                    style={{ filter: filter === 'resolved' ? 'brightness(110%)' : 'none' }}
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

export default EventsPage