const Joi = require('@hapi/joi');
const express = require('express');
const schema = require('./schemas/users.post.schema');
import getAutoSuggestUsers from './common/utils';

const app = express();
const users = [];

app.use(express.json());

app.get('/', (req, res) => {
	res.send("!!! Hello world !!!");
});

app.post('/users', (req, res, next) => {
	const validateionResp = Joi.validate(req.body, schema);
	const error = validateionResp.error ? validateionResp.error.details :
		users.find(user => user.login === req.body.login) ?
			{message: `User with username "${req.body.login}" already exists`} : null;
	if (error) {
		res.status(400).send(error);
		return;
	}
	const user = {
		id: users.length + 1,
		login: req.body.login,
		password: req.body.password,
		age: req.body.age,
		isDeleted: false
	}
	users.push(user);
	res.send(users[users.length - 1]);
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
	if (req.query.loginContains) {
		try {
			const autoSuggestUsers = getAutoSuggestUsers(req.query.loginContains, users);
			res.send(autoSuggestUsers);
		} catch (exception) {
            res.status(400).send(exception);
        }
    } else {
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