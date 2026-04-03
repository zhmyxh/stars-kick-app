import { useInfiniteQuery } from "@tanstack/react-query"
import { Fragment } from "react"

import IconLock from '@/assets/icons/icon-lock.svg?react'
import IconCancel from '@/assets/icons/event-icons/icon-cancel.svg?react'
import IconResolved from '@/assets/icons/event-icons/icon-resolved.svg?react'
import IconStar from '@/assets/icons/icon-star.svg?react'
import IconTON from '@/assets/icons/icon-TON.svg?react'
import { useTranslation } from "react-i18next"
import Score from "../../utility/Score"

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

export const useEventsInfinite = (lang, server, filter) => {
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