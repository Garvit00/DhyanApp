/* eslint-disable @typescript-eslint/no-explicit-any */
function getTime(firebaseTime:any) {
    const date = new Date(firebaseTime);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    const dateString = `${day} ${monthNames[month]} ${year}`;

    return dateString;
}

export default getTime;