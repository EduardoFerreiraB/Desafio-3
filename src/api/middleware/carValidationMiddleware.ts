import { celebrate, Joi, Segments } from "celebrate";

export const createCarValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        model: Joi.string().required(),
        color: Joi.string().required(),
        year: Joi.number().integer().min(1950).max(2023).required(),
        valuePerDay: Joi.number().required(),
        numberOfPassengers: Joi.number().required(),
        acessories: Joi.array().items(
            Joi.object({
                name: Joi.string().required(),
            })
        ).min(1).required().unique((a, b) => a.name === b.name),
    }),
});
