export const handleResponseCode = (responseItem, action) => {
    if (updatedStatus._status_code === 200 && action) {
        console.log(`\nSuccessfully ${action}!`);
    }
    console.log(`\nError: ${responseItem._status_extra}`);
}