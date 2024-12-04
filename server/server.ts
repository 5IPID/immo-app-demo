import express from "express";
import cors from "cors";
import records from "./routes/record";
import { connectToDb } from "./db/connection";

const PORT = Number(process.env.PORT) || 5050;
// const PORT =  8080;
const HOST = 'localhost'
const app = express();

app.use(cors());
app.use(express.json());
app.use("/record", records);

connectToDb().then(() => {
  app.listen(PORT, HOST, () => {
    console.log(`Server listening on : ${PORT}`)
  }).on('error', (error) => {
    console.error('Erreur lors du démarrage du serveur ! ');
    throw new Error(error.message)
  })
  
}).catch((error: Error) => {
  console.log("Db Con Failed", error)
  process.exit();
});


/*
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});*/