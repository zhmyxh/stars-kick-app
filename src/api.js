export const tg = window.Telegram?.WebApp
export const tgInitData = tg?.initData || "query_id=AAESMk01AAAAABIyTTUgaVdC&user=%7B%22id%22%3A894251538%2C%22first_name%22%3A%22Egor%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22zhmyx_h%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FoN4NlSrCXK0YLXcRJj52h1rhnUKL5p_5338IODK5baU.svg%22%7D&auth_date=1774557240&signature=g9c4elNgR2DPW8Miw2UW1NNdO4NGZ_qZnQbxkvaBWoGoLvxFKNHzBFejiD2wzM_3Rop3X9p9A-jQHeqksiR5AA&hash=7dfd0dcfefcaba0d0de639c5ddc059232a3413cbf149efda9be5f7c93fd70cc3"

export const TTL = 1000 * 60 * 5
const DEFAULT_TIMEOUT = 10000

function buildQuery(params = {}) {
    const query = new URLSearchParams()

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null) return

        if (Array.isArray(value)) {
            value.forEach(v => query.append(key, v))
        } else {
            query.append(key, value)
        }
    })

    const queryString = query.toString()
    return queryString ? `?${queryString}` : ''
}

async function request(url, {
    method = 'GET',
    headers = {},
    body,
    params,
    timeout = DEFAULT_TIMEOUT,
} = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
        const fullUrl = url + buildQuery(params)

        const response = await fetch(fullUrl, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers,
            },
            body,
            signal: controller.signal,
        })

        const contentType = response.headers.get('content-type')
        const isJSON = contentType?.includes('application/json')

        const data = isJSON
            ? await response.json()
            : await response.text()

        if (!response.ok) {
            const error = new Error('HTTP Error')
            error.status = response.status
            error.data = data
            throw error
        }

        return data
    } catch (err) {
        if (err.name === 'AbortError') {
            throw new Error('Request timeout')
        }
        throw err
    } finally {
        clearTimeout(timer)
    }
}

export async function httpGet(url, options = {}) {
    return request(url, {
        ...options,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-telegram-init-data': tgInitData,
            ...options.headers,
        },
        body: undefined,
    })
}

export async function httpPost(url, data = {}, options = {}) {
    return request(url, {
        ...options,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-telegram-init-data': tgInitData,
            ...options.headers,
        },
        body: JSON.stringify(data),
    })
}

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { t } from 'i18next'

export function utcFormat(utcDate) {
    if (!utcDate) return ''

    const cleanDate = typeof utcDate === 'string' ? utcDate.trim() : utcDate
    const date = new Date(cleanDate)

    if (isNaN(date.getTime())) {
        console.error('utcFormat ERROR: Failed to parse date ->', utcDate)
        return 'Invalid Date'
    }

    const day = date.getUTCDate()
    const year = date.getUTCFullYear()
    const monthIndex = date.getUTCMonth()

    const monthKeys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']
    const monthName = t(`month.${monthKeys[monthIndex]}`)

    return `${monthName} ${day}, ${year}`
}

export function getTimeLeft(dateString) {
    const target = new Date(dateString).getTime()
    const now = Date.now()

    let diff = target - now

    if (diff <= 0) {
        return `0 ${t('warning.minutesleft')}`
    }

    const minute = 60 * 1000
    const hour = 60 * minute
    const day = 24 * hour

    const days = Math.floor(diff / day)
    const hours = Math.floor(diff / hour)
    const minutes = Math.floor(diff / minute)

    if (days > 0) {
        return `${days} ${t('warning.daysleft')}`
    }

    if (hours > 0) {
        return `${hours} ${t('warning.hoursleft')}`
    }

    if (minutes > 0) {
        return `${minutes} ${t('warning.minutesleft')}`
    }

    return `1 ${t('warning.minutesleft')}`
}

export const useEventsFromCache = (key) => {
    return useQuery({
        queryKey: key,
        enabled: false,
    }).data
}

export const truncate = (str, limit = 20) => {
    if (!str) return ''
    return str.length > limit ? str.substring(0, limit) + '...' : str
}