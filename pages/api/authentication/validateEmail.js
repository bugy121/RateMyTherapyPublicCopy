import { builtinModules } from 'module';
const bson = require('bson');
import nc from "next-connect";
import auth from '../../../middleware/auth'
import { validateReview } from '../schemas/review';

const handler = nc();
import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";

/* TODO:
    add authentication
    check if user has already added review
    figure out how to store JSON websites
*/

async function validateEmail(req, res) {
    try {
        const db =  await getMongoDb()
        
        switch (req.method) {
            case 'POST':
                let {email, secretKey } = JSON.parse(req.body)
                console.log('email: ', email)
                console.log('secretKey: ', secretKey)

                let user = await db.collection('users').findOne({ email: email})
                //console.log('the user itself', user)
                //console.log('the users validation key: ', user.emailValidationKey)
                //console.log('are they equal?: ', secretKey === user.emailValidationKey)
                if (user == null || user == undefined) {
                    res.status(400).json({message: 'Link is invalid, please make sure this is the correct link'})
                    return
                }
                if (user.emailVerified) {
                    res.status(200).json({message: 'Email has already been validated'})
                    return
                }
                if (secretKey != user.emailValidationKey) {
                    res.status(400).json({ message: 'Link is invalid, please make sure this is the correct link'})
                    return
                }

                user.emailVerified = true
                await db.collection('users').replaceOne({email: email}, user)
                
                res.status(200).json({message: 'Email Successfully Validated'})
                break
            default:
                res.status(400).json({message: 'only POST allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'error'})
    }
}
handler.post(validateEmail)
export default handler;