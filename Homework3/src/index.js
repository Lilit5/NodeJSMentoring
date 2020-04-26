const Joi = require('@hapi/joi');
const express = require('express');
const schema = require('./schemas/users.post.schema');
import { utils } from './common/utils';
import { GET_FROM_TABLE, CREATE_USERS_TABLE, TABLE_NAME } from "./common/constants";
import { raw } from 'express';

const tableName = TABLE_NAME;
// (async function () {
//     const table1 = await utils.sendQuery(CREATE_USERS_TABLE(tableName));
//     console.log("table1 ", table1);
// }());
(async function () {
    const table1 = await utils.sendQuery(GET_FROM_TABLE(tableName));
    console.log("table1.1 ", table1);
}());

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send("!!! Hello world !!!");
});

app.post('/users', async (req, res, next) => {
    const validateionResp = Joi.validate(req.body, schema);
    const users = await utils.sendQuery(GET_FROM_TABLE(tableName));
    console.log("usersssssssssssssssss ", users[0]);
    const error = validateionResp.error ? validateionResp.error.details :
        users.find(user => user.login === req.body.login) ?
            { message: `User with username "${req.body.login}" already exists` } : null;
    if (error) {
        res.status(400).send(error);
        return;
    }
    const user = {
        id: users.length + 1,
        login: req.body.login,
        password: req.body.password,
        age: req.body.age,
        isdeleted: false
    }
    const response = await utils.objectCreateQuery(user);
    console.log("response ------ ", response);
    res.send(response.dataValues);
});

app.put('/users/:id', async (req, res) => {
    const users = await utils.Users.findAll({ raw: true });
    if (req.params.id > users.length || req.params.id < 1) {
        res.status(400).send({ message: `User with id ${req.params.id} doesn't exist` });
    } else {
        const validateionResp = Joi.validate(req.body, schema);
        if (validateionResp.error) {
            res.status(400).send(validateionResp.error.details);
        } else {
            // const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
            // users[userIndex].login = req.body.login;
            // users[userIndex].password = req.body.password;
            // users[userIndex].age = req.body.age;
            const result = await utils.objectUpdateQuery({
                 login: req.body.login,
                 password: req.body.password,
                 age: req.body.age
                }, req.params.id);
                console.log("result puuuuuuut ", result);
            res.send(result[1]);
        }
    }
})

app.get('/users/:id', async (req, res) => {
    const users = await utils.sendQuery(GET_FROM_TABLE(tableName));
    if (req.params.id > users.length || req.params.id < 1) {
        res.status(400).send({ message: `User with id ${req.params.id} doesn't exist` });
    } else {
        const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
        res.send(users[userIndex]);
    }
});

app.get('/users', async (req, res) => {
    if (req.query.loginContains) {
        try {
            const autoSuggestUsers = await utils.getAutoSuggestUsers(req.query.loginContains);
            res.send(autoSuggestUsers);
        } catch (exception) {
            res.status(400).send(exception);
        }
    } else {
        const users = await utils.sendQuery(GET_FROM_TABLE(tableName));
        res.send(users);
    }
});

app.delete('/users/:id', async (req, res) => {
    // const table = await utils.Users.findAll({where: isdeleted: false}, raw: true);
    const users = await utils.Users.findAll({ raw: true });
    // console.log("findAll table ", table);
    if (req.params.id > users.length || req.params.id < 1) {
        res.status(400).send({ message: `User with id ${req.params.id} doesn't exist` });
    } else {
        try {
            // const result = await utils.Users.update({ isdeleted: true }, { where: { id: req.params.id }, returning: true, raw: true });
            const result = await utils.objectUpdateQuery({ isdeleted: true }, req.params.id );
            console.log("deleted -- ", result[1]);
            res.send(result[1]);
        } catch (err) {
            res.status(400).send({ message: `Error occured while deleting user with id: ${req.params.id}`, error: err });
        }
    }
})

//Task 3.2 ..........................
console.log("task 3.2 .............----------------.............");
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))