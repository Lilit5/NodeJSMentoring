import { Router } from 'express';
import authService from '../services/auth.service';

const router = Router();

router.post('/', async (req, res) => {
	try {
		await authService.validateBody(req.body);
		const token = authService.getToken(req.body);
		res.send({token});
	} catch(err) {
		res.status(err.status).send(err.message);
	}
});

export const AuthController = router;
