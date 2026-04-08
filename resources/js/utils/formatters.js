export function formatDateTime(value) {
    if (!value) {
        return '-';
    }

    try {
        return new Date(value).toLocaleString();
    } catch (error) {
        return value;
    }
}

export function formatPercent(value) {
    const numericValue = Number(value || 0);
    return `${numericValue.toFixed(2)}%`;
}

export function formatNumber(value, decimals = 2) {
    const numericValue = Number(value || 0);
    return numericValue.toFixed(decimals);
}