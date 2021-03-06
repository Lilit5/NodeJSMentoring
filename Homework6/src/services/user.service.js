import { usersData } from "../data-accesses/user.data-access";
import { GET_FROM_TABLE, TABLE_NAME, ERROR } from "../common/constants"
const Joi = require('@hapi/joi');
const schema = require('../schemas/users.post.schema');

class UserService {
	async isUsersIdInvalid(id) {
		const idExists = await usersData.getUserById(id);
		if (idExists == null) {
			throw ERROR(400, `User with id ${id} doesn't exist`);
		}
	}

	async getAllUsers(obj = false) {
		let users;
		if (obj) {
			users = await usersData.Users.findAll({ raw: true });
		} else {
			users = await usersData.sendQuery(GET_FROM_TABLE(TABLE_NAME));
		}
		return users;
	}

	async updateUser(toUpdate, id) {
		try {
			return await usersData.objectUpdateQuery(toUpdate, id);
		} catch (er) {
			throw ERROR(400, er);
		}
	}

	async crateUser(user) {
		try {
			return await usersData.objectCreateQuery(user);
		} catch (er) {
			throw ERROR(400, er);
		}
	}

	async validateBody(body) {
		const validateionResp = Joi.validate(body, schema);
		const userexists = await usersData.findByUsername(body.login);
		const error = validateionResp.error ? validateionResp.error.details :
			userexists ?
				{ message: `User with username "${body.login}" already exists` } : null;
		if (error) {
			throw ERROR(400, error);
		}
	}

	async validateUpdateBody(body) {
        const validateionResp = Joi.validate(body, schema);
        if (validateionResp.error) {
			throw ERROR(400, validateionResp.error.details);
		}

	}
}

const userService = new UserService();

export default userService;
