import { celebrate, Joi, Segments } from "celebrate";

export const createReserveValidation = celebrate({
    [Segments.BODY]: Joi.object().keys({
        startDate: Joi.required(),
        endDate: Joi.required(),
        carId: Joi.number().required(),
    }),
});
