import { Router } from 'express';
import groupService from '../services/group.service';
import { groupsData } from "../data-accesses/group.data-access";

const router = Router();

router.post('/', async (req, res, next) => {
	try {
		await groupService.validateBody(req.body);
		const groups = await groupService.getAllGroups();
		const group = {
			id: groups.length + 1,
			name: req.body.name,
			permissions: req.body.permissions
		}
		const response = await groupService.crateGroup(group);
		res.send(response.dataValues);
} catch (err) {
		res.status(err.status).send(err.message);
	}
});

router.put('/:id', async (req, res) => {
	try {
		await groupService.isGroupIdInvalid(req.params.id);
		await groupService.validateUpdateBody(req.body);
		const result = await groupService.updateGroup({
			name: req.body.name,
			permissions: req.body.permissions
		}, req.params.id);
		res.send(result[1]);
	} catch (err) {
		res.status(err.status).send(err.message);
	}
});

router.get('/:id', async (req, res) => {
	try {
		await groupService.isGroupIdInvalid(req.params.id);
		const group = await groupsData.getGroupById(req.params.id);
		res.send(group);
	} catch (err) {
		res.status(err.status).send(err.message);
	}
});

router.get('/', async (req, res) => {
	try {
		const groups = await groupService.getAllGroups(true);
		res.send(groups);
	} catch (exception) {
		res.status(400).send(exception);
	}
});

router.delete('/:id', async (req, res) => {
	try {
		await groupService.isGroupIdInvalid(req.params.id);
		await groupService.deleteGroup(req.params.id);
		res.send({message: "success"});
	} catch (err) {
		res.status(err.status).send(err.message);
	}
})
export const GroupController = router;
