import validator from 'validator'
import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
import nc from "next-connect";
import auth from '../../middleware/auth'
const bson = require('bson');
import { validateLocation } from './schemas/location'
/*
    Adds a location to an existing company
*/

const handler = nc();
handler.use(auth)

handler.post(addLocation)
async function addLocation(req, res) {
    try {
        
        const db =  await getMongoDb()
        const userID = req.user._id

        switch (req.method) {
            case 'POST':
                let body = JSON.parse(req.body)
                let { location, companyID } = body;
                let result = await validateLocation(location, userID)
                if (result != 'valid location') {
                    res.status(400).json({message: result})
                    return
                }
                
                //replace company/user in the database with updated information
                const originalCompany = await db.collection('companies').findOne({_id: bson.ObjectId(companyID)})
                const user = await db.collection('users').findOne({_id: bson.ObjectId(userID)})
                
                console.log('original company', originalCompany)
                originalCompany.locations.push(location)
                
                //this feature is relatively new, so must make sure its there
                if (user.locationsAdded == undefined) user.locationsAdded = []
                user.locationsAdded.push({companyID: companyID, ind: originalCompany.locations.length - 1})

                db.collection('companies').replaceOne({_id: bson.ObjectId(companyID)}, originalCompany)
                db.collection('users').replaceOne({_id: bson.ObjectId(userID)}, user)

                res.status(200).json({message: 'success'})
                return
            default:
                res.status(400).json({message: 'only POST allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'server error'})
    }
}

export default handler