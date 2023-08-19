import { getMongoClient, getMongoDb } from "./../../../api-lib/mongodb";
import nc from "next-connect";
const bson = require('bson');
const handler = nc();
/*
    For Testing Purposes Only
*/

handler.post(deleteUserByUsername)
async function deleteUserByUsername(req, res) {
    try {
        console.log(req.body)
        let body = (typeof req.body == 'string')? JSON.parse(req.body) : req.body
        let { username } = body;
        const db =  await getMongoDb()
        
        console.log('username passed in: ', username)
        let deleted = await db.collection('users').deleteOne({ username: username })

        console.log('deleted', deleted)
        res.status(200).json({message: 'done deleting'})


    } catch(e) {
        console.error(e)
        res.status(500).json({message: 'Internal Service Error'})
    }
}
export default handler