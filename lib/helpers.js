export const getDateStringForDaysAgo = async (days) => {

	const datetime = getDateTime(days);

    const timezone = getTimezone();

    return datetime + timezone;
}

const getDateTime = (days) => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const date = new Date(Date.now() - days * millisecondsInADay);
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	let hours = date.getHours();
	let minutes = date.getMinutes();
	let seconds = date.getSeconds();

    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;

    return year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds;
}

const getTimezone = () => {
    const timezoneOffset = new Date().getTimezoneOffset();
	let offsetHours = parseInt(Math.abs(timezoneOffset/60));
	let offsetMinutes = Math.abs(timezoneOffset%60);

    if (offsetHours < 10)
        offsetHours = '0' + offsetHours;

    if (offsetMinutes < 10)
        offsetMinutes = '0' + offsetMinutes;

    if (timezoneOffset < 0)
        return '+' + offsetHours + ':' + offsetMinutes;
    else if (timezoneOffset > 0)
        return '-' + offsetHours + ':' + offsetMinutes;
    else
        return 'Z';
}

export const formatDateStringShort = async (dateString) => {
    return dateString.split('T')[0];
}

export const parseResponseBodyToData = async (responseBody) => {
    const parsedResponseBody = JSON.parse(responseBody);
    return parsedResponseBody;
}

export const parseResponseDataToObject = async (responseData, objectName) => {
    const responseObject = responseData.results[objectName];
    const responseKeys = Object.keys(responseObject);
    return { responseObject, responseKeys };
}

export const needsTokenRefresh = async (user) => {
    return user.error && user.error === 'invalid_grant' && user.error_description === 'The access token provided has expired';
}