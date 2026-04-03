import { useInfiniteQuery } from "@tanstack/react-query"
import { Fragment } from "react"
import { useTranslation } from "react-i18next"

import IconLock from '@/assets/icons/icon-lock.svg?react'
import IconCancel from '@/assets/icons/event-icons/icon-cancel.svg?react'
import IconResolved from '@/assets/icons/event-icons/icon-resolved.svg?react'
import IconStar from '@/assets/icons/icon-star.svg?react'
import IconTON from '@/assets/icons/icon-TON.svg?react'

import Score from "../../utility/Score"
import { truncate } from "../../../api"

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

export const EventOptionName = ({ name }) => {
    const { t } = useTranslation()

    let formatName = ''

    if (name === 'Yes' || name === 'No') {
        formatName = t('option.' + name.toLowerCase())
    } else {
        formatName = truncate(name)
    }

    return (
        <span className='secondary-text'>«{formatName}»</span>
    )
}