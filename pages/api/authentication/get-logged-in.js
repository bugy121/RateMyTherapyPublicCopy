import nc from 'next-connect';
import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";
import auth from '../../../middleware/auth'
const bson = require('bson');
const handler = nc();
handler.use(auth);

handler.get(getLoggedIn)
async function getLoggedIn(req, res) {
    try {
        const db =  await getMongoDb()
        const userID = req.user._id

        switch (req.method) {
            case 'GET':
                let user = await db.collection('users').findOne({_id: bson.ObjectId(userID)})
                res.status(200).json({ user: user})
                return;
            default:
                res.status(400).json({message: 'only GET allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.status(500).json({message: 'server error'})
    }
}

export default handler