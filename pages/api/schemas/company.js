const validator = require('validator');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY // should be env variable
/*
    Validates company schema before it can be sent to the database.
    Throws error if schema is invalid and adds any defaults to optional fields or adds
    any mandatory fields not added by client side
*/

async function validateCompany(company, addLocations) {
    //TODO: implement
    console.log('1')
    const mandatoryFields = ['companyName', 'specialties', 'locations', ]
    for (let i = 0; i < mandatoryFields.length; i++) {
        if (!company.hasOwnProperty(mandatoryFields[i])) return `missing required fields`
    }

    const optionalFields = ['website', 'description'] //website field has a default of null, description has a default of ""
    if (!company.hasOwnProperty('description')) {
        company.description = ""
    }
    
    let {companyName, phoneNumber, specialties, description, hasMultipleLocations, website, locations} = company
    
    if (companyName == '') return 'must provide company name'
    if (companyName.length > 25) return 'Name Is Too Long'
    if (companyName.length < 3) return 'Name Is Too Short'
    
    if (description != "" && description.length > 300) return 'Description Too Long' //description is "" if not provided
    
    console.log(website != '' && website.length > 300)
    if (website != '' && website.length > 300) return 'Invalid Website' //default for website is also ""

    if (specialties.length == 0) return 'Must pick at least one specialty'

    if (locations.length > 7) return 'Too many locations'

    //make sure this section of code is only called once
    const date = currentDate()
    for (let i  = 0; i < locations.length; i++) {
        let { street, city, state, phoneNumber } = locations[i]
        let address = street + ' ' + city + ', ' + state
        
        if (address == '' || state == '' || state == '') return 'Invalid Address'
        if (addLocations) {
            let res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`)
            let data = await res.json()    
            if (data.results.length == 0) return 'Invalid Address'
            company.locations[i].geoLocation = data.results[0].geometry.location
        }
        
        if (phoneNumber != '' && phoneNumber.indexOf(' ') >= 0) return 'Phone number must not include spaces'
        if (phoneNumber != '' && !validator.isMobilePhone(phoneNumber)) {
            return 'invalid Phone Number'
        }

        //add the datePosted field
        locations[i].datePosted = date;

        //add the default review data
        company.locations[i].avgStats = {
            s: 5,
            cc: 0,
            l: 0,
            p: 0,
            pr: 0,
            numReviews: 0
        }
        company.locations[i].reviews = []
    }
    return 'valid company'
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

module.exports = { validateCompany }