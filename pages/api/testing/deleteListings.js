import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";
/* Deletes all Listings from DB
    ***Only for Testing Purposes***
    DEPRECATED
*/

export default async function DeleteListings(req, res) {
    try {
        const db =  await getMongoDb()


        switch (req.method) {
            case 'DELETE':
                await db.collection('jobListings').deleteMany({})
                res.json({message: 'successfully deleted listings'})
                break
            default:
                res.json({message: 'only DELETE allowed'})
                break
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'error'})
    }
}