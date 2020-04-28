import { Router } from 'express';
import userService from '../services/user.service';
import { utils } from '../common/utils';
import { GET_FROM_TABLE, TABLE_NAME, ERROR } from "../common/constants"
import { usersData } from '../data-accesses/user.data-access';

const router = Router();

// router.get('/:id', async (request, response) => {
// 	try {
// 		userService.getUserById(request.params.id);
// 	} catch (e) {
// 		response.send(500).body({error: 'something went wrong'})
// 	}
// });

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
		res.status(err.status).send(err.message);
	}
});

router.put('/:id', async (req, res) => {
	try {
		await userService.isUsersIdInvalidObj(req.params.id);
		await userService.validateUpdateBody(req.body);
		const result = await userService.updateUser({
			login: req.body.login,
			password: req.body.password,
			age: req.body.age
		}, req.params.id);
		res.send(result[1]);
	} catch (err) {
		res.status(err.status).send(err.message);
	}
});

router.get('/:id', async (req, res) => {
	try {
		await userService.isUsersIdInvalid(req.params.id);
		const user = await userService.getUserById(req.params.id);
		res.send(user);
	} catch (err) {
		console.log("errror ", err);
		res.status(err.status).send(err.message);
	}
	// const isIdInvalid = await userService.isUsersIdInvalid(req.params.id);
	// if (isIdInvalid) {
	//     res.status(isIdInvalid.status).send(isIdInvalid.message);
	// } else {
	//     const user = await userService.getUserById(req.params.id);
	//     res.send(user);
	// }
});

router.get('/', async (req, res) => {
	try {
		if (req.query.loginContains) {
			const autoSuggestUsers = await utils.getAutoSuggestUsers(req.query.loginContains);
			res.send(autoSuggestUsers);
		} else {
			const users = await userService.getAllUsers();
			res.send(users);
		}
	} catch (exception) {
		console.log("ererer ", exception);
		res.status(400).send(exception);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		await userService.isUsersIdInvalidObj(req.params.id);
		const result = await userService.updateUser({ isdeleted: true }, req.params.id);
		res.send(result[1]);
	} catch (err) {
		res.status(err.status).send(err.message);
	}
})
export const UserController = router;
