import { Router } from 'express';
import userService from '../services/user.service';
import { usersData } from "../data-accesses/user.data-access";
import { utils } from '../common/utils';

const router = Router();

router.post('/', async (req, res, next) => {
	try {
		await userService.validateBody(req.body);
		const users = await userService.getAllUsers();
		const user = {
			id: users.length + 1,
			login: req.body.login,
			password: req.body.password,
			age: req.body.age,
			isdeleted: false
		}
		const response = await userService.crateUser(user);
		res.send(response.dataValues);
	} catch (err) {
		console.log(err);
		res.status(err.status).send(err.message);
	}
});

router.put('/:id', async (req, res) => {
	try {
		await userService.isUsersIdInvalid(req.params.id);
		await userService.validateUpdateBody(req.body);
		const result = await userService.updateUser({
			login: req.body.login,
			password: req.body.password,
			age: req.body.age
		}, req.params.id);
		res.send(result[1]);
	} catch (err) {
		console.log(err);
		res.status(err.status).send(err.message);
	}
});

router.get('/:id', async (req, res) => {
	try {
		await userService.isUsersIdInvalid(req.params.id);
		const user = await usersData.getUserById(req.params.id);
		res.send(user);
	} catch (err) {
		console.log(err);
		res.status(err.status).send(err.message);
	}
});

router.get('/', async (req, res) => {
	try {
		if (req.query.loginContains) {
			const autoSuggestUsers = await utils.getAutoSuggestUsers(req.query.loginContains);
			res.send(autoSuggestUsers);
		} else {
			const users = await userService.getAllUsers(true);
			res.send(users);
		}
	} catch (exception) {
		res.status(400).send(exception);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		await userService.isUsersIdInvalid(req.params.id);
		const result = await userService.updateUser({ isdeleted: true }, req.params.id);
		res.send(result[1]);
	} catch (err) {
		console.log(err);
		res.status(err.status).send(err.message);
	}
})
export const UserController = router;
