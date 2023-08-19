import validator from 'validator'
import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
import nc from "next-connect";
import auth from '../../middleware/auth'
const handler = nc();
import { validateCompany } from './schemas/company';
const bson = require('bson');

handler.use(auth);
handler.post(addCompany)


async function addCompany(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                const userID = req.user._id
                console.log('userID', userID)
                const db =  await getMongoDb()

                let company = JSON.parse(req.body)
                let result = await validateCompany(company, true)
                console.log(company)
                if (result != 'valid company') {
                    res.status(400).json({message: result})
                    return
                }
                //adding the userID (easier to just do it here than to do it inside the validation function)
                company.addedBy = userID
                
                let existingCompany = await db.collection('companies').findOne({ companyName: company.companyName})
                console.log(existingCompany)
                if (existingCompany != null) {
                    res.status(400).json({message: 'A company with that name already exists'})
                    return
                }
                
                let  { insertedId } = await db.collection('companies').insertOne(company)
                //update the users collection with this new information
                let user = await db.collection('users').findOne({_id: bson.ObjectId(userID)})
                if (user.companiesAdded == undefined) user.companiesAdded = []
                user.companiesAdded.push(insertedId.toString())

                await db.collection('users').replaceOne({_id: bson.ObjectId(userID)}, user)
                

                res.status(200).json({message: 'validation was successful'})
                return;
            default: 
                res.status(500).json({message: "Only POST allowed"})
        }
    } catch (e) {
        console.error(e)
        res.status(500).json({message: 'Internal Service Error, Please Try Again Later'})
    }

}
export default handler