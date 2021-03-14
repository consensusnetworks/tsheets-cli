export const getDateStringForDaysAgo = async (days) => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const date = new Date(Date.now() - days * millisecondsInADay);
    return date.toISOString().substr(0, 19) + '-00:00';
}

export const formatDateStringShort = async (dateString) => {
    return dateString.split('T')[0];
}