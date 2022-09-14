import bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import joi from 'joi';
import { db } from "../../index.js";

export async function signUp(req, res) {
    const newUser = req.body;

    const userSchema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required()
    });

    const isValidUser = userSchema.validate(newUser);
    if (isValidUser.error) {
        return res.sendStatus(422);
    };

    try {
        const searchUser = await db
            .collection('users')
            .findOne({ email: newUser.email });
        if (searchUser) {
            return res.sendStatus(409);
        }
    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    };

    const salt = 10;
    const passwordHash = bcrypt.hashSync(newUser.password, salt);

    await db
        .collection('users')
        .insertOne({ newUser });
    res.sendStatus(201);

};

