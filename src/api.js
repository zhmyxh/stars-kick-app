export const tg = window.Telegram?.WebApp
export const tgInitData = tg?.initData || "user=%7B%22id%22%3A894251538%2C%22first_name%22%3A%22Egor%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22zhmyx_h%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FoN4NlSrCXK0YLXcRJj52h1rhnUKL5p_5338IODK5baU.svg%22%7D&chat_instance=3981793611721022947&chat_type=sender&auth_date=1771700049&signature=Y6RZD5mw1kfGGehFOz26OPR_ktnCAtZEbjuNsbB5raRh5usIV4PN0xynnfC2vor8W1o0kfSVKZynTo_pEQS5CQ&hash=62f0e3c7bcce47afe7c0c8fc4ede981257b91ca28125ece1127eec9d901c848b"
export const TTL = 1000 * 60 * 5

const DEFAULT_TIMEOUT = 2000

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

export function utcFormat(utcDate) {
    if (!utcDate) return ''

    const cleanDate = typeof utcDate === 'string' ? utcDate.trim() : utcDate
    const date = new Date(cleanDate)

    if (isNaN(date.getTime())) {
        console.error('utcFormat ERROR: Failed to parse date ->', utcDate)
        return 'Invalid Date'
    }

    return new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date)
}
