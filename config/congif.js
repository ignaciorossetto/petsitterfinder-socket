import dotenv from 'dotenv'
dotenv.config()

export default {
    localUrl: process.env.LOCAL_URL,
    url: process.env.PRODUCTION_URL
}