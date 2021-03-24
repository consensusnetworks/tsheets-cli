export const getDateStringForDaysAgo = async (days) => {
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const date = new Date(Date.now() - days * millisecondsInADay);
    return date.toISOString().substr(0, 19) + '-00:00';
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