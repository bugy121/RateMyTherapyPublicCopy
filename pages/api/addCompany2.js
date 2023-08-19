/*
    adds a company with no restrictions
    For testing purposes only
*/

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

export default handler