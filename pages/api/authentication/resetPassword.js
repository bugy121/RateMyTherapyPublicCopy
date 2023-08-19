import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";
import nc from "next-connect";
import bcrypt from 'bcryptjs';
const handler = nc();
const bson = require('bson');

//should be environment variable
const TOKEN_EXPIRE_LIMIT = process.env.JWT_EXPIRE_LIMIT

handler.post(resetPassword)
async function resetPassword(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                const db =  await getMongoDb()
                
                let { password, secret_key, email } = JSON.parse(req.body)
                //console.log(password, secret_key, email)
                //Important checks
                let user = await db.collection('users').findOne({email: email});

                /*
                console.log(user == null)
                console.log((Date.now() - user.resetToken.dateCreated) > TOKEN_EXPIRE_LIMIT)
                console.log(secret_key != user.resetToken.secretKey)
                */

                if (user == null || (Date.now() - user.resetToken.dateCreated) > TOKEN_EXPIRE_LIMIT || secret_key != user.resetToken.secretKey || user.resetToken.completed) {
                    res.status(400).json({ message: 'link is invalid or has expired'})
                    return;
                }

                //encryption
                password = await bcrypt.hash(password, 10);
                
                //important to update this so link doesn't work afterwards
                user.resetToken.completed = true
                user.password = password
                console.log('new user: ', user)

                db.collection('users').replaceOne({_id: bson.ObjectId(user._id)}, user)

                res.status(200).json({message: 'successfully reset password'})
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