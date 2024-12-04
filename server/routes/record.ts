import express, {Request, Response} from "express"
import { findAllImmoCards, findOneById } from "../services/immoCards";

// //import db from "../db/connection" // "../db/coneection.js ?"

// import { ObjectId } from "mongodb";

const router = express.Router();

// // All records
router.get('/', async (req: Request, res: Response) => {
    res.send(await findAllImmoCards()).status(200)
});

// //Single record
router.get('/:id', async (req: Request, res: Response) => {
    let id = Number(req.params.id);
    if(!isNaN(id)){
        res.send(await findOneById(id)).status(200)

    }
});

// router.post('/', async (req: Request, res: Response) => {
//     try {
//         let newDocument = {
//             title: req.body.title,
//             tag: req.body.tag,
//             price: req.body.price,
//             text: req.body.text
//         };
//         let collection = await db.collection("immo");
//         let result = await collection.insertOne(newDocument);
//         res.send(result).status(204)
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error adding record");
//     }
// })

// router.patch('/:id', async (req: Request, res: Response) => {
//     try {
//         const query = { _id: new ObjectId(req.params.id)}
//         const updates = {
//             $set: {
//                 title: req.body.title,
//                 tag: req.body.tag,
//                 price: req.body.price,
//                 text: req.body.text
//             },
//         };
//         let collection = await db.collection("immo")
//         let result = await collection.updateOne(query, updates);
//         res.send(result).status(200);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error updating record")
//     }
// });

// router.delete('/:id', async (req: Request, res: Response) => {
//     try {
//         const query = { _id : new ObjectId(req.params.id)};
//         const collection = db.collection('immo')
//         let result = await collection.deleteOne(query)
//         res.send(result).status(200);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error deleting record")
//     }
// })

export default router;