import { getMongoClient, getMongoDb } from "./../../../api-lib/mongodb";
import nc from "next-connect";
const bson = require('bson');
const handler = nc();
/*
    For Testing Purposes Only
*/

handler.post(deleteUserById)
async function deleteUserById(req, res) {
    try {
        let body = (typeof req.body == 'string')? JSON.parse(req.body) : req.body
        let { id } = body;
        const db =  await getMongoDb()
        
        let deleted = db.collection('users').deleteOne({ _id: bson.ObjectID(id)})

        res.status(200).json({message: 'done deleting'})

    } catch(e) {
        console.error(e)
        res.status(500).json({message: 'Internal Service Error'})
    }
}
export default handler