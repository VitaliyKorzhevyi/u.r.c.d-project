export const isThreeDaysOld = (createdAt) => {
    const creationDate = new Date(createdAt);
    const currentDate = new Date();
    const timeDifference = currentDate - creationDate;
    const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    return daysDifference >= 7;
};