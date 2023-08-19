import { query } from "express";
import { getMongoClient, getMongoDb } from "./../../api-lib/mongodb";
import nc from "next-connect";
import haversine from 'haversine-distance'
const FILTER_LIMIT = 18
const bson = require('bson');
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY
/*
    search/filter query for companies collection
    see notion for more details
*/

const handler = nc();

handler.get(searchCompany)
async function searchCompany(req, res) {
    try {
        const db =  await getMongoDb()

        switch (req.method) {
            case 'GET':
                //setup and formatting
                let { searchinput, locationinput } = req.headers
                let booleanFields = [ 'mostrated', 'highestrated', 'bestpay', 'bestculture', 'bestproductivity' ]
                for (let i = 0; i < booleanFields.length; i++) req.headers[booleanFields[i]] == 'true' ? req.headers[booleanFields[i]] = true : req.headers[booleanFields[i]] = false
                let { mostrated, highestrated, bestpay, bestculture, bestproductivity } = req.headers

                //set up the query pipeline
                let queryPipeline = [];

                if (searchinput != '') {
                    queryPipeline.push({ $search: {
                        index: "companyName",
                        text: {
                            query: searchinput,
                            path: "companyName",
                            fuzzy: {
                                maxEdits: 2,
                                maxExpansions: 80
                            }
                        }
                    }})
                }

                //necessary fields
                queryPipeline.push({ $set: {
                    sumNumReviews: { $sum: '$locations.avgStats.numReviews'},
                }})
                queryPipeline.push({ $set: {
                    avgStars: { $cond: { if: { $gte: [0, '$sumNumReviews' ]},
                        then: 0,
                        else: { $divide: [ { $sum: '$locations.avgStats.s'}, { $size: '$locations'} ]}
                    }},

                    avgCulture: { $cond: { if: { $gte: [0, '$sumNumReviews' ]},
                        then: 0,
                        else: { $divide: [ { $sum: '$locations.avgStats.cc'}, { $size: '$locations'} ]}
                    }},

                    avgPay: { $cond: { if: { $gte: [0, '$sumNumReviews' ]},
                        then: 0,
                        else: { $divide: [ { $sum: '$locations.avgStats.p'}, { $size: '$locations'} ]}
                    }},
                    
                    avgProd: { $cond: { if: { $gte: [0, '$sumNumReviews' ]},
                        then: 0,
                        else: { $divide: [ { $sum: '$locations.avgStats.pr'}, { $size: '$locations'} ]}
                    }},
                }})
                
                if (mostrated) {
                    queryPipeline.push({
                        $sort: { sumNumReviews: -1}
                    })
                }
                if (highestrated) {
                    queryPipeline.push({
                        $sort: {avgStars: -1}
                    })
                }
                if (bestpay) {
                    queryPipeline.push({
                        $sort: {avgCulture: -1}
                    })
                }
                if (bestculture) {
                    queryPipeline.push({
                        $sort: {avgPay: -1}
                    })
                }
                if (bestproductivity) {
                    queryPipeline.push({
                        $sort: {avgProd: -1}
                    })
                }

                //important to limit, may replace this with a pagination feature later
                /*
                queryPipeline.push({
                    $limit: FILTER_LIMIT
                })
                */

                //for testing purposes only
                /*
                queryPipeline.push({
                    $project: {
                        _id: 0,
                        companyName: 1,
                        avgStars: 1,
                        avgPay: 1,
                        avgProd: 1,
                        avgCulture: 1,
                        sumNumReviews: 1,
                    }
                })
                */
                
                
                //console.log('pipeline: ', queryPipeline)

                let queryResult = await db.collection('companies').aggregate(queryPipeline).toArray()
                //queryResult = queryResult.splice(0, Math.min(queryResult.length - 1, 20))
                //Location sorting
                if (locationinput != '') await sortByLocation(locationinput, queryResult)
            
                res.status(200).json({companies: queryResult})
                return
            default:
                res.status(400).json({message: 'only GET allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'server error'})
    }
}

//sorts a list of companies by haversine distance
async function sortByLocation(location, companies) {
    let res = await (fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${GOOGLE_API_KEY}`))
            let data = await res.json()
            if (data.results.length == 0) {
                return
            }

            //console.log('about to begins sorting')
            companies.sort((a, b) => {
                let comp1 = JSON.parse(JSON.stringify(a))
                let comp2 = JSON.parse(JSON.stringify(b))
                
                //this step is necessary since haversince() only takes in an objects with fields latitude/longitude
                let { lat, lng } = a.locations[0].geoLocation
                comp1.locations[0].geoLocation.latitude = lat
                comp1.locations[0].geoLocation.longitude = lng

                comp2.locations[0].geoLocation.latitude = b.locations[0].geoLocation.lat
                comp2.locations[0].geoLocation.longitude = b.locations[0].geoLocation.lng

                return haversine(comp1.locations[0].geoLocation, data.results[0].geometry.location) - haversine(comp2.locations[0].geoLocation, data.results[0].geometry.location)
            })
}

export default handler