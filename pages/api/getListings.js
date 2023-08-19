import { getMongoClient, getMongoDb } from "../../api-lib/mongodb";
import FuzzySearch from "fuzzy-search";

const PAGE_SIZE = 50; //Num of listings returned to user at a time

/* Requires two inputs in the body:
    {
        searchInput: "",
        pageNum: int,
    }
    if searchInput is "", return all listings
*/
export default async function getListings(req, res) {
    try {
        const db =  await getMongoDb()
        
        switch (req.method) {
            case 'GET':
                let body = req.body;
                let {searchInput, pageNum} = req.query;
                if (searchInput == undefined) searchInput = ""
                if (pageNum == undefined) pageNum = 0;

                let allListings = await db.collection('jobListings').find({}).toArray();
                const searcher = new FuzzySearch(allListings, ['specialty', 'state', 'city', 'setting', 'weeklyPay'])

                if (searchInput == "") {
                    res.json({data: allListings.slice(pageNum * PAGE_SIZE, pageNum * PAGE_SIZE + 50), maxPage: Math.floor(allListings.length / PAGE_SIZE)})
                    break;
                }

                //execute the search
                allListings = searcher.search(searchInput)
                res.json({data: allListings.slice(pageNum * PAGE_SIZE, pageNum * PAGE_SIZE + 50), maxPage: Math.floor(allListings.length / PAGE_SIZE)})
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