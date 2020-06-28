const Joi = require('@hapi/joi');
const express = require('express');
const schema = require('./schemas/users.post.schema');
const { user } = require('./common/constants');
const app = express();
const users = [];

console.log("HI !!!!!!!!!");
app.use(express.json());

app.get('/', (req, res) => {
    res.send("!!! Hello world !!!");
});

app.post('/users', (req, res, next) => {
    const validateionResp = Joi.validate(req.body, schema);
    console.log("validateionResp.error ", validateionResp.error);
    if (validateionResp.error) {
        res.status(400).send(validateionResp.error.details);
        // res.end();
    };
    next();
}, (req, res, next) => {
    const isUserExist = users.find(user => {
        console.log("---- u ", user.login);
        console.log("---- r ", req.body.login);
        return user.login === req.body.login;
    });
    if (isUserExist) {
        console.log("aaaaaaaa");
        res.status(400).send({ message: `User with username ${req.login} already exists` });
        // res.end();
    }
    next();
}, (req, res, next) => {
    const user = {
        id: users.length + 1,
        login: req.body.login,
        password: req.body.password,
        isDeleted: false
    };
    users.push(user);
    res.send(req.body);
    console.log("modified Users = ", users);
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

app.get('/users/:id', (req, res) => {
    if (req.params.id > users.length || req.params.id < 1) {
        res.status(400).send({ message: `User with id ${req.params.id} doesn't exist` });
    } else {
        res.send(users[req.params.id - 1]);
    }
});

app.get('/users', (req, res) => {
    res.send(users);
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