export const formatNumber = (num) => {
    if (num < 100000) return num.toString()

    return new Intl.NumberFormat('en-US', {
        notation: 'compact',
        maximumFractionDigits: 1
    }).format(num)
}