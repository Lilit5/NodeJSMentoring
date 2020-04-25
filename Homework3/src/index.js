const Joi = require('@hapi/joi');
const express = require('express');
const schema = require('./schemas/users.post.schema');
import { utils } from './common/utils';
import { GET_FROM_TABLE, CREATE_USERS_TABLE } from "./common/constants";

const tableName = "users";
// const Pg = require("pg").Client;
// const connection = "postgres://postgres:post123@localhost/apicrud";
// const  pg = new Pg(connection);
// pg.connect();

// const query = pg.query("SELECT * FROM users;", function(err, result) {
//     let json = JSON.stringify(result.rows);
//     console.log("resp: ", json);
//     console.log("err: ", err);
// });
(async function() {
    const table1 = await utils.sendQuery(GET_FROM_TABLE(tableName));
    console.log("table1 ", table1);
}());

// utils.objectQuery();
// const createTable = utils.sendQuery(CREATE_USERS_TABLE("users1"));
// console.log(createTable);
const app = express();
// const users = [];

app.use(express.json());

app.get('/', (req, res) => {
    res.send("!!! Hello world !!!");
});

app.post('/users', async (req, res, next) => {
    const validateionResp = Joi.validate(req.body, schema);
    const users = await utils.sendQuery(GET_FROM_TABLE(tableName));
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

app.put('/users/:id', (req, res) => {
    if (req.params.id > users.length || req.params.id < 1) {
        res.status(400).send({ message: `User with id ${req.params.id} doesn't exist` });
    } else {
        const validateionResp = Joi.validate(req.body, schema);
        if (validateionResp.error) {
            res.status(400).send(validateionResp.error.details);
        } else {
            const userIndex = users.findIndex(user => user.id === parseInt(req.params.id));
            users[userIndex].login = req.body.login;
            users[userIndex].password = req.body.password;
            users[userIndex].age = req.body.age;
            res.send(users[userIndex]);
        }
    }
})

app.get('/users/:id', async (req, res) => {
    const users = await utils.sendQuery(GET_FROM_TABLE(tableName));
    if (req.params.id > users.length || req.params.id < 1) {
        res.status(400).send({ message: `User with id ${req.params.id} doesn't exist` });
    } else {
        res.send(users[req.params.id - 1]);
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

app.delete('/users/:id', (req, res) => {
    if (req.params.id > users.length || req.params.id < 1) {
        res.status(400).send({ message: `User with id ${req.params.id} doesn't exist` });
    } else {
        users[req.params.id - 1].isDeleted = true;
        res.send(users[req.params.id - 1]);
    }
})
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))