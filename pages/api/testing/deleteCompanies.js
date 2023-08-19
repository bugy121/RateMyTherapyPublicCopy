/*
    Deletes All Companies from testDB/companies collection
    DEPRECATED
*/

import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";

/* Deprecated */

export default async function deleteCompanies(req, res) {
    try {
        res.json({message: "deprecated"})
        return
        const db =  await getMongoDb()
        switch (req.method) {
            case 'DELETE':
                db.collection('companies').deleteMany({})
                res.json({message: "successfully Deleted Everything"})
                break
            default:
                res.json({message: "only DELETE allowed"})
                break
        }
    } catch (e) {
        console.error(e)
        res.json({message: e})
    }
}