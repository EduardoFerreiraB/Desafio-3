import { celebrate, Joi, Segments } from "celebrate";

export const createCarValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        model: Joi.string().min(5).max(50).required(),
        color: Joi.string().min(5).max(20).required(),
        year: Joi.number().integer().min(1950).max(2023).required(),
        valuePerDay: Joi.number().min(0).required(),
        numberOfPassengers: Joi.number().min(1).required(),
        acessories: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
            })
        ).min(1).required().unique((a, b) => a.name === b.name),
    }),
});
