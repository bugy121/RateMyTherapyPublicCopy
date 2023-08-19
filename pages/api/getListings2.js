import { getMongoClient, getMongoDb } from "../../api-lib/mongodb";
import haversine from 'haversine-distance'
import FuzzySearch from "fuzzy-search";

const PAGE_SIZE = 50; //Num of listings returned to user at a time
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY

/* Gets listings, but does it with filters and stuff;
TODO: add lat lng fields to all the listing entries
    finish this function
    filtering should be done after this step

*/

export default async function getListings(req, res) {
    try {
        const db =  await getMongoDb()
        
        switch (req.method) {
            case 'GET':
                let body = req.body;
                let {searchInput, pageNum, specialty, setting, payMin, location} = req.query;

                //check for undefined case and other edge cases
                if (searchInput == undefined || searchInput == "None") searchInput = ""
                if (pageNum == undefined || pageNum == "") pageNum = 0;
                if (specialty == undefined || specialty == "None") specialty = ""
                if (setting == undefined || setting == "None") setting = ""
                if (payMin == undefined || payMin == "") payMin = 0;
                if (location == undefined) location = "";

                if (payMin != '' & isNaN(parseInt(payMin))) {
                    res.status(400).json({message: 'payMin must be a number'})
                    return
                }

                //check is location is valid and store the coords if it is
                let locData = null
                
                if (location != "") {
                    let res2 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GOOGLE_API_KEY}`)
                    const geoData = await res2.json()
                    if (geoData.results.length == 0) {
                        res.status(400).json({message: 'please enter a valid location/address'})
                        return
                    }
                    locData = geoData.results[0].geometry.location;
                }

                //edge case tests finished by this point
                let allListings = await db.collection('jobListings').find({}).toArray();
                const searcher = new FuzzySearch(allListings, ['specialty', 'state', 'city', 'setting', 'weeklyPay'])

                //execute the search with fuzzySearch if input was provided
                if (searchInput != "") {
                    allListings = searcher.search(searchInput)
                }

                //apply all the filters/sort:
                if (specialty != "") allListings = allListings.filter((v) => v.specialty == specialty)
                if (setting != "") allListings = allListings.filter((v) => v.setting == setting)
                allListings = allListings.filter((v) => parseMin(v.weeklyPay) >= payMin)
                if (locData != null) allListings.sort((a, b) => haversine(a.location, locData) - haversine(b.location, locData))
                res.status(200).json({data: allListings.slice(pageNum * PAGE_SIZE, pageNum * PAGE_SIZE + 50), maxPage: Math.floor(allListings.length / PAGE_SIZE)})
                break
            default:
                res.json({message: 'only GET allowed'})
                break
        }
    }
    catch (e) {
        res.json({message: 'error'})
    }
}

/* Takes a string of the form "$XXXX-XXXX" and returns an array with the first number*/
const parseMin = (range) => {
    let str = "$1100 - 1000"
    str = str.slice(1)
    let str1 = ''
    let str2 = ''
    let ind = 0;
    do {
        str1 += str[ind]
        ind++;
        if (ind == str.length) {
            return parseInt(str1)
        }
    } while (str[ind] != '-' && str[ind] != ' ')
    
    let sofar = str.slice(ind)
    while (sofar[0] == '-' || sofar[0] == ' ') {
        sofar = sofar.slice(1)
    }
    return parseInt(str1);
}

/* Order listings by location. pretty much copied from reviewPage: might need to change some stuff (probably) 
    Done in place
*/
async function filterLocation (allListings, locData) {
    allListings.sort((a, b) => {
        return haversine(a.location, locData) - haversine(b.location, locData)
    })
}