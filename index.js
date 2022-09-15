import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import joi from "joi";
import { MongoClient } from "mongodb";
import router from "./src/routes/routes.js";

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
    db = mongoClient.db("buygreen");
    console.log("Running");
  })
  .catch((error) => console.log(error));

app.use(router);

const postCartSchema = joi.object({
  name: joi.string().required(),
  img: joi.string().uri().required(),
  price: joi.number().required(),
  id: joi.number().required(),
});

app.post("/cartShopping", async (req, res) => {
  const { name, img, price, id } = req.body;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.sendStatus(401);
  }

  const validation = postCartSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    const error = validation.error.details.map((value) => value.message);
    return res.status(404).send(error);
  }

  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      res.sendStatus(401);
    }

    const user = await db.collection("users").findOne({
      _id: session.userId,
    });
    if (!user) {
      return res.sendStatus(401);
    }

    await db
      .collection("cartShopping")
      .insertOne({ ...req.body, userId: session.userId });
    res.sendStatus(201);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.get("/cartShopping", async (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.sendStatus(401);
  }

  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      res.sendStatus(401);
    }

    const cartUser = await db
      .collection("cartShopping")
      .find({ userId: session.userId })
      .toArray();
    res.send(cartUser);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.delete("/cartProduct/:idProduct", async (req, res) => {
  const idProduct = req.params.idProduct;
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) {
    res.sendStatus(401);
  }
  try {
    const session = await db.collection("sessions").findOne({ token });
    if (!session) {
      res.sendStatus(401);
    }

    await db.collection("cartShopping").deleteOne({ idProduct });
    res.sendStatus(200);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

app.listen(5000, () => console.log("App running in port 5000"));
