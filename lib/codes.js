export const handleResponseCode = (responseItem, action) => {
    if (responseItem._status_code === 200 && action) {
        console.log(`\nSuccessfully ${action}!`);
    } else {
        console.log(`\nError: ${responseItem._status_extra}`);
    }
}