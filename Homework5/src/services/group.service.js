import { groupsData} from "../data-accesses/group.data-access";
import { GET_FROM_TABLE, ERROR, GROUPS_TABLE_NAME } from "../common/constants"
const Joi = require('@hapi/joi');
const schema = require('../schemas/groups.post.schema');

class GroupService {
	async isGroupIdInvalid(id) {
		const idExists = await groupsData.getGroupById(id);
		if (idExists == null) {
			throw ERROR(400, `Group with id ${id} doesn't exist`);
		}
	}

	async getAllGroups(obj = false) {
		let groups;
		if (obj) {
			groups = await groupsData.Groups.findAll({ raw: true });
		} else {
			groups = await groupsData.sendQuery(GET_FROM_TABLE(GROUPS_TABLE_NAME));
		}
		return groups;
	}

	async updateGroup(toUpdate, id) {
		try {
			return await groupsData.updateGroup(toUpdate, id);
		} catch (er) {
			throw ERROR(400, er);
		}
	}

	async crateGroup(group) {
		try {
			return await groupsData.createGroup(group);
		} catch (er) {
			throw ERROR(400, er);
		}
	}

	async deleteGroup(group) {
		try {
			return await groupsData.deleteGroup(group);
		} catch (er) {
			throw ERROR(400, er);
		}
		
	}

	async validateBody(body) {
		console.log("cccccccccccccccccc");
		const validateionResp = Joi.validate(body, schema);
		console.log("dddddddddddddddddd");
		const groupExists = await groupsData.findByGroupname(body.name);
		console.log("groupExists ?", groupExists);
		const error = validateionResp.error ? validateionResp.error.details :
			groupExists ?
				{ message: `Group with name "${body.login}" already exists` } : null;
		if (error) {
			throw ERROR(400, error);
		}
		console.log("fffffffffffffffffffff");
	}

	async validateUpdateBody(body) {
        const validateionResp = Joi.validate(body, schema);
        if (validateionResp.error) {
			throw ERROR(400, validateionResp.error.details);
		}
	}
}

const groupService = new GroupService();

export default groupService;
