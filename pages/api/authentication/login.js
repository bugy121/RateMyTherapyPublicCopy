import nc from 'next-connect';
import { getMongoClient, getMongoDb } from "../../../api-lib/mongodb";
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken"
import isEmail from 'validator/lib/isEmail';
import normalizeEmail from 'validator/lib/normalizeEmail';
const handler = nc();

const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY
const JWT_EXPIRE_LIMIT = process.env.JWT_EXPIRE_LIMIT

handler.post(login)

async function login(req, res) {
    try {
        const db =  await getMongoDb()

        switch (req.method) {
            case 'POST':
                //setup
                let body;
                if (typeof req.body == 'string') {
                    body = JSON.parse(req.body);
                } else {
                    body = req.body;
                }
                let { email, password } = body;

                //email validaton might also happen client side, but this is just to make sure
                if (!isEmail(email)) {
                    res.status(400).json({ message: "email or password incorrect" })
                    break;
                }
                email = normalizeEmail(email)

                //check email has a match
                let user = await db.collection('users').findOne({ email: email })
                if (user == null) {
                    res.status(400).json({ message: "email or password incorrect" })
                    break;
                }

                

                //check password
                if (!(await bcrypt.compare(password, user.password))) {
                    res.status(400).json({ message: "email or password incorrect" })
                    break;
                }

                let newToken;
                const payload = { _id: user._id}
                jwt.sign(payload, PRIVATE_KEY, { expiresIn: JWT_EXPIRE_LIMIT}, (err, token) => {
                if (err) {
                    console.log(err)
                    res.status(400).json({message: 'could not geneate JWT token'})
                }
                res.status(200).json({ token: token})
                return
                })
                return
            default:
                res.status(400).json({message: 'only POST allowed'})
        }
    }
    catch (e) {
        console.log(e)
        res.json({message: 'server error'})
    }
}

export default handler

