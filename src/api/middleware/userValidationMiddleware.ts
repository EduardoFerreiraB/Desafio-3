import { celebrate, Joi, Segments } from "celebrate";

export const createUserValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().min(3).max(50).required(),
        cpf: Joi.string().max(14).required(),
        birth: Joi.date().max('now').required(),
        cep: Joi.string().max(9).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    }),
});
