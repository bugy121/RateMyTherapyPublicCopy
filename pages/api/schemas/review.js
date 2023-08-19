/* 
    Schema for review. This can be found inside of each location JSON for each company
*/ 

function validateReview(company, review, locationIndex, userID, username) {
    const fields = [ 'wr', 'p', 'cc', 'l', 'pr', 's', 'isAnonymous']

    for (let i = 0; i < fields.length; i++) {
        if (!review.hasOwnProperty(fields[i])) return 'missing required field'
    }

    if (review.wr.length < 10) return 'review is too short'

    for (let i = 0; i < company.locations[locationIndex].reviews.length; i++) {
        if (company.locations[locationIndex].reviews[i].userID == userID) {
            return 'You have already reviewed this location'
        }
    }
    review.username = username
    review.userID = userID
    review.datePosted = currentDate();
    company.locations[locationIndex].reviews.push(review)

    let avgStats = {};
    const newFields = ['p', 'cc', 'l', 'pr', 's']
    for (let i = 0; i < newFields.length; i++) {
        console.log(computeAvg(company.locations[locationIndex], newFields[i]))
        avgStats[newFields[i]] = computeAvg(company.locations[locationIndex], newFields[i])
    }
    avgStats.numReviews = company.locations[locationIndex].reviews.length
    company.locations[locationIndex].avgStats = avgStats;
    return 'valid review'
}

//computes average of reviews within location according to 'field'
function computeAvg(location, field) {
    let sum = 0;
    for (let i = 0; i < location.reviews.length; i++) {
        sum += parseInt(location.reviews[i][field]);
    }
    console.log('sum: ', field ,' ', sum)
    return Math.ceil(sum / location.reviews.length)
}

function currentDate() {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = now.getUTCMonth() + 1;
    const day = now.getUTCDate();
    const hours = now.getUTCHours();
    const minutes = now.getUTCMinutes();
    const seconds = now.getUTCSeconds();
    const milliseconds = now.getUTCMilliseconds();
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
}

module.exports = { validateReview }