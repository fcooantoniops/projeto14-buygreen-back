import { db } from "../../index.js";

export async function getProducts(req, res) {

    try {
        const getProducts = await db
            .collection('products')
            .find({})
            .toArray();
        if (!getProducts) {
            return res.sendStatus(500);
        }
        if (getProducts) {
            console.log(getProducts);
            return res.send(getProducts);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };

};