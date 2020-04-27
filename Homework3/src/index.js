const Joi = require('@hapi/joi');
const express = require('express');
const schema = require('./schemas/users.post.schema');
import { utils } from './common/utils';
import { GET_FROM_TABLE, CREATE_USERS_TABLE, TABLE_NAME } from "./common/constants";

const tableName = TABLE_NAME;
(async function () {
    const table = await utils.sendQuery(CREATE_USERS_TABLE(tableName));
    console.log("Created Table ", table);
}());
(async function () {
    const table = await utils.sendQuery(GET_FROM_TABLE(tableName));
    console.log("Table content ", table);
}());

const app = express();

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
            const result = await utils.objectUpdateQuery({
                 login: req.body.login,
                 password: req.body.password,
                 age: req.body.age
                }, req.params.id);
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
    const users = await utils.Users.findAll({ raw: true });
    if (req.params.id > users.length || req.params.id < 1) {
        res.status(400).send({ message: `User with id ${req.params.id} doesn't exist` });
    } else {
        try {
            const result = await utils.objectUpdateQuery({ isdeleted: true }, req.params.id );
            res.send(result[1]);
        } catch (err) {
            res.status(400).send({ message: `Error occured while deleting user with id: ${req.params.id}`, error: err });
        }
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port} ...`))