import Joi, {ObjectSchema } from "joi";

const createWordSchema: ObjectSchema = Joi.object().keys({
    text: Joi.string().required().max(255),
});

const editWordSchema: ObjectSchema = Joi.object().keys({
    id: Joi.number().required(),
    text: Joi.string().max(255),
});

const createCategorySchema: ObjectSchema = Joi.object().keys({
    name: Joi.string().required().max(100),
});

const editCategorySchema: ObjectSchema = Joi.object().keys({
    id: Joi.number().required(),
    name: Joi.string().max(100),
});

const createWordsByCategorySchema: ObjectSchema = Joi.object().keys({
    category: createCategorySchema.required(),
    word: Joi.array().items(createWordSchema).required(),
});

const createPlayRoomSchema: ObjectSchema = Joi.object().keys({
    name: Joi.string().required().max(100),
    state: Joi.string().required().max(20),
    categoryId: Joi.number().required(),
});

export default {
    createWordSchema,
    editWordSchema,
    createCategorySchema,
    editCategorySchema,
    createWordsByCategorySchema,
    createPlayRoomSchema,
};
