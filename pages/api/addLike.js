import { getMongoDb } from "../../api-lib/mongodb";
import nc from "next-connect";
import auth from '../../middleware/auth'
const handler = nc();
handler.use(auth)

async function addLike(req, res) {
    try {
        switch (req.method) {
            case 'POST':
                let body = JSON.parse(req.body)
                

                return
        default:
            res.json({message: 'only POST allowed'})
            return
        }
    } catch(e) {
        console.error(e)
        res.json({message: 'error'})
    }
}

handler.get(addLike)
export default handler;