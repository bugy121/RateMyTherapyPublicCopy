import { builtinModules } from 'module';
const bson = require('bson');
import nc from "next-connect";
import auth from '../../middleware/auth'

const handler = nc();
handler.use(auth)
console.log('auth', auth)
import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
/* TODO:
    add authentication
    check if user has already added review
    figure out how to store JSON websites
*/
function addToAverage(oldAvg, newVal, newSize) {
    return (oldAvg + ((newVal - oldAvg) / newSize))
}
async function addReview(req, res) {
    try {
        const userID = req.user._id
        const db =  await getMongoDb()
        
        //get the user for future use
        let user = await db.collection('users').findOne({_id: bson.ObjectId(userID)})

        switch (req.method) {
            case 'POST':
                //console.log(req.body)
                let body = JSON.parse(req.body)
                //console.log('body: ', body)
                if (!body.hasOwnProperty('reviewData') || !body.hasOwnProperty('companyID')) {
                    res.json({message: 'need ReviewData'})
                    return
                }
                let { reviewData, companyID, isAnonymous} = body
                console.log('reviewww', reviewData.writtenReview)

                //check review length
                if (reviewData.writtenReview.length < 5) {
                    res.status(406).json({message: 'Review Is Too Short'})
                    return
                }
                

                //console.log('reviewData', reviewData, 'companyId', companyID)
                let comp = await db.collection('companies').findOne({_id: bson.ObjectId(companyID)})

                //Check if user has already left a review
                for (let k = 0; k < comp.reviews.length; k++) {
                    console.log(userID)
                    console.log(comp.reviews[k].userId)
                    if (comp.reviews[k].userId == userID) {
                        res.status(400).json({message: 'You Have Already Reviewed This Company'})
                        return
                    }
                }

                const d = new Date();
                const datePosted = {
                    day: d.getDate(),
                    month: d.getMonth() + 1,
                    year: d.getFullYear()
                }

                let currUser = await db.collection('users').findOne({_id: bson.ObjectId(userID)})
                if (currUser.companiesReviewed == null) {
                    currUser.companiesReviewed = [companyID]
                } else {
                    currUser.companiesReviewed.push(companyID)
                }
                await db.collection('users').replaceOne({_id: bson.ObjectId(userID)}, currUser)


                reviewData.datePosted = datePosted
                reviewData.userId = userID
                reviewData.isAnonymous = isAnonymous
                reviewData.userName = user.username
                comp.reviews.push(reviewData)
                //oldAvg, newVal, newSize
                if (comp.avgStats.numReviews == 0) {
                    comp.avgStats.avgS = reviewData.stars
                    comp.avgStats.avgC = reviewData.companyCulture
                    comp.avgStats.avgP = reviewData.pay
                    comp.avgStats.avgPr = reviewData.productivityRequirement
                    comp.avgStats.avgL = reviewData.location
                    comp.avgStats.numReviews = 1
                } else {
                    comp.avgStats.avgS = addToAverage(comp.avgStats.avgS, reviewData.stars, comp.avgStats.numReviews + 1)
                    comp.avgStats.avgC = addToAverage(comp.avgStats.avgC, reviewData.companyCulture, comp.avgStats.numReviews + 1)
                    comp.avgStats.avgP = addToAverage(comp.avgStats.avgP, reviewData.pay, comp.avgStats.numReviews + 1)
                    comp.avgStats.avgPr = addToAverage(comp.avgStats.avgPr, reviewData.productivityRequirement, comp.avgStats.numReviews + 1)
                    comp.avgStats.avgL = addToAverage(comp.avgStats.avgL, reviewData.location, comp.avgStats.numReviews + 1)
                    comp.avgStats.numReviews++
                }
                console.log('comp', comp)
                
                db.collection('companies').replaceOne({_id: bson.ObjectId(companyID)}, comp)
                res.json.status(200).json({message: 'success'})
                break
            default:
                res.json({message: 'only POST allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'error'})
    }
}
handler.post(addReview)
export default handler;
