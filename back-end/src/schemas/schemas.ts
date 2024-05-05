import Joi, {ObjectSchema } from "joi";

const wordSchema: ObjectSchema = Joi.object().keys({
    id: Joi.number().required(),
    text: Joi.string().required().max(100),
});

const categorySchema: ObjectSchema = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().required().max(100),
});

const wordsByCategorySchema: ObjectSchema = Joi.object().keys({
    id: Joi.number().required(),
    category: categorySchema.required(),
    word: Joi.array().items(wordSchema).required(),
});

const playRoomSchema: ObjectSchema = Joi.object().keys({
    name: Joi.string().required().max(100),
    state: Joi.string().required().max(20),
    categoryId: Joi.number().required(),
});

export default {
    "/words": wordSchema,
    "/categories": categorySchema,
    "/words-by-category": wordsByCategorySchema,
    "/play-rooms": playRoomSchema,
} as {[key: string]: ObjectSchema};
