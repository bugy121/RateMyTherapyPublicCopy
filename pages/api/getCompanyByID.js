import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";

const bson = require('bson');

export default async function getCompanyByID(req, res) {
    try {
        const db =  await getMongoDb()
        switch (req.method) {
            case 'GET':
                if (!req.headers.hasOwnProperty('_id')) {
                    res.json({message: 'no header'})
                    break
                }
                let data = await db.collection('companies').findOne({_id: bson.ObjectId(req.headers._id)})
                

                //adding in the profile picture data
                for (let i = 0; i < data.locations.length; i++) {
                    for (let k = 0; k < data.locations[i].reviews.length; k++) {
                        let review = data.locations[i].reviews[k]
                        if (review.isAnonymous) continue;

                        let userData = await db.collection('users').findOne({_id: bson.ObjectId(review.userID)})
                        let imageUrl;
                        if (userData.profilePicture == null) {
                            imageUrl = ''
                        } else {
                            imageUrl = userData.profilePicture
                        }
                        review.profilePicture = imageUrl

                    }
                }
                
                res.json({company: data})
                break
            default:
                res.json({message: 'ONLY GET ALLOWED'})
                break

        }
    } catch (e) {
        res.json({message: 'error'})
        console.log(e)
    }
}