import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";

/* Test For Inserting Simple Data Into Mongo Databse */

export default async (req, res) => {
    try {
        const db =  await getMongoDb()
        switch (req.method) {
            case 'POST': 
                let newData = {
                    sampleData: "data"
                }
                await db.collection("testing_Manuel").insertOne(newData)
                res.json({message: "POST Success"})
            default:
                res.json({message: "ERROR: Only POST allowed"})
        }
    }
    catch (e) {
        console.log(e)
    }
}