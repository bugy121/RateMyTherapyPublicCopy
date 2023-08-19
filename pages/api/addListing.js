import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
import nc from "next-connect";
const handler = nc();

/* TODO: add DELETE function for removing all existing listings*/
async function addListing(req, res) {
    try {
        const db =  await getMongoDb()
        let body = JSON.parse(req.body)
        await db.collection('jobListings').insertOne(body)
        res.status(200).json({message: 'successfully added listing'})

    } catch(e) {
        console.error(e)
        res.status(504).json({message: 'error'})
    }
}
handler.post(addListing)
export default handler