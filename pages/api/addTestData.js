import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
const GOOGLE_API_KEY = 'AIzaSyCTFjsOkOx6a2s8WoIS9pHFfdiqGTOECv8'
const exampleAddresses = [
    'Lodi, CA',
    'Berkely, CA',
    'Fresno, CA',
    'Modesto, CA',
    'Tracy, CA',
    'Oakland, CA',
    'Stockton, CA',
    'San Francisco, CA',
    'Sacramento, CA',
    'San Jose, CA',
    'Santa Cruz, CA'
]
const exampleNames = [
    'Best Therapy',
    'Therapy 101',
    'Therapy',
    'Therapy Company',
    'Cool Therapy',
    'Bad Therapy',
    'Mid Therapy',
    'Great Therapy',
    'Theeeerraaaappy',
    'please come here'
]

async function addTestData(req, res) {
    try {
        const db =  await getMongoDb()
        switch (req.method) {
            case 'POST':
                for (let i = 0; i < 10; i++) {
                    let response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${exampleAddresses[i]}&key=${GOOGLE_API_KEY}`)
                    let data = await response.json()
                    console.log(data.results)
                    let location = { lat: '', lng: ''}
                    if (data.results.length != 0) {
                        location = data.results[0].geometry.location
                    }
                    let company = {
                        companyName: exampleNames[i],
                        address: exampleAddresses[i],
                        location: location,
                        phoneNumber: '999 929 1919',
                        website: 'www.com',
                        description: 'this is a description',
                        avgStars: 5,
                        reviews: []
                    }
                    await db.collection("companies").insertOne(company)
                }
                res.json({message: 'success'})
            default:
                res.json({message: 'only POST allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'error'})
    }
}

export default addTestData

async function postRandom () {

}