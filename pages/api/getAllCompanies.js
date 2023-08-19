
import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";


export default async function getAllCompanies(req, res) {
    try {
        const db =  await getMongoDb()

        switch (req.method) {
            case 'GET':
                const allPosts = await db.collection('companies').find({}).toArray();
                res.json({data: allPosts})
                break
            default:
                res.json({message: 'only GET allowed'})
                break
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'error'})
    }
}