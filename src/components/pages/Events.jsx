import { useContentStore, useSettingsStore } from '../../store/useStore'
import '../../styles/Events.css'

import NotFound from "../utility/NotFound"
import IconUsers from '../../assets/icons/icon-users.svg?react'
import IconStar from '../../assets/icons/icon-star.svg?react'
import IconAlterStar from '../../assets/icons/icon-alter-star.svg?react'
import Score from './../utility/Score'

import IconCalendar from '../../assets/icons/icon-calendar.svg?react'
import { useEffect, useState } from 'react'
import { utcFormat } from '../../api'
import { useTranslation } from 'react-i18next'
import SmartImage from '../utility/SmartImage'

function Event({ event }) {
    const [poolPercent, setPoolPercent] = useState(event.options)
    const { toggleModal } = useSettingsStore()
    const { t } = useTranslation()

    useEffect(() => {
        const total = event.total_pool

        setPoolPercent(prev =>
            prev.map(option => ({
                ...option,
                percent: Math.round((option.option_pool / total) * 100)
            }))
        )
    }, [event.total_pool])

    return (
        <div className='event-box box' onClick={() => toggleModal('wager', event.event_id)}>
            <div style={{ display: 'flex', gap: 15 }}>
                <div className='event-image'>
                    <SmartImage src={event.image_payload} alt='Event icon' width={85} height={85} />
                </div>
                <div className='event-info'>
                    <span className='header-text'>{event.question}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <IconCalendar className={'icon-default'} width={15} height={15} />
                        <span className='secondary-text'>{utcFormat(event.bet_close_date)}</span>
                    </div>
                </div>
            </div>
            <div class='event-wages'>
                {event?.options && event.options.map((option, i) => (
                    <div className={`event-wage ${i === 0 ? 'yes' : 'no'}`} key={i}>
                        <span className='secondary-text'>«{t('option.' + option.name)}»</span>
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
                <Score value={event.total_wagers} icon={<IconUsers className='icon-default' width={16} height={16} />} filled={true} size={14} />
            </div>
        </div>
    )
}

function EventsPage() {
    const { events } = useContentStore()

    return (
        <div id="events" className='app-page'>
            <div id='event-filters'>
                <button className='button-alter'>
                    <span className='secondary-text'>Active</span>
                </button>
                <button className='button-alter'>
                    <span className='secondary-text'>Resolved</span>
                </button>
            </div>
            <div id='events-list'>
                {events.map((event, i) => (
                    <Event event={event} key={i} />
                ))}
            </div>
        </div>
    )
}

export default EventsPage