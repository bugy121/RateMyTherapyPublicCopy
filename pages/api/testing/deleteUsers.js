/*
    Deletes All Companies from testDB/companies collection
    DEPRECATED
*/

import { getMongoClient } from "../../../api-lib/mongodb";


export default async function deleteUsers(req, res) {
    try {
        res.json({message: "deprecated"})
        return
        const client = await getMongoClient() 
        const db =  await client.db('RateMyTherapyCompany')
        switch (req.method) {
            case 'DELETE':
                db.collection('users').deleteMany({})
                res.json({message: "successfully Deleted Everything"})
                break 
            default:
                res.json({message: "only DELETE allowed"})
                break
        }
    } catch (e) {
        console.error(e)
        res.json({message: e}) //test
    }
}