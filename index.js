import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';
import router from './src/router/routes.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
dotenv.config();

const mongoClient = new MongoClient(process.env.MONGO_URI);
export let db;

mongoClient
    .connect()
    .then(() => {
        db = mongoClient.db('buygreen');
        console.log('Running');
    })
    .catch((error) => console.log(error));

app.use(router);

app.listen(5000, () => console.log("App running in port 5000"));