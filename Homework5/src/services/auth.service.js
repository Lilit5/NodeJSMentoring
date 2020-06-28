import { ERROR } from "../common/constants"
import { utils } from '../common/utils';
const schema = require('../schemas/users.post.schema');
const Joi = require('@hapi/joi');

class AuthService {
	getToken(body) {
		try {
			return utils.login(body.login, body.password);
		} catch (er) {
			throw ERROR(400, er);
		}
	}

	async validateBody(body) {
        const validateionResp = Joi.validate(body, schema);
        if (validateionResp.error) {
			throw ERROR(400, validateionResp.error.details);
		}
	}
}

const authService = new AuthService();

export default authService;
