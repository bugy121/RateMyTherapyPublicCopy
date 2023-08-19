import validator from 'validator'
import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
import nc from "next-connect";
import auth from '../../middleware/auth'

const handler = nc();

//make sure to use auth middleware later
//handler.use(auth)
//this should be env variable
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

/* Add a single company to database
 TODO: link authentication middleware
*/

handler.post(addCompany)
async function addCompany(req, res) {
    try {
        
        const db =  await getMongoDb()
        switch (req.method) {
            case 'POST':
                console.log('body', req.body)
                let newCompany = JSON.parse(req.body);

                console.log(newCompany)
                newCompany.avgStars = 5;
                newCompany.avgStats = {
                    avgS: 5,
                    avgC: 0,
                    avgL: 0,
                    avgP: 0,
                    avgPr: 0,
                    numReviews: 0
                }
                newCompany.reviews = []
                if (!validateContainsFields(newCompany)) {
                    res.status(403).json({message: 'missing required fields'})
                    break
                }
                console.log('contains fields!')
                let isFieldsValid = await validateFields(newCompany)
                if (isFieldsValid) {
                    res.status(403).json({message: isFieldsValid})
                    break
                }
                if (newCompany.specialties.length == 0) {
                    res.status(403).json({message: 'must pick atleast one specialty'})
                    return;
                }

                await db.collection("companies").insertOne(newCompany)
                res.json({message: 'success'})
                break
            default:
                res.json({message: 'only POST allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'server error'})
    }
}

function validateContainsFields(company) {
    const fields = ['companyName', 'streetAddress', 'city', 'state', 'phoneNumber', 'website', 'description']
    for (let i = 0; i < fields.length; i++) {
        console.log(fields[i])
        if (!company.hasOwnProperty(fields[i])) return false
    }
    return true
}
async function validateFields(company) {
    let {companyName, streetAddress, city, state, phoneNumber, website, description} = company
    let address = streetAddress + ' ' + city + ', ' + state

    if (!companyName.length > 25) return 'Name Is Too Long'
    
    if (!validator.isMobilePhone(phoneNumber)) return 'Invalid Phone Number'
    
    if (!description.length > 300) return 'Description Too Long'
    
    if (!website.length > 150) return 'Invalid Website'

    if (streetAddress == '' || city == '' || state == '') return 'Missing Required Fields'

    console.log("address:" ,address);
    let res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_API_KEY}`)
    let data = await res.json()
    console.log("results", data.results)
    if (data.results.length == 0) return 'Invalid Address'

    //Adding the converted lat lng data to company JSON
    console.log(data)
    company.location = data.results[0].geometry.location

    return false
}
export default handler

