import { builtinModules } from 'module';
const bson = require('bson');
import nc from "next-connect";
import auth from '../../middleware/auth'
import { validateReview } from './schemas/review';

const handler = nc();
handler.use(auth)
console.log('auth', auth)
import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
/* TODO:
    add authentication
    check if user has already added review
    figure out how to store JSON websites
*/

async function addReview(req, res) {
    try {
        const userID = req.user._id
        const db =  await getMongoDb()
        
        //get the user for future use
        let user = await db.collection('users').findOne({_id: bson.ObjectId(userID)})
        let username = user.username

        switch (req.method) {
            case 'POST':
                let body = JSON.parse(req.body)
                let { reviewData, companyID, isAnonymous, locationIndex} = body
                reviewData.isAnonymous = isAnonymous
                let company = await db.collection('companies').findOne({_id: bson.ObjectId(companyID)})

                //this funciton call will validate all the fields and produce the final company
                let result = validateReview(company, reviewData, locationIndex,  userID, username)
                if (result != 'valid review') {
                    res.status(400).json({message: result})
                    return;
                }
                console.log(JSON.stringify(company, null, 2));


                db.collection('companies').replaceOne({ _id: bson.ObjectId(companyID)}, company)

                //update the users collection
                //this is a relatively new addition, so need to check if it is not contained
                if (user.companiesReviewed == undefined) user.companiesReviewed = [];
                user.companiesReviewed.push({ companyID: companyID, ind: locationIndex })
                db.collection('users').replaceOne({_id: bson.ObjectId(userID)}, user)

                res.status(200).json({message: 'under construction'})
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
handler.post(addReview)
export default handler;