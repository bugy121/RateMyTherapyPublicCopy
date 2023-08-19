const validator = require('validator');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY


async function validateLocation(location, userID) {
    let { city, state, street, phoneNumber } = location

    //basic checks
    if (city == '') return 'invalid city'
    if (state == '') return 'invalid state'
    if (street == '') return 'invalid street'
    if (phoneNumber != '' && !validator.isMobilePhone(phoneNumber)) return 'invalid phone number'

    //checking if the address is correct
    let address = `${street} ${city}, ${state}`
    let res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`)
    let data = await res.json()    
    if (data.results.length == 0) return 'Invalid Address'
    location.geoLocation = data.results[0].geometry.location
    
    //finish adding required fields
    location.addedBy = userID
    location.datePosted = currentDate()
    location.avgStats = {
        s: 5,
        cc: 0,
        l: 0,
        p: 0,
        pr: 0,
        numReviews: 0,
    }
    location.reviews = []

    return 'valid location'
}

//Format EX: 2023-5-20 16:31:15.336
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

module.exports = { validateLocation }