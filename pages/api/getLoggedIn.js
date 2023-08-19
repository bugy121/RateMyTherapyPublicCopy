import { getMongoDb } from "../../api-lib/mongodb";
import { getMongoClient } from "./../../api-lib/mongodb";
const bson = require('bson');
const jwt = require("jsonwebtoken");
import nc from "next-connect";
import auth from '../../middleware/auth'
const handler = nc();
handler.use(auth)

/*This is also referenced in middleware/auth and 
    NEEDS TO BE AN ENVIRONMENT VARIABLE */
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY

/* Gets LoggedIn User, which includes: username, email, image (future) */
async function getLoggedIn(req, res) {
    try {
        //get information about the user once authentication is finished
        const db =  await getMongoDb()

        //decode token
        let token = req.headers.token;
        const decoded = jwt.verify(token, PRIVATE_KEY);
        const userID = decoded._id

        //retrieval
        let userData = await db.collection('users').findOne({_id: bson.ObjectId(userID)})
        res.status(200).json({user: userData})

    } catch(e) {
        console.error(e)
        res.json({message: 'error'})
    }
}

handler.get(getLoggedIn)
export default handler;