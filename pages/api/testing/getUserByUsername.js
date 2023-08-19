import { getMongoClient, getMongoDb } from "./../../../api-lib/mongodb";
import nc from "next-connect";
const bson = require('bson');
const handler = nc();
/*
    For Testing Purposes Only
*/

handler.post(getUserByUsername)
async function getUserByUsername(req, res) {
    try {
        console.log('in this function')
        let body = (typeof req.body == 'string')? JSON.parse(req.body) : req.body
        let { username } = body
        const db =  await getMongoDb()
        let user = await db.collection('users').findOne({ username: username})
        if (user == null || user == undefined) {
            res.status(400).json({user: 'none'})
            return
        }
        res.status(200).json({user: user})
        return

    } catch(e) {
        console.error(e)
        res.status(500).json({message: 'Internal Service Error'})
    }
}
export default handler