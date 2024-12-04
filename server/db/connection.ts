import { Collection, Db, MongoClient, ServerApiVersion } from "mongodb";

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/';
const client = new MongoClient(uri, {
    serverApi : {
        version : ServerApiVersion.v1,
        strict : true,
        deprecationErrors : true,
    },
});

export async function connectToDb(){
    try {//TODO ADD Async function
        await client.connect()
        await client.db("admin").command({ping: 1});
        console.log(
            "Pinged your deployement.  You succesfully connected to MongoDb"
        )
        const db:Db = client.db('immo-cards');
        const immoCollection: Collection = db.collection('immoCards');
        collections.immoCards = immoCollection;
        return collections.immoCards
    } catch (error) {
        console.error(error)
        throw error
    }

}

export const collections: {immoCards?: Collection} = {}
