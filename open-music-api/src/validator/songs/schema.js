const Joi = require("joi");

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  duration: Joi.number().integer(),
  albumId: Joi.string(),
});

const SongQuerySchema = Joi.object({
  title: Joi.string().empty(''),
  performer: Joi.string().empty('')
});

module.exports = { SongPayloadSchema, SongQuerySchema };