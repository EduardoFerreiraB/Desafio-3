import { celebrate, Joi, Segments } from "celebrate";

export const updateUserValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().min(3).max(50),
        cpf: Joi.string().max(14),
        birth: Joi.date().max('now'),
        cep: Joi.string().max(9),
        email: Joi.string().email(),
        password: Joi.string().min(6),
    }),
});
