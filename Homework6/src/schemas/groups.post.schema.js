const Joi = require('@hapi/joi');
import { PERMISSIONS } from "../common/constants";

module.exports = Joi.object().keys({
    name: Joi.string().required(),
    permissions: Joi.string().alphanum().valid(PERMISSIONS).required(),
});