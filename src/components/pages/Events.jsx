import { useContentStore } from '../../store/useStore'
import '../../styles/Events.css'

import NotFound from "../utility/NotFound"
import IconStar from '../../assets/icons/icon-star.svg?react'
import Score from './../utility/Score'

import IconCalendar from '../../assets/icons/icon-calendar.svg?react'
import { useEffect, useState } from 'react'

function Event({ event }) {
    const [poolPercent, setPoolPercent] = useState(event.options)

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
        <div className='event-box box'>
            <div style={{ display: 'flex', gap: 15 }}>
                <img className='event-icon' src={event.image_payload} />
                <div className='event-info'>
                    <span className='header-text'>{event.question}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <IconCalendar className={'icon-default'} width={15} height={15} />
                        <span className='secondary-text'>Ends {event.bets_close_date}</span>
                    </div>
                </div>
            </div>
            <div className='event-wages'>
                {poolPercent.map((option, i) => (
                    <div className='event-result' key={i}>
                        <span className='secondary-text'>{option.name}</span>
                        <span className='header-text'>{option.percent}%</span>
                    </div>
                ))}
            </div>
            <div className='event-pool'>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3, width: 130 }}>
                    <span className='secondary-text'>Pool</span>
                    <Score value={event.total_pool} icon={<IconStar width={18} height={18} />} filled={true} />
                </div>
                <button className="button-main b-g" style={{ width: '100%' }}>
                    <span className="white-text">Bet</span>
                </button>
            </div>
        </div>
    )
}

function EventsPage() {
    const { events } = useContentStore()

    return (
        <div id="events" className='app-page'>
            <div id='event-filters'>
                <div className='event-filter-category'>
                    <span className='secondary-text'>Momentum</span>
                </div>
                <div className='event-filter-category'>
                    <span className='secondary-text'>Duel</span>
                </div>
                <div className='event-filter-category'>
                    <span className='secondary-text'>Volume</span>
                </div>
                <div className='event-filter-category'>
                    <span className='secondary-text'>News</span>
                </div>
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